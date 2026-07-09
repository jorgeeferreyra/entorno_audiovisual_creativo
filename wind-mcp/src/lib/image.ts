import fs from 'node:fs/promises';
import path from 'node:path';
import { loadWindComicEnv, PROJECT_ROOT, windComicBaseUrl } from '../config.js';
import { downloadToFile, fileToDataUri } from './download.js';
import { ensureDirFor } from './paths.js';

export interface GenerarImagenInput {
  prompt: string;
  aspect?: '16:9' | '9:16' | '1:1' | '2.35:1' | '4:3' | '3:4';
  refs?: string[];
  arco: number;
  id: string;
  slug: string;
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
  const { dispatchImageGenerate } = await import('@/lib/image-providers/registry');

  const aspect = input.aspect ?? '9:16';
  const refUrls = (input.refs ?? []).filter((u) => /^https?:\/\//.test(u));

  const { result, tried } = await dispatchImageGenerate(
    {
      prompt: input.prompt,
      aspectRatio: aspect,
      referenceImages: refUrls.length ? refUrls : undefined,
      label: input.id,
    },
    { refCount: refUrls.length },
  );

  if (!result?.imageUrl) {
    const errors = tried.map((t: { id: string; error: string }) => `${t.id}: ${t.error}`).join('; ');
    throw new Error(`generar_imagen falló. Intentos: ${errors || 'ninguno'}`);
  }

  const destPath = path.join(
    PROJECT_ROOT,
    'assets',
    `arco-${input.arco}`,
    'madre',
    `${input.id}-${input.slug}.png`,
  );
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
    mock: process.env.MOCK_ENGINES === '1',
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

export async function resolveFrameUrlForVideo(
  localPath: string,
  remoteUrl?: string,
): Promise<string> {
  if (remoteUrl && /^https?:\/\//.test(remoteUrl) && !remoteUrl.includes('localhost')) {
    return remoteUrl;
  }
  if (process.env.MOCK_ENGINES === '1') {
    return uploadImageToWindComic(localPath);
  }
  return uploadImageToMinimax(localPath);
}
