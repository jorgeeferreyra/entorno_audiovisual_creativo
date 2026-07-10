/**
 * Paso 1 del pipeline Arco 3: genera las imágenes madre con los prompts
 * canónicos de docs/produccion/arco-3-planos.md (vía src/lib/planos.ts).
 *
 * Coherencia entre madres: si una madre declara `- Ref: a3-mNN` en el doc,
 * se genera usando esa madre padre (ya aprobada en disco) como referencia
 * de imagen — no solo describiéndola en el prompt. Con `- AnatomyRef:` se
 * suman fotos de anatomía.
 *
 * Provider por defecto: openrouter (Nano Banana) — hasta 4 refs multimodales.
 * Fallback Minimax (--provider minimax): 1 slot → composite Ref+AnatomyRef.
 *
 * Uso (requiere wind-comic arriba en modo real):
 *   npm run madres:a3 -- --id a3-m01
 *   npm run madres:a3 -- --id a3-m03 --candidates 3
 *   npm run madres:a3 -- --id a3-m03 --pick 2
 *   npm run madres:a3 -- --id a3-m03 --candidates 3 --provider minimax
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { ASSETS_ROOT, PROJECT_ROOT } from '../src/config.js';
import { compositeRefPath, compositeRefs } from '../src/lib/composite.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { generarImagen } from '../src/lib/image.js';
import { leerPlanosArco3, validarMadres, type MadrePlano } from '../src/lib/planos.js';

const ARCO = 3;
const MAX_OPENROUTER_REFS = 4;

function candidatePath(id: string, n: number): string {
  return path.join(ASSETS_ROOT, `arco-${ARCO}`, 'madre', '_candidates', `${id}-c${n}.png`);
}

async function resolvePadrePath(madre: MadrePlano, todas: MadrePlano[]): Promise<string> {
  if (!madre.ref) throw new Error(`${madre.id}: sin Ref`);
  const padre = todas.find((m) => m.id === madre.ref);
  if (!padre) throw new Error(`${madre.id}: Ref ${madre.ref} no encontrada en arco-3-planos.md`);
  const padrePath = path.join(PROJECT_ROOT, padre.archivoDestino);
  try {
    await fs.access(padrePath);
  } catch {
    throw new Error(`${madre.id} necesita ${madre.ref} generada primero (no existe ${padrePath})`);
  }
  return padrePath;
}

async function resolveAnatomyPaths(madre: MadrePlano): Promise<string[]> {
  const out: string[] = [];
  for (const rel of madre.anatomyRefs ?? []) {
    const p = path.isAbsolute(rel) ? rel : path.join(PROJECT_ROOT, rel);
    try {
      await fs.access(p);
    } catch {
      throw new Error(`${madre.id}: AnatomyRef no existe: ${p}`);
    }
    out.push(p);
  }
  return out;
}

/**
 * OpenRouter: refs separadas [Ref, ...AnatomyRefs] (máx 4).
 * Minimax: si hay anatomía, composite Ref+primera AnatomyRef a 1 imagen.
 */
async function resolveRefs(
  madre: MadrePlano,
  todas: MadrePlano[],
  provider: string,
): Promise<string[] | undefined> {
  if (!madre.ref && !(madre.anatomyRefs?.length)) return undefined;
  if (!madre.ref && madre.anatomyRefs?.length) {
    throw new Error(`${madre.id}: AnatomyRef sin Ref — declarar ambos o solo Ref`);
  }

  const basePath = await resolvePadrePath(madre, todas);
  const anatomyPaths = await resolveAnatomyPaths(madre);

  if (provider === 'openrouter') {
    const refs = [basePath, ...anatomyPaths].slice(0, MAX_OPENROUTER_REFS);
    console.log(`  refs ×${refs.length}: ${madre.ref}` + (anatomyPaths.length
      ? ` + ${anatomyPaths.map((p) => path.basename(p)).join(', ')}`
      : ''));
    return refs;
  }

  // Minimax: 1 slot
  if (anatomyPaths.length) {
    const outRel = compositeRefPath(madre.id);
    const outPath = path.join(PROJECT_ROOT, outRel);
    await compositeRefs(basePath, anatomyPaths[0], outPath);
    console.log(`  composite ← ${madre.ref} + ${path.basename(anatomyPaths[0])} → ${outRel}`);
    return [outPath];
  }
  return [basePath];
}

async function generar(
  madre: MadrePlano,
  todas: MadrePlano[],
  provider: string,
  destOverride?: string,
) {
  const refs = await resolveRefs(madre, todas, provider);
  const refLabel = [
    madre.ref ? `ref:${madre.ref}` : null,
    madre.anatomyRefs?.length
      ? `anatomy:${madre.anatomyRefs.map((r) => path.basename(r)).join('+')}`
      : null,
  ]
    .filter(Boolean)
    .join(' + ');
  console.log(`\n--- generar_imagen ${madre.id} (${madre.titulo})${refLabel ? ` [${refLabel}]` : ''} [provider=${provider}] ---`);
  const img = await generarImagen({
    prompt: madre.prompt,
    arco: ARCO,
    id: madre.id,
    slug: madre.slug,
    aspect: '9:16',
    refs,
    destOverride,
    provider,
    soloProvider: provider === 'openrouter',
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
  const providerFlag = args.indexOf('--provider');
  const provider = providerFlag !== -1 ? args[providerFlag + 1] : 'openrouter';

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
      const anat = m.anatomyRefs?.length ? ` +anatomy×${m.anatomyRefs.length}` : '';
      console.log(`  ${m.id} — ${m.titulo}${m.ref ? ` [ref: ${m.ref}${anat}]` : ''} → ${m.archivoDestino}`);
    }
    console.log('\nGenerar: --id a3-m01 (una) | --todas');
    console.log('Candidatos: --id a3-mNN --candidates 3 | --id a3-mNN --pick 2');
    console.log('Provider: default openrouter (Nano Banana) | --provider minimax');
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
  console.log(`provider: ${provider}${provider === 'openrouter' ? ' (soloProvider)' : ''}`);

  const seleccion = id ? madres.filter((m) => m.id === id) : madres;
  if (!seleccion.length) throw new Error(`Madre ${id} no encontrada en arco-3-planos.md`);

  if (candidates) {
    if (!id) throw new Error('--candidates requiere --id');
    const madre = seleccion[0];
    await fs.mkdir(path.dirname(candidatePath(madre.id, 1)), { recursive: true });
    for (let n = 1; n <= candidates; n++) {
      console.log(`\n--- candidato ${n}/${candidates} ---`);
      await generar(madre, madres, provider, path.relative(PROJECT_ROOT, candidatePath(madre.id, n)));
    }
    console.log(`\nRevisá assets/arco-${ARCO}/madre/_candidates/${madre.id}-c1..c${candidates}.png`);
    console.log(`Promover: npm run madres:a3 -- --id ${madre.id} --pick N\n`);
    return;
  }

  for (const m of seleccion) await generar(m, madres, provider);
  console.log(`\n=== ${seleccion.length} madre(s) generada(s) ===\n`);
}

main().catch((e) => {
  console.error('\ngenerar-madres falló:', e);
  process.exit(1);
});
