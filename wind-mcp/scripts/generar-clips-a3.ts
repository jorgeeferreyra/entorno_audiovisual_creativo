/**
 * Paso 2 del pipeline Arco 3: genera clips U2V / U2V-FLF con fichas de
 * docs/produccion/arco-3-planos.md (vía src/lib/planos.ts).
 *
 * Uso (requiere wind-comic arriba en modo real):
 *   npm run clips:a3 -- --id a3-a1     (un clip)
 *   npm run clips:a3 -- --reel A        (todos los U2V del Reel A, salta a3-a5 FLF)
 *   npm run clips:a3 -- --todas        (todos salvo herramienta=ninguna)
 *
 * Por defecto (sin flags) solo lista los clips y sus fichas, sin generar.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { PROJECT_ROOT } from '../src/config.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { clipPath } from '../src/lib/paths.js';
import { getClip, leerPlanosArco3, type ClipPlano } from '../src/lib/planos.js';
import { generarVideoFLF, generarVideoI2V } from '../src/lib/video.js';

const ARCO = 3;

function parseDuration(d?: number): 5 | 6 | 10 | 15 {
  if (d === 6 || d === 10 || d === 15) return d;
  return 5;
}

function parseFlfDuration(d?: number): 5 | 10 {
  return d === 10 ? 10 : 5;
}

async function existeCanonico(clip: ClipPlano): Promise<boolean> {
  try {
    await fs.access(clipPath(ARCO, clip.id, clip.slug));
    return true;
  } catch {
    return false;
  }
}

async function generar(clip: ClipPlano, skipExistentes: boolean) {
  if (clip.herramienta === 'ninguna') {
    console.log(`\n--- ${clip.id} (${clip.titulo}): solo montaje, se omite ---`);
    return;
  }
  if (!clip.motionPrompt) throw new Error(`${clip.id} sin motion prompt en arco-3-planos.md`);
  if (!clip.firstFrame) throw new Error(`${clip.id} sin firstFrame en arco-3-planos.md`);

  const dest = clipPath(ARCO, clip.id, clip.slug);
  if (skipExistentes && (await existeCanonico(clip))) {
    console.log(`\n--- ${clip.id}: ya existe ${dest}, se omite ---`);
    return;
  }

  console.log(`\n--- generar ${clip.id} (${clip.titulo}) [${clip.herramienta}] ---`);
  console.log(`  firstFrame: ${clip.firstFrame}`);
  if (clip.lastFrame) console.log(`  lastFrame: ${clip.lastFrame}`);
  console.log(`  destino: ${dest}`);

  if (clip.herramienta === 'U2V-FLF') {
    if (!clip.lastFrame) throw new Error(`${clip.id} FLF sin lastFrame`);
    const out = await generarVideoFLF({
      firstFrame: clip.firstFrame,
      lastFrame: clip.lastFrame,
      motionPrompt: clip.motionPrompt,
      arco: ARCO,
      id: clip.id,
      slug: clip.slug,
      duration: parseFlfDuration(clip.duration),
      cameraPreset: clip.cameraPreset,
    });
    console.log('OK:', out.localPath, `[${out.provider}]`, out.warning ?? '');
    return;
  }

  const out = await generarVideoI2V({
    imagen: clip.firstFrame,
    motionPrompt: clip.motionPrompt,
    arco: ARCO,
    id: clip.id,
    slug: clip.slug,
    duration: parseDuration(clip.duration),
    cameraPreset: clip.cameraPreset,
  });
  console.log('OK:', out.localPath, `[${out.provider}]`, `~¥${(out.duration * 0.1).toFixed(1)}`);
}

async function main() {
  const args = process.argv.slice(2);
  const idFlag = args.indexOf('--id');
  const id = idFlag !== -1 ? args[idFlag + 1] : undefined;
  const reelFlag = args.indexOf('--reel');
  const reel = reelFlag !== -1 ? args[reelFlag + 1]?.toUpperCase() : undefined;
  const todas = args.includes('--todas');
  const force = args.includes('--force');
  const skipExistentes = !force;

  const { clips } = await leerPlanosArco3();

  if (!id && !reel && !todas) {
    console.log('Clips del Arco 3 (fuente: docs/produccion/arco-3-planos.md):\n');
    for (const c of clips) {
      const dest = clipPath(ARCO, c.id, c.slug);
      const exists = await existeCanonico(c);
      console.log(
        `  ${c.id} — ${c.titulo} [${c.herramienta}] → ${path.relative(PROJECT_ROOT, dest)}${exists ? ' ✓' : ''}`,
      );
    }
    console.log('\nGenerar: --id a3-a1 | --reel A | --todas | --force (regenerar)');
    return;
  }

  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.serverUp) {
    throw new Error('wind-comic no está arriba. Levantá: cd wind-comic && PLAN_GATE_DISABLED=1 npm run dev');
  }
  if (estado.mockEngines) {
    console.warn('⚠ MOCK_ENGINES=1: los clips serán fake (dry-run).');
  }
  if (!estado.keys.MINIMAX_API_KEY && !estado.mockEngines) {
    throw new Error('Configurá MINIMAX_API_KEY en wind-comic/.env.local');
  }

  let seleccion: ClipPlano[];
  if (id) {
    seleccion = [await getClip(id)];
  } else if (reel) {
    seleccion = clips.filter((c) => {
      const m = c.id.match(/^a3-([a-z])\d/);
      return m && m[1].toUpperCase() === reel;
    });
  } else {
    seleccion = clips.filter((c) => c.herramienta !== 'ninguna');
  }

  if (!seleccion.length) throw new Error('Ningún clip coincide con el filtro');

  for (const c of seleccion) await generar(c, skipExistentes);
  console.log(`\n=== ${seleccion.length} clip(s) procesado(s) ===\n`);
}

main().catch((e) => {
  console.error('\ngenerar-clips falló:', e);
  process.exit(1);
});
