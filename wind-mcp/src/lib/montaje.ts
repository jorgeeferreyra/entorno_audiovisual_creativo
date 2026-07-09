import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { PROJECT_ROOT } from '../config.js';
import { ensureDirFor } from './paths.js';

export interface MontarSecuenciaInput {
  clips: string[];
  audio?: string;
  salida: string;
  aspect?: '9:16' | '16:9';
}

export interface MontarSecuenciaResult {
  localPath: string;
  clipCount: number;
  hasAudio: boolean;
}

function resolvePath(p: string): string {
  return path.isAbsolute(p) ? p : path.join(PROJECT_ROOT, p);
}

async function runFfmpeg(args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const proc = spawn('ffmpeg', ['-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr?.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg salió ${code}: ${stderr.slice(-500)}`));
    });
    proc.on('error', reject);
  });
}

/** Mezcla una pista de audio sobre el video (o copia sin audio). Devuelve si hubo audio. */
async function muxAudioOrCopy(videoOnly: string, outPath: string, audio?: string): Promise<boolean> {
  if (!audio) {
    await fs.copyFile(videoOnly, outPath);
    return false;
  }
  const audioPath = resolvePath(audio);
  await fs.access(audioPath);
  await runFfmpeg([
    '-i', videoOnly,
    '-i', audioPath,
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '192k',
    '-shortest',
    outPath,
  ]);
  return true;
}

export async function montarSecuencia(input: MontarSecuenciaInput): Promise<MontarSecuenciaResult> {
  const clipPaths = input.clips.map(resolvePath);
  for (const c of clipPaths) {
    await fs.access(c);
  }

  const outPath = resolvePath(input.salida);
  await ensureDirFor(outPath);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wind-mcp-'));
  const listFile = path.join(tmpDir, 'concat.txt');
  const concatBody = clipPaths.map((c) => `file '${c.replace(/'/g, "'\\''")}'`).join('\n');
  await fs.writeFile(listFile, concatBody);

  const aspect = input.aspect ?? '9:16';
  const [w, h] = aspect === '9:16' ? [1080, 1920] : [1920, 1080];
  const vf = `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,setsar=1`;

  const videoOnly = path.join(tmpDir, 'video-only.mp4');

  try {
    await runFfmpeg([
      '-f', 'concat', '-safe', '0', '-i', listFile,
      '-vf', vf,
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-an',
      videoOnly,
    ]);

    await muxAudioOrCopy(videoOnly, outPath, input.audio);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }

  return {
    localPath: outPath,
    clipCount: clipPaths.length,
    hasAudio: !!input.audio,
  };
}

export interface MontarPantallaPartidaInput {
  /** Clip de la mitad superior del 9:16. */
  top: string;
  /** Clip de la mitad inferior del 9:16. */
  bottom: string;
  audio?: string;
  salida: string;
}

export interface MontarPantallaPartidaResult {
  localPath: string;
  hasAudio: boolean;
}

/**
 * Pantalla partida 9:16 (Reel B "Vidas paralelas"): dos clips independientes
 * apilados (mitad superior / inferior). NO genera personajes juntos — es puro
 * montaje, como manda el pipeline. La duración resultante es la del clip más
 * corto (vstack termina con el menor).
 */
export async function montarPantallaPartida(
  input: MontarPantallaPartidaInput,
): Promise<MontarPantallaPartidaResult> {
  const topPath = resolvePath(input.top);
  const bottomPath = resolvePath(input.bottom);
  await fs.access(topPath);
  await fs.access(bottomPath);

  const outPath = resolvePath(input.salida);
  await ensureDirFor(outPath);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wind-mcp-'));
  const videoOnly = path.join(tmpDir, 'video-only.mp4');

  // 9:16 = 1080x1920; cada mitad ocupa 1080x960.
  const half =
    'scale=1080:960:force_original_aspect_ratio=decrease,pad=1080:960:(ow-iw)/2:(oh-ih)/2,setsar=1';
  const filter = `[0:v]${half}[t];[1:v]${half}[b];[t][b]vstack=inputs=2[v]`;

  try {
    await runFfmpeg([
      '-i', topPath,
      '-i', bottomPath,
      '-filter_complex', filter,
      '-map', '[v]',
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-an',
      videoOnly,
    ]);
    const hasAudio = await muxAudioOrCopy(videoOnly, outPath, input.audio);
    return { localPath: outPath, hasAudio };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
