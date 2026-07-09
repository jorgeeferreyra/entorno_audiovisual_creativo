/**
 * Regenera m02/m03 y clip a3-a4 (sin tocar m01).
 * Uso: npx tsx --tsconfig tsconfig.json scripts/regenerar-familia-a3.ts
 */
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { generarImagen } from '../src/lib/image.js';
import { getClip, getMadre } from '../src/lib/planos.js';
import { generarVideoI2V } from '../src/lib/video.js';

async function main() {
  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.serverUp) throw new Error('wind-comic no está arriba');

  for (const id of ['a3-m02', 'a3-m03'] as const) {
    const m = await getMadre(id);
    console.log(`\n--- ${id} ---`);
    const img = await generarImagen({
      prompt: m.prompt,
      arco: 3,
      id: m.id,
      slug: m.slug,
      aspect: '9:16',
    });
    console.log('OK:', img.localPath, `[${img.provider}]`);
  }

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
  console.log('\n=== familia regenerada ===\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
