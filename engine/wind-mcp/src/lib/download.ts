import fs from 'node:fs/promises';
import path from 'node:path';
import { ensureDirFor } from './paths.js';

export async function downloadToFile(url: string, destPath: string): Promise<void> {
  await ensureDirFor(destPath);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Descarga fallida (${res.status}): ${url.slice(0, 120)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(destPath, buf);
}

export async function fileToDataUri(filePath: string): Promise<string> {
  const buf = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === '.png' ? 'image/png' :
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    ext === '.webp' ? 'image/webp' :
    'application/octet-stream';
  return `data:${mime};base64,${buf.toString('base64')}`;
}
