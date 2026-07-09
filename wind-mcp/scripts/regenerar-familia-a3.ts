/**
 * Regenera m02/m03 con ref obligatoria de m01 (lock) y luego clip a3-a4.
 *
 * MiniMax image-01 exige subject_reference[].image_file como STRING (URL pública).
 * Subimos m01 a litterbox para obtener esa URL.
 *
 * Uso: npx tsx --tsconfig tsconfig.json scripts/regenerar-familia-a3.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PROJECT_ROOT, loadWindComicEnv } from '../src/config.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { downloadToFile } from '../src/lib/download.js';
import { getClip, getMadre } from '../src/lib/planos.js';
import { generarVideoI2V } from '../src/lib/video.js';

const execFileAsync = promisify(execFile);
const M01_PATH = path.join(PROJECT_ROOT, 'assets/arco-3/madre/a3-m01-madre-ornitorrinco.png');

async function uploadM01Public(): Promise<string> {
  const jpg = '/tmp/a3-m01-lock-ref.jpg';
  await execFileAsync('ffmpeg', ['-y', '-i', M01_PATH, '-vf', 'scale=1024:-1', '-q:v', '2', jpg]);
  const { stdout } = await execFileAsync('curl', [
    '-sS',
    '--max-time',
    '60',
    '-F',
    'reqtype=fileupload',
    '-F',
    'time=72h',
    '-F',
    `fileToUpload=@${jpg}`,
    'https://litterbox.catbox.moe/resources/internals/api.php',
  ]);
  const url = stdout.trim();
  if (!/^https?:\/\//.test(url)) throw new Error(`litterbox upload falló: ${url}`);
  return url;
}

async function generarConRef(id: string, refUrl: string): Promise<string> {
  loadWindComicEnv();
  const { MinimaxService } = await import('@/services/minimax.service');
  const m = await getMadre(id);
  const svc = new MinimaxService();
  console.log(`\n--- ${id} (ref m01) ---`);
  console.log('prompt:', m.prompt.slice(0, 120) + '...');
  const imageUrl = await svc.generateImageWithRefs(m.prompt, [refUrl], { aspectRatio: '9:16' });
  const dest = path.join(PROJECT_ROOT, m.archivoDestino);
  await downloadToFile(imageUrl, dest);
  console.log('OK:', dest);
  return dest;
}

async function main() {
  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.serverUp) throw new Error('wind-comic no está arriba');

  await fs.access(M01_PATH);
  console.log('\n--- upload m01 lock → litterbox ---');
  const refUrl = await uploadM01Public();
  console.log('ref:', refUrl);

  await generarConRef('a3-m02', refUrl);
  await generarConRef('a3-m03', refUrl);

  const clip = await getClip('a3-a4');
  const m02 = await getMadre('a3-m02');
  if (!clip.motionPrompt) throw new Error('a3-a4 sin motion prompt');
  console.log('\n--- a3-a4 clip ---');
  const out = await generarVideoI2V({
    imagen: m02.archivoDestino,
    motionPrompt: clip.motionPrompt,
    arco: 3,
    id: clip.id,
    slug: clip.slug,
    duration: 5,
    cameraPreset: clip.cameraPreset,
  });
  console.log('OK:', out.localPath, `[${out.provider}]`);
  console.log('\n=== familia regenerada (ref m01) ===\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
