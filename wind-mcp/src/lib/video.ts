import path from 'node:path';
import { loadWindComicEnv, PROJECT_ROOT, type CameraPreset } from '../config.js';
import { downloadToFile } from './download.js';
import { resolveFrameUrlForVideo, uploadImageToWindComic } from './image.js';
import { ensureDirFor } from './paths.js';

export interface GenerarVideoI2VInput {
  imagen: string;
  imageUrl?: string;
  motionPrompt: string;
  duration?: 5 | 6 | 10 | 15;
  cameraPreset?: CameraPreset;
  arco: number;
  id: string;
  slug: string;
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

function clipDest(arco: number, id: string, slug: string): string {
  return path.join(PROJECT_ROOT, 'assets', `arco-${arco}`, 'clips', `${id}-${slug}.mp4`);
}

async function generateViaRegistry(
  prompt: string,
  opts: {
    firstFrameUrl?: string;
    lastFrameUrl?: string;
    duration: number;
  },
): Promise<{ videoUrl: string; provider: string; warning?: string }> {
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
    },
  );

  if (!result?.videoUrl) {
    const errors = tried.map((t: { id: string; error: string }) => `${t.id}: ${t.error}`).join('; ');
    throw new Error(`generar_video falló. Intentos: ${errors || 'ninguno'}`);
  }
  return { videoUrl: result.videoUrl, provider: result.provider };
}

async function generateViaMinimax(
  imageUrl: string,
  prompt: string,
  duration: number,
): Promise<{ videoUrl: string; provider: string }> {
  loadWindComicEnv();
  const { MinimaxService } = await import('@/services/minimax.service');
  const svc = new MinimaxService();
  const videoUrl = await svc.generateVideo(imageUrl, prompt, {
    duration,
    aspectRatio: '9:16',
  });
  if (!videoUrl) throw new Error('Minimax devolvió video vacío');
  return { videoUrl, provider: 'Minimax-I2V' };
}

async function resolveFrameUrlForKling(localPath: string, remoteUrl?: string): Promise<string> {
  if (remoteUrl && /^https?:\/\//.test(remoteUrl) && !remoteUrl.startsWith('data:')) {
    return remoteUrl;
  }
  return uploadImageToWindComic(localPath);
}

async function generateFlfViaKling(
  firstLocal: string,
  lastLocal: string,
  firstRemote: string | undefined,
  lastRemote: string | undefined,
  prompt: string,
  duration: 5 | 10,
): Promise<{ videoUrl: string; provider: string; warning?: string }> {
  loadWindComicEnv();
  const { KlingService } = await import('@/services/kling.service');
  const { API_CONFIG } = await import('@/lib/config');
  const klingReady = API_CONFIG.keling.apiKey && !API_CONFIG.keling.apiKey.startsWith('your_');

  if (klingReady) {
    try {
      const klingFirst = await resolveFrameUrlForKling(firstLocal, firstRemote);
      const klingLast = await resolveFrameUrlForKling(lastLocal, lastRemote);
      const k = new KlingService();
      const videoUrl = await k.generateFirstLastFrame(klingFirst, klingLast, prompt, {
        duration,
        mode: 'professional',
      });
      if (videoUrl) return { videoUrl, provider: 'Kling-FLF' };
    } catch (e) {
      console.warn('[wind-mcp] Kling FLF falló, fallback Minimax:', e);
    }
  }

  const minimaxUrl = await resolveFrameUrlForVideo(firstLocal, firstRemote);
  const { videoUrl, provider } = await generateViaMinimax(minimaxUrl, prompt, duration === 10 ? 6 : 5);
  return {
    videoUrl,
    provider: `${provider}-fallback`,
    warning: 'Kling FLF no disponible; degradado a Minimax I2V (solo primer frame)',
  };
}

export async function generarVideoI2V(input: GenerarVideoI2VInput): Promise<GenerarVideoResult> {
  loadWindComicEnv();
  const localPath = path.isAbsolute(input.imagen) ? input.imagen : path.join(PROJECT_ROOT, input.imagen);

  const duration = input.duration ?? 5;
  const prompt = await enhanceMotionPrompt(input.motionPrompt, input.cameraPreset);
  const mock = process.env.MOCK_ENGINES === '1';

  let videoUrl: string;
  let provider: string;
  let warning: string | undefined;

  if (mock) {
    const frameUrl = await resolveFrameUrlForVideo(localPath, input.imageUrl);
    const out = await generateViaRegistry(prompt, { firstFrameUrl: frameUrl, duration });
    videoUrl = out.videoUrl;
    provider = out.provider;
  } else {
    const frameUrl = await resolveFrameUrlForVideo(localPath, input.imageUrl);
    try {
      const out = await generateViaMinimax(frameUrl, prompt, duration);
      videoUrl = out.videoUrl;
      provider = out.provider;
    } catch {
      const out = await generateViaRegistry(prompt, { firstFrameUrl: frameUrl, duration });
      videoUrl = out.videoUrl;
      provider = out.provider;
    }
  }

  const destPath = clipDest(input.arco, input.id, input.slug);
  await ensureDirFor(destPath);
  await downloadToFile(videoUrl, destPath);

  return { localPath: destPath, videoUrl, provider, duration, mock, warning };
}

export async function generarVideoFLF(input: GenerarVideoFLFInput): Promise<GenerarVideoResult> {
  loadWindComicEnv();
  const firstLocal = path.isAbsolute(input.firstFrame) ? input.firstFrame : path.join(PROJECT_ROOT, input.firstFrame);
  const lastLocal = path.isAbsolute(input.lastFrame) ? input.lastFrame : path.join(PROJECT_ROOT, input.lastFrame);
  const duration = input.duration ?? 5;
  const prompt = await enhanceMotionPrompt(input.motionPrompt, input.cameraPreset);
  const mock = process.env.MOCK_ENGINES === '1';

  let videoUrl: string;
  let provider: string;
  let warning: string | undefined;

  if (mock) {
    const firstUrl = await resolveFrameUrlForKling(firstLocal, input.firstFrameUrl);
    const lastUrl = await resolveFrameUrlForKling(lastLocal, input.lastFrameUrl);
    const out = await generateViaRegistry(prompt, {
      firstFrameUrl: firstUrl,
      lastFrameUrl: lastUrl,
      duration,
    });
    videoUrl = out.videoUrl;
    provider = out.provider;
  } else {
    const out = await generateFlfViaKling(
      firstLocal,
      lastLocal,
      input.firstFrameUrl,
      input.lastFrameUrl,
      prompt,
      duration,
    );
    videoUrl = out.videoUrl;
    provider = out.provider;
    warning = out.warning;
  }

  const destPath = clipDest(input.arco, input.id, input.slug);
  await ensureDirFor(destPath);
  await downloadToFile(videoUrl, destPath);

  return { localPath: destPath, videoUrl, provider, duration, mock, warning };
}
