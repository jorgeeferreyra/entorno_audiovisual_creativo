/**
 * CLI único de generación (imágenes madre + clips) para cualquier arco.
 * Fuente de verdad: docs/produccion/arco-{N}-planos.md (vía src/lib/specs.ts).
 *
 * Reemplaza a generar-madres-a3.ts + generar-clips-a3.ts: el tipo de asset se
 * infiere del `kind` de la ficha, no del script.
 *
 * Uso (requiere wind-comic arriba en modo real):
 *   npm run gen                          (lista los assets del arco)
 *   npm run gen -- --id a3-m01           (una imagen)
 *   npm run gen -- --id a3-a3            (un clip)
 *   npm run gen -- --reel a              (todos los assets del reel A / grupo "a")
 *   npm run gen -- --todas               (todo lo generable)
 *   npm run gen -- --id a3-m03 --candidates 3
 *   npm run gen -- --id a3-m03 --pick 2
 *   npm run gen -- --id a3-m03 --provider minimax
 *   npm run gen -- --arco 4 --todas
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { PROJECT_ROOT } from '../src/config.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { generar, type GenerarOpts } from '../src/lib/motor.js';
import { clipPath } from '../src/lib/paths.js';
import { leerPlanos, validarImagenes, type AssetSpec } from '../src/lib/specs.js';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
}

function destDe(spec: AssetSpec, arco: number): string {
  if (spec.kind === 'image') return spec.dest;
  if (spec.kind === 'montaje') return spec.fuente ?? '(sin fuente)';
  return path.relative(PROJECT_ROOT, clipPath(arco, spec.id, spec.slug));
}

function candidatePath(arco: number, id: string, n: number): string {
  return path.join('assets', `arco-${arco}`, 'madre', '_candidates', `${id}-c${n}.png`);
}

async function existe(p: string): Promise<boolean> {
  try {
    await fs.access(path.isAbsolute(p) ? p : path.join(PROJECT_ROOT, p));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const arco = Number(flag(args, '--arco') ?? 3);
  const id = flag(args, '--id');
  const reel = flag(args, '--reel')?.toLowerCase();
  const todas = args.includes('--todas');
  const force = args.includes('--force');
  const provider = flag(args, '--provider');
  const candStr = flag(args, '--candidates');
  const candidates = candStr ? Number(candStr) : undefined;
  const pickStr = flag(args, '--pick');
  const pick = pickStr ? Number(pickStr) : undefined;

  const specs = await leerPlanos(arco);
  for (const w of await validarImagenes(specs)) console.warn(`⚠ ${w}`);

  const opts: GenerarOpts = { arco, specs, provider, force };

  // Promover candidato a canónico (solo imágenes).
  if (pick !== undefined) {
    if (!id) throw new Error('--pick requiere --id');
    const spec = specs.find((s) => s.id === id);
    if (!spec || spec.kind !== 'image') throw new Error(`--pick solo aplica a imágenes (${id})`);
    const src = path.join(PROJECT_ROOT, candidatePath(arco, id, pick));
    await fs.access(src);
    const dest = path.join(PROJECT_ROOT, spec.dest);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
    console.log(`Canónico ← ${path.relative(PROJECT_ROOT, src)} → ${spec.dest}`);
    return;
  }

  // Listado (sin filtros).
  if (!id && !reel && !todas) {
    console.log(`Assets del Arco ${arco} (fuente: docs/produccion/arco-${arco}-planos.md):\n`);
    for (const s of specs) {
      const dest = destDe(s, arco);
      const ok = s.kind !== 'montaje' && (await existe(dest)) ? ' ✓' : '';
      console.log(`  ${s.id} [${s.kind}] — ${s.titulo} → ${dest}${ok}`);
    }
    console.log('\nGenerar: --id a3-m01 | --reel a | --todas | --force (regenerar)');
    console.log('Candidatos: --id a3-mNN --candidates 3 | --id a3-mNN --pick 2');
    console.log('Provider (imágenes): default openrouter | --provider minimax');
    return;
  }

  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.serverUp) {
    throw new Error('wind-comic no está arriba. Levantá: cd wind-comic && PLAN_GATE_DISABLED=1 npm run dev');
  }
  if (estado.mockEngines) console.warn('⚠ MOCK_ENGINES=1: los assets serán fake (dry-run).');

  // Candidatos (solo imágenes).
  if (candidates) {
    if (!id) throw new Error('--candidates requiere --id');
    const spec = specs.find((s) => s.id === id);
    if (!spec || spec.kind !== 'image') throw new Error(`--candidates solo aplica a imágenes (${id})`);
    await fs.mkdir(path.join(PROJECT_ROOT, path.dirname(candidatePath(arco, id, 1))), { recursive: true });
    for (let n = 1; n <= candidates; n++) {
      console.log(`\n--- candidato ${n}/${candidates} de ${id} ---`);
      const r = await generar(spec, { ...opts, force: true, destOverride: candidatePath(arco, id, n) });
      console.log('OK:', r.localPath, `[${r.provider}]`, r.estCostCny ? `~¥${r.estCostCny}` : '');
    }
    console.log(`\nRevisá assets/arco-${arco}/madre/_candidates/${id}-c1..c${candidates}.png`);
    console.log(`Promover: npm run gen -- --arco ${arco} --id ${id} --pick N\n`);
    return;
  }

  // Selección a generar.
  let seleccion: AssetSpec[];
  if (id) {
    const spec = specs.find((s) => s.id === id);
    if (!spec) throw new Error(`Asset ${id} no encontrado en arco-${arco}-planos.md`);
    seleccion = [spec];
  } else if (reel) {
    const re = new RegExp(`^a${arco}-${reel}`);
    seleccion = specs.filter((s) => re.test(s.id));
  } else {
    seleccion = specs;
  }
  if (!seleccion.length) throw new Error('Ningún asset coincide con el filtro');

  let generados = 0;
  for (const spec of seleccion) {
    const r = await generar(spec, opts);
    if (r.skipped) {
      console.log(`\n--- ${r.id} [${r.kind}]: se omite (${r.motivo}) ---`);
      continue;
    }
    generados++;
    console.log(`\n--- ${r.id} [${r.kind}] OK ---`);
    console.log('  →', r.localPath, `[${r.provider}]`, r.estCostCny ? `~¥${r.estCostCny}` : '', r.warning ?? '');
  }
  console.log(`\n=== ${generados} asset(s) generado(s), ${seleccion.length - generados} omitido(s) ===\n`);
}

main().catch((e) => {
  console.error('\ngenerar falló:', e);
  process.exit(1);
});
