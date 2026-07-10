import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ensureDirFor } from './paths.js';

const DEFAULT_HEIGHT = 1024;

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

/** Une dos imágenes lado a lado (estilo | anatomía) para 1 subject_reference de Minimax. */
export async function compositeRefs(
  basePath: string,
  anatomyPath: string,
  outPath: string,
  height = DEFAULT_HEIGHT,
): Promise<string> {
  await fs.access(basePath);
  await fs.access(anatomyPath);
  await ensureDirFor(outPath);

  const filter = [
    `[0:v]scale=-1:${height}:force_original_aspect_ratio=decrease,`,
    `pad=iw:${height}:(ow-iw)/2:(oh-ih)/2:color=0x1a1a1a[left];`,
    `[1:v]scale=-1:${height}:force_original_aspect_ratio=decrease,`,
    `pad=iw:${height}:(ow-iw)/2:(oh-ih)/2:color=0xf5f5f5[right];`,
    `[left][right]hstack=inputs=2[out]`,
  ].join('');

  await runFfmpeg([
    '-i', basePath,
    '-i', anatomyPath,
    '-filter_complex', filter,
    '-map', '[out]',
    '-frames:v', '1',
    outPath,
  ]);

  return outPath;
}

export function compositeRefPath(id: string): string {
  return path.join('assets', 'arco-3', 'madre', '_candidates', '_refs', `${id}-ref.png`);
}
