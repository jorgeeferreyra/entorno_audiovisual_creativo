/**
 * CLI del gate de uniformidad de universo.
 *
 * Re-pasa las madres del reel contra locks (cuento/real) vía Nano Banana
 * (openrouter), escribiendo en reels/<reel>/_madres-uniformes/ sin tocar
 * canónicos. El mapa (reels/<reel>/mapa-uniformidad.md) es el gate: toda
 * madre de la cutlist debe figurar ahí.
 *
 * Uso:
 *   npm run uniformar -- --reel la-grieta
 *   npm run uniformar -- --reel la-grieta --id a3-m05
 *   npm run uniformar -- --reel la-grieta --force
 *   npm run uniformar -- --reel la-grieta --promover   (SOLO con confirmación)
 *   npm run uniformar -- --project charles-jones/redes --reel la-grieta
 */
import { WORK_DIR } from '../src/config.js';
import { uniformar } from '../src/lib/uniformar.js';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
}

async function main() {
  const args = process.argv.slice(2);
  const reel = flag(args, '--reel');
  if (!reel) {
    throw new Error('Falta --reel <slug> (ej. --reel la-grieta)');
  }
  const id = flag(args, '--id');
  const force = args.includes('--force');
  const promover = args.includes('--promover');

  console.log(`\n=== Uniformar universo: reel ${reel}${promover ? ' (PROMOVER)' : ''} ===`);
  console.log(`  unidad: ${WORK_DIR}`);
  if (id) console.log(`  id: ${id}`);
  if (force) console.log('  force: sí');
  if (promover) {
    console.log('  ⚠ --promover archiva canónicos y los reemplaza por uniformes.');
    console.log('    Solo correr con confirmación explícita de dirección.\n');
  }

  const r = await uniformar({ reel, id, force, promover });

  if (promover) {
    console.log(`\nPromovidos: ${r.promovidos?.length ?? 0}`);
    if (r.omitidos.length) {
      console.log(`Omitidos: ${r.omitidos.length}`);
      for (const o of r.omitidos) console.log(`  · ${o.id}: ${o.motivo}`);
    }
    if (r.exentos.length) {
      console.log(`Exentos: ${r.exentos.join(', ')}`);
    }
    console.log('');
    return;
  }

  console.log(`\nLocks copiados: ${r.copiados.length}`);
  for (const id of r.copiados) console.log(`  · ${id}`);
  console.log(`Generados: ${r.generados.length}`);
  for (const id of r.generados) console.log(`  · ${id}`);
  if (r.skipped.length) {
    console.log(`Skipped (ya existen; --force para rehacer): ${r.skipped.length}`);
    for (const id of r.skipped) console.log(`  · ${id}`);
  }
  if (r.exentos.length) {
    console.log(`Exentos: ${r.exentos.length}`);
    for (const e of r.exentos) console.log(`  · ${e}`);
  }
  if (r.diferidos.length) {
    console.log(`Diferidos (post-promoción): ${r.diferidos.length}`);
    for (const d of r.diferidos) console.log(`  · ${d}`);
  }
  if (r.omitidos.length) {
    console.log(`Omitidos: ${r.omitidos.length}`);
    for (const o of r.omitidos) console.log(`  · ${o.id}: ${o.motivo}`);
  }
  console.log(`\nSalida: reels/${reel}/_madres-uniformes/\n`);
}

main().catch((e) => {
  console.error('\nuniformar falló:', e instanceof Error ? e.message : e);
  process.exit(1);
});
