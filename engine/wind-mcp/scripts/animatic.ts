/**
 * CLI del animatic: milestone barato previo a video/audio.
 *
 * Arma un MP4 9:16 donde cada clip es su imagen madre fija durante su duración
 * (default 5s) con el subtítulo (off ES) quemado; los FLF muestran first→last.
 * NO llama a wind-comic ni a APIs: es puro ffmpeg local sobre las madres en disco.
 *
 * Dos modos:
 *   --arco N   animatic del hilo (todas las fichas de planos/arco-N.md, en orden).
 *   --reel S   animatic del reel transversal (intercut de la cut-list del
 *              front-matter de reels/S/README.md; cruza varios arcos).
 *
 * Flag transversal:
 *   --borrador  las variaciones aún no generadas degradan a su madre base, para
 *               aprobar ritmo/orden ANTES de pagar las variaciones. No valida
 *               unicidad (las repeticiones son esperadas en esta pasada).
 *
 * Uso:
 *   npm run animatic                                 (arco 3 → animatic-arco-3.mp4)
 *   npm run animatic -- --arco 3
 *   npm run animatic -- --reel la-grieta             (→ animatic-la-grieta.mp4)
 *   npm run animatic -- --reel la-grieta --borrador  (bases en vez de variaciones)
 *   npm run animatic -- --reel la-grieta --out reels/la-grieta/animatic-v2.mp4
 *   npm run animatic -- --project charles-jones/redes --arco 3
 */
import path from 'node:path';
import { WORK_DIR } from '../src/config.js';
import { montarAnimatic, montarAnimaticReel, parseOff, type MontarAnimaticResult } from '../src/lib/animatic.js';
import { leerPlanos, validarUnicidad } from '../src/lib/specs.js';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
}

function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function reportar(titulo: string, r: MontarAnimaticResult, borrador: boolean): void {
  console.log(`\n=== ${titulo}: ${r.segmentCount} segmento(s) ===`);
  console.log('  →', path.relative(WORK_DIR, r.localPath));
  if (borrador) {
    console.log('\n⚠ Modo borrador: pasada previa a las variaciones — NO valida unicidad.');
    console.log('  Aprueba solo ritmo, orden y subtítulos. Las imágenes repetidas son esperadas.');
  }
  if (r.degradados.length) {
    console.log(`\n${r.degradados.length} slot(s) con madre base en vez de variación:`);
    for (const d of r.degradados) console.log(`  · ${d.id}: ${d.ref} → ${d.base}`);
  }
  if (r.omitidos.length) {
    console.log(`\n${r.omitidos.length} clip(s) omitido(s):`);
    for (const o of r.omitidos) console.log(`  · ${o.id}: ${o.motivo}`);
  }
  console.log('');
}

async function main() {
  const args = process.argv.slice(2);
  const borrador = hasFlag(args, '--borrador');
  const reel = flag(args, '--reel');

  if (reel) {
    const salida = flag(args, '--out') ?? `reels/${reel}/animatic-${reel}.mp4`;
    const r = await montarAnimaticReel(reel, salida, borrador);
    reportar(`Animatic reel ${reel}${borrador ? ' (borrador)' : ''}`, r, borrador);
    return;
  }

  const arco = Number(flag(args, '--arco') ?? 3);
  const salida = flag(args, '--out') ?? `reels/la-grieta/animatic-arco-${arco}.mp4`;

  const specs = await leerPlanos(arco);
  // En borrador las repeticiones son esperadas (aún no hay variaciones): omitir el chequeo.
  if (!borrador) for (const w of validarUnicidad(specs)) console.warn(`⚠ ${w}`);
  const offMap = await parseOff(arco);

  const r = await montarAnimatic({ arco, specs, offMap, salida, borrador });

  reportar(`Animatic Arco ${arco}${borrador ? ' (borrador)' : ''}`, r, borrador);
}

main().catch((e) => {
  console.error('\nanimatic falló:', e);
  process.exit(1);
});
