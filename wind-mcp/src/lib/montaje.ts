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

    if (input.audio) {
      const audioPath = resolvePath(input.audio);
      await fs.access(audioPath);
      await runFfmpeg([
        '-i', videoOnly,
        '-i', audioPath,
        '-c:v', 'copy',
        '-c:a', 'aac', '-b:a', '192k',
        '-shortest',
        outPath,
      ]);
    } else {
      await fs.copyFile(videoOnly, outPath);
    }
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }

  return {
    localPath: outPath,
    clipCount: clipPaths.length,
    hasAudio: !!input.audio,
  };
}
