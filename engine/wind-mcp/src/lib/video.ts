import { loadWindComicEnv, resolveReadPath, type CameraPreset } from '../config.js';
import { downloadToFile } from './download.js';
import { resolveFrameUrl } from './image.js';
import { clipPath, ensureDirFor } from './paths.js';

export interface GenerarVideoI2VInput {
  imagen: string;
  imageUrl?: string;
  motionPrompt: string;
  duration?: 5 | 6 | 10 | 15;
  cameraPreset?: CameraPreset;
  arco: number;
  id: string;
  slug: string;
  /** Provider preferido del registry (prefer); si no califica/falla, el registry cae al resto. */
  provider?: string;
}

export interface GenerarVideoFLFInput {
  firstFrame: string;
  lastFrame: string;
  firstFrameUrl?: string;
  lastFrameUrl?: string;
  motionPrompt: string;
  duration?: 5 | 10;
  cameraPreset?: CameraPreset;
  arco: number;
  id: string;
  slug: string;
  /** Provider preferido del registry (prefer); FLF hoy solo lo cubre Kling. */
  provider?: string;
}

export interface GenerarVideoResult {
  localPath: string;
  videoUrl: string;
  provider: string;
  duration: number;
  mock: boolean;
  warning?: string;
}

async function enhanceMotionPrompt(raw: string, cameraPreset?: string): Promise<string> {
  loadWindComicEnv();
  const { checkAndSanitize } = await import('@/lib/prompt-guardrails');
  const { enhanceU2VMotionPrompt } = await import('@/lib/prompt-templates');
  const verdict = checkAndSanitize(raw, { task: 'u2v-motion' });
  if (!verdict.ok) throw new Error(verdict.userMessage || 'prompt bloqueado por guardrails');
  return enhanceU2VMotionPrompt(verdict.sanitized, cameraPreset || undefined);
}

/**
 * Único punto de generación de video: despacha por el registry de wind-comic
 * (Strategy + fallback + health-cache + retry ya resueltos). `prefer` sube el
 * provider elegido al frente de la cadena; el resto queda como fallback ordenado
 * por prioridad. Ningún motor está hardcodeado: el registry filtra por capability
 * (I2V vs FLF) y duración. Falla ruidoso si la cadena entera cae.
 */
async function generateViaRegistry(
  prompt: string,
  opts: {
    firstFrameUrl?: string;
    lastFrameUrl?: string;
    duration: number;
    prefer?: string;
  },
): Promise<{ videoUrl: string; provider: string }> {
  loadWindComicEnv();
  await import('@/lib/video-providers/builtins');
  const { dispatchVideoGenerate } = await import('@/lib/video-providers/registry');

  const hasFirst = !!opts.firstFrameUrl;
  const hasLast = !!opts.lastFrameUrl;

  const { result, tried } = await dispatchVideoGenerate(
    {
      prompt,
      firstFrameUrl: opts.firstFrameUrl,
      lastFrameUrl: opts.lastFrameUrl,
      durationSec: opts.duration,
      aspectRatio: '9:16',
      label: 'wind-mcp',
    },
    {
      hasFirstFrame: hasFirst,
      hasLastFrame: hasLast,
      hasSubjectReference: false,
      durationSec: opts.duration,
      prefer: opts.prefer,
    },
  );

  if (!result?.videoUrl) {
    const errors = tried.map((t: { id: string; error: string }) => `${t.id}: ${t.error}`).join('; ');
    throw new Error(`generar_video falló. Intentos: ${errors || 'ninguno'}`);
  }
  return { videoUrl: result.videoUrl, provider: result.provider };
}

export async function generarVideoI2V(input: GenerarVideoI2VInput): Promise<GenerarVideoResult> {
  loadWindComicEnv();
  const localPath = resolveReadPath(input.imagen);

  const duration = input.duration ?? 5;
  const prompt = await enhanceMotionPrompt(input.motionPrompt, input.cameraPreset);
  const mock = process.env.MOCK_ENGINES === '1';

  const frameUrl = await resolveFrameUrl(localPath, input.imageUrl);
  const { videoUrl, provider } = await generateViaRegistry(prompt, {
    firstFrameUrl: frameUrl,
    duration,
    prefer: input.provider,
  });

  const destPath = clipPath(input.arco, input.id, input.slug);
  await ensureDirFor(destPath);
  await downloadToFile(videoUrl, destPath);

  return { localPath: destPath, videoUrl, provider, duration, mock };
}

export async function generarVideoFLF(input: GenerarVideoFLFInput): Promise<GenerarVideoResult> {
  loadWindComicEnv();
  const firstLocal = resolveReadPath(input.firstFrame);
  const lastLocal = resolveReadPath(input.lastFrame);
  const duration = input.duration ?? 5;
  const prompt = await enhanceMotionPrompt(input.motionPrompt, input.cameraPreset);
  const mock = process.env.MOCK_ENGINES === '1';

  const firstUrl = await resolveFrameUrl(firstLocal, input.firstFrameUrl);
  const lastUrl = await resolveFrameUrl(lastLocal, input.lastFrameUrl);

  let videoUrl: string;
  let provider: string;
  let warning: string | undefined;

  try {
    const out = await generateViaRegistry(prompt, {
      firstFrameUrl: firstUrl,
      lastFrameUrl: lastUrl,
      duration,
      prefer: input.provider,
    });
    videoUrl = out.videoUrl;
    provider = out.provider;
  } catch (e) {
    // Degradación agnóstica del provider: si ningún motor del registry cubre FLF
    // (o la cadena FLF entera cae), re-despachar como I2V (solo primer frame).
    // Nunca en silencio.
    console.warn('[wind-mcp] FLF no disponible en el registry, degradando a I2V (solo primer frame):', e);
    const out = await generateViaRegistry(prompt, {
      firstFrameUrl: firstUrl,
      duration,
      prefer: input.provider,
    });
    videoUrl = out.videoUrl;
    provider = `${out.provider}-fallback`;
    warning = 'FLF no disponible; degradado a I2V (solo primer frame)';
  }

  const destPath = clipPath(input.arco, input.id, input.slug);
  await ensureDirFor(destPath);
  await downloadToFile(videoUrl, destPath);

  return { localPath: destPath, videoUrl, provider, duration, mock, warning };
}
