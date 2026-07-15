import fs from 'node:fs/promises';
import path from 'node:path';
import { loadWindComicEnv, resolveReadPath, resolveWritePath, windComicBaseUrl } from '../config.js';
import { downloadToFile, fileToDataUri } from './download.js';
import { ensureDirFor, madrePath } from './paths.js';

export interface GenerarImagenInput {
  prompt: string;
  aspect?: '16:9' | '9:16' | '1:1' | '2.35:1' | '4:3' | '3:4';
  /** Rutas locales o URLs http(s) de imágenes de referencia (ej. lock m01). */
  refs?: string[];
  arco: number;
  id: string;
  slug: string;
  /** Override del destino (absoluto o relativo al episodio); por defecto assets/arco-N/madre/{id}-{slug}.png. Usado para candidatos. */
  destOverride?: string;
  /** Preferir un provider del registry (ej. 'openrouter' = Nano Banana). Se pasa como prefer. */
  provider?: string;
  /** Si true, excluye el resto de la cadena: solo intenta `provider` (falla en vez de fallback silencioso). */
  soloProvider?: boolean;
}

export interface GenerarImagenResult {
  localPath: string;
  imageUrl: string;
  provider: string;
  estCostCny?: number;
  mock: boolean;
}

export async function generarImagen(input: GenerarImagenInput): Promise<GenerarImagenResult> {
  loadWindComicEnv();
  await import('@/lib/image-providers/builtins');
  const { dispatchImageGenerate, listImageProviders } = await import('@/lib/image-providers/registry');

  const aspect = input.aspect ?? '9:16';
  const mock = process.env.MOCK_ENGINES === '1';
  const preferProvider = input.provider
    || (input.refs?.length ? 'minimax-multi' : undefined);
  // OpenRouter acepta data-URIs: no hace falta subir refs a Minimax.
  const useDataUriRefs = preferProvider === 'openrouter' || mock;

  const refUrls: string[] = [];
  for (const ref of input.refs ?? []) {
    if (/^https?:\/\//.test(ref)) {
      refUrls.push(ref);
      continue;
    }
    const local = resolveReadPath(ref);
    if (useDataUriRefs) {
      refUrls.push(await fileToDataUri(local));
      continue;
    }
    // Modo real: URL http vía upload a Minimax — el fallback kontext (Qingyun) descarta
    // data-URIs y perdería la consistencia. Si el upload falla, degradamos a data-URI
    // (Minimax multi-ref lo acepta igual).
    try {
      refUrls.push(await uploadImageToMinimax(local));
    } catch (e) {
      console.warn('[wind-mcp] upload ref a Minimax falló, uso data-URI (solo Minimax la verá):', e instanceof Error ? e.message : e);
      refUrls.push(await fileToDataUri(local));
    }
  }

  let exclude: Set<string> | undefined;
  if (input.soloProvider && preferProvider) {
    exclude = new Set(
      listImageProviders()
        .map((p: { id: string }) => p.id)
        .filter((id: string) => id !== preferProvider),
    );
  }

  const { result, tried } = await dispatchImageGenerate(
    {
      prompt: input.prompt,
      aspectRatio: aspect,
      referenceImages: refUrls.length ? refUrls : undefined,
      label: input.id,
    },
    { refCount: refUrls.length, prefer: preferProvider, exclude },
  );

  if (!result?.imageUrl) {
    const errors = tried.map((t: { id: string; error: string }) => `${t.id}: ${t.error}`).join('; ');
    throw new Error(`generar_imagen falló. Intentos: ${errors || 'ninguno'}`);
  }

  const destPath = input.destOverride
    ? resolveWritePath(input.destOverride)
    : madrePath(input.arco, input.id, input.slug);
  await ensureDirFor(destPath);

  if (result.imageUrl.startsWith('data:')) {
    const b64 = result.imageUrl.split(',')[1];
    await fs.writeFile(destPath, Buffer.from(b64, 'base64'));
  } else {
    await downloadToFile(result.imageUrl, destPath);
  }

  return {
    localPath: destPath,
    imageUrl: result.imageUrl,
    provider: result.provider,
    estCostCny: result.estCostCny,
    mock,
  };
}

/** Sube imagen local a wind-comic y devuelve URL absoluta (mock / local). */
export async function uploadImageToWindComic(localPath: string): Promise<string> {
  const base = windComicBaseUrl();
  const dataUri = await fileToDataUri(localPath);
  const res = await fetch(`${base}/api/upload/character-face`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl: dataUri }),
  });
  const body = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !body.url) {
    throw new Error(body.error || `upload wind-comic falló (${res.status})`);
  }
  const rel = body.url.startsWith('http') ? body.url : `${base}${body.url.startsWith('/') ? '' : '/'}${body.url}`;
  return rel;
}

/** Sube imagen a Minimax y devuelve download_url pública para I2V. */
export async function uploadImageToMinimax(localPath: string): Promise<string> {
  loadWindComicEnv();
  const key = process.env.MINIMAX_API_KEY;
  if (!key || key.startsWith('your_')) {
    throw new Error('MINIMAX_API_KEY no configurada para subir imagen');
  }
  const base = (process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com').replace(/\/+$/, '');
  const groupQ = process.env.MINIMAX_GROUP_ID ? `?GroupId=${encodeURIComponent(process.env.MINIMAX_GROUP_ID)}` : '';

  const buf = await fs.readFile(localPath);
  const form = new FormData();
  form.append('purpose', 'image');
  form.append('file', new Blob([buf]), path.basename(localPath));

  const up = await fetch(`${base}/v1/files/upload${groupQ}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
    signal: AbortSignal.timeout(60_000),
  });
  if (!up.ok) {
    throw new Error(`Minimax upload falló (${up.status}): ${(await up.text()).slice(0, 200)}`);
  }
  const upJson = (await up.json()) as { file?: { file_id?: string }; file_id?: string };
  const fileId = upJson.file?.file_id ?? upJson.file_id;
  if (!fileId) throw new Error('Minimax upload: sin file_id');

  const retrieve = await fetch(`${base}/v1/files/retrieve?file_id=${fileId}${groupQ ? `&GroupId=${encodeURIComponent(process.env.MINIMAX_GROUP_ID!)}` : ''}`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (!retrieve.ok) {
    throw new Error(`Minimax retrieve falló (${retrieve.status})`);
  }
  const retJson = (await retrieve.json()) as { file?: { download_url?: string }; download_url?: string };
  const downloadUrl = retJson.file?.download_url ?? retJson.download_url;
  if (!downloadUrl) throw new Error('Minimax retrieve: sin download_url');
  return downloadUrl;
}

/**
 * Resuelve un frame (first/last) a una URL/payload que los providers de video
 * puedan consumir:
 *   1. URL remota http(s) pública (no localhost, no data:) → tal cual.
 *   2. Si no → data-URI del archivo local.
 *      Minimax I2V acepta data:image/...; Kling convierte a Base64 crudo en service.
 *      (Minimax /v1/files/upload ya no admite purpose=image — solo audio/video.)
 */
export async function resolveFrameUrl(
  localPath: string,
  remoteUrl?: string,
): Promise<string> {
  if (
    remoteUrl &&
    /^https?:\/\//.test(remoteUrl) &&
    !remoteUrl.startsWith('data:') &&
    !remoteUrl.includes('localhost') &&
    !remoteUrl.includes('127.0.0.1')
  ) {
    return remoteUrl;
  }
  return fileToDataUri(localPath);
}
