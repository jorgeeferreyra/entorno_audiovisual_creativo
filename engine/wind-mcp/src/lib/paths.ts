import fs from 'node:fs/promises';
import path from 'node:path';
import { ASSETS_ROOT } from '../config.js';

export function madrePath(arco: number, id: string, slug: string): string {
  return path.join(ASSETS_ROOT, `arco-${arco}`, 'madre', `${id}-${slug}.png`);
}

export function clipPath(arco: number, id: string, slug: string): string {
  return path.join(ASSETS_ROOT, `arco-${arco}`, 'clips', `${id}-${slug}.mp4`);
}

/** Montaje final de un reel: `<unidad>/reels/<slug>/<slug>.mp4`. */
export function reelPath(slug: string): string {
  return path.join(ASSETS_ROOT, '..', 'reels', slug, `${slug}.mp4`);
}

export async function ensureDirFor(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export function resolveProjectPath(p: string): string {
  if (path.isAbsolute(p)) return p;
  return path.join(ASSETS_ROOT, '..', p);
}
