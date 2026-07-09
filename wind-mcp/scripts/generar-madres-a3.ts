/**
 * Paso 1 del pipeline Arco 3: genera las imágenes madre con los prompts
 * canónicos de docs/produccion/arco-3-planos.md (vía src/lib/planos.ts).
 *
 * Coherencia entre madres: si una madre declara `- Ref: a3-mNN` en el doc,
 * se genera usando esa madre padre (ya aprobada en disco) como referencia
 * de imagen (subject_reference) — no solo describiéndola en el prompt.
 *
 * Uso (requiere wind-comic arriba en modo real):
 *   npm run madres:a3 -- --id a3-m01            (una sola; el lock de consistencia va primero)
 *   npm run madres:a3 -- --todas                (las 17; ~¥5.1)
 *   npm run madres:a3 -- --id a3-m02 --candidates 3   (3 variantes en _candidates/, no toca el canónico)
 *   npm run madres:a3 -- --id a3-m02 --pick 2          (promueve _candidates/a3-m02-c2.png a canónico)
 *
 * Por defecto (sin flags) solo lista las madres, sus refs y prompts, sin generar.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { ASSETS_ROOT, PROJECT_ROOT } from '../src/config.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { generarImagen } from '../src/lib/image.js';
import { leerPlanosArco3, validarMadres, type MadrePlano } from '../src/lib/planos.js';

const ARCO = 3;

function candidatePath(id: string, n: number): string {
  return path.join(ASSETS_ROOT, `arco-${ARCO}`, 'madre', '_candidates', `${id}-c${n}.png`);
}

/** Resuelve la madre padre en disco (ya aprobada) para usarla como refs[] de generarImagen. */
async function resolveRefs(madre: MadrePlano, todas: MadrePlano[]): Promise<string[] | undefined> {
  if (!madre.ref) return undefined;
  const padre = todas.find((m) => m.id === madre.ref);
  if (!padre) throw new Error(`${madre.id}: Ref ${madre.ref} no encontrada en arco-3-planos.md`);
  const padrePath = path.join(PROJECT_ROOT, padre.archivoDestino);
  try {
    await fs.access(padrePath);
  } catch {
    throw new Error(`${madre.id} necesita ${madre.ref} generada primero (no existe ${padrePath})`);
  }
  return [padrePath];
}

async function generar(madre: MadrePlano, todas: MadrePlano[], destOverride?: string) {
  const refs = await resolveRefs(madre, todas);
  console.log(`\n--- generar_imagen ${madre.id} (${madre.titulo})${refs ? ` [ref: ${madre.ref}]` : ''} ---`);
  const img = await generarImagen({
    prompt: madre.prompt,
    arco: ARCO,
    id: madre.id,
    slug: madre.slug,
    aspect: '9:16',
    refs,
    destOverride,
  });
  console.log('OK:', img.localPath, `[${img.provider}]`, img.estCostCny ? `~¥${img.estCostCny}` : '');
}

async function promoverCandidato(id: string, n: number, todas: MadrePlano[]) {
  const madre = todas.find((m) => m.id === id);
  if (!madre) throw new Error(`Madre ${id} no encontrada en arco-3-planos.md`);
  const src = candidatePath(id, n);
  await fs.access(src);
  const dest = path.join(PROJECT_ROOT, madre.archivoDestino);
  await fs.copyFile(src, dest);
  console.log(`Canónico ← ${src} → ${dest}`);
}

async function main() {
  const args = process.argv.slice(2);
  const idFlag = args.indexOf('--id');
  const id = idFlag !== -1 ? args[idFlag + 1] : undefined;
  const todasFlag = args.includes('--todas');
  const candFlag = args.indexOf('--candidates');
  const candidates = candFlag !== -1 ? Number(args[candFlag + 1]) : undefined;
  const pickFlag = args.indexOf('--pick');
  const pick = pickFlag !== -1 ? Number(args[pickFlag + 1]) : undefined;

  const { madres } = await leerPlanosArco3();
  const warnings = await validarMadres(madres);
  for (const w of warnings) console.warn(`⚠ ${w}`);

  if (pick !== undefined) {
    if (!id) throw new Error('--pick requiere --id');
    await promoverCandidato(id, pick, madres);
    return;
  }

  if (!id && !todasFlag) {
    console.log('Madres del Arco 3 (fuente: docs/produccion/arco-3-planos.md):\n');
    for (const m of madres) {
      console.log(`  ${m.id} — ${m.titulo}${m.ref ? ` [ref: ${m.ref}]` : ''} → ${m.archivoDestino}`);
    }
    console.log('\nGenerar: --id a3-m01 (una) | --todas (las 17, ~¥5.1)');
    console.log('Candidatos: --id a3-mNN --candidates 3 | --id a3-mNN --pick 2');
    return;
  }

  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.serverUp) {
    throw new Error('wind-comic no está arriba. Levantá: cd wind-comic && npm run dev');
  }
  if (estado.mockEngines) {
    console.warn('⚠ MOCK_ENGINES=1: las imágenes serán fake (dry-run).');
  }

  const seleccion = id ? madres.filter((m) => m.id === id) : madres;
  if (!seleccion.length) throw new Error(`Madre ${id} no encontrada en arco-3-planos.md`);

  if (candidates) {
    if (!id) throw new Error('--candidates requiere --id');
    const madre = seleccion[0];
    await fs.mkdir(path.dirname(candidatePath(madre.id, 1)), { recursive: true });
    for (let n = 1; n <= candidates; n++) {
      console.log(`\n--- candidato ${n}/${candidates} ---`);
      await generar(madre, madres, path.relative(PROJECT_ROOT, candidatePath(madre.id, n)));
    }
    console.log(`\nRevisá assets/arco-${ARCO}/madre/_candidates/${madre.id}-c1..c${candidates}.png`);
    console.log(`Promover: npm run madres:a3 -- --id ${madre.id} --pick N\n`);
    return;
  }

  for (const m of seleccion) await generar(m, madres);
  console.log(`\n=== ${seleccion.length} madre(s) generada(s) ===\n`);
}

main().catch((e) => {
  console.error('\ngenerar-madres falló:', e);
  process.exit(1);
});
