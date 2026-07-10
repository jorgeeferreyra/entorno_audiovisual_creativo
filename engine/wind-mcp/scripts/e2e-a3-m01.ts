/**
 * E2E Arco 3 — a3-m01 madre ornitorrinco → clip a3-a3 (5s, locked-tripod) → montaje.
 *
 * Los prompts se leen de la fuente de verdad (<episodio>/planos/arco-3.md)
 * vía src/lib/specs.ts — acá no se hardcodea ningún prompt.
 *
 * Uso:
 *   npm run e2e:mock   (requiere wind-comic con MOCK_ENGINES=1)
 *   npm run e2e:real   (requiere wind-comic sin mock + MINIMAX_API_KEY)
 */
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { generarImagen } from '../src/lib/image.js';
import { montarSecuencia } from '../src/lib/montaje.js';
import { getSpec } from '../src/lib/specs.js';
import { generarVideoI2V } from '../src/lib/video.js';
import { PROJECT_ROOT } from '../src/config.js';
import path from 'node:path';

async function main() {
  const mode = process.argv.includes('--real') ? 'real' : 'mock';
  console.log(`\n=== E2E Arco 3 (${mode}) ===\n`);

  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.serverUp) {
    throw new Error('wind-comic no está arriba. Levantá: cd engine/wind-comic && MOCK_ENGINES=0 PLAN_GATE_DISABLED=1 npm run dev');
  }
  if (mode === 'mock' && !estado.mockEngines) {
    throw new Error('Para e2e:mock, wind-comic debe correr con MOCK_ENGINES=1');
  }
  if (mode === 'real' && estado.mockEngines) {
    throw new Error('Para e2e:real, wind-comic debe correr SIN MOCK_ENGINES');
  }
  if (mode === 'real' && !estado.keys.MINIMAX_API_KEY) {
    throw new Error(
      'Para e2e:real, configurá MINIMAX_API_KEY en wind-comic/.env.local (BYO keys)',
    );
  }

  const madre = await getSpec(3, 'a3-m01');
  if (madre.kind !== 'image') throw new Error('a3-m01 no es una imagen');
  const ficha = await getSpec(3, 'a3-a3');
  if (ficha.kind !== 'video-i2v') throw new Error('a3-a3 no es un clip video-i2v');

  console.log('\n--- 1. generar_imagen a3-m01 ---');
  const img = await generarImagen({
    prompt: madre.prompt,
    arco: 3,
    id: madre.id,
    slug: madre.slug,
    aspect: '9:16',
  });
  console.log('OK:', img.localPath, img.provider);

  console.log('\n--- 2. generar_video_i2v a3-a3 ---');
  const clip = await generarVideoI2V({
    imagen: img.localPath,
    imageUrl: img.imageUrl,
    motionPrompt: ficha.motionPrompt,
    arco: 3,
    id: 'a3-a3',
    slug: 'madre-ritual',
    duration: ficha.duration,
    cameraPreset: ficha.cameraPreset,
  });
  console.log('OK:', clip.localPath, clip.provider);

  console.log('\n--- 3. montar_secuencia ---');
  const reel = await montarSecuencia({
    clips: [clip.localPath],
    salida: path.join(PROJECT_ROOT, 'assets/arco-3/reels/a3-e2e-test.mp4'),
    aspect: '9:16',
  });
  console.log('OK:', reel.localPath);

  console.log('\n=== E2E completado ===\n');
}

main().catch((e) => {
  console.error('\nE2E falló:', e);
  process.exit(1);
});
