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
 * Uso:
 *   npm run animatic                                 (arco 3 → animatic-arco-3.mp4)
 *   npm run animatic -- --arco 3
 *   npm run animatic -- --reel la-grieta             (→ animatic-la-grieta.mp4)
 *   npm run animatic -- --reel la-grieta --out reels/la-grieta/animatic-v2.mp4
 *   npm run animatic -- --project charles-jones/redes --arco 3
 */
import path from 'node:path';
import { WORK_DIR } from '../src/config.js';
import { montarAnimatic, montarAnimaticReel, parseOff } from '../src/lib/animatic.js';
import { leerPlanos, validarUnicidad } from '../src/lib/specs.js';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
}

async function main() {
  const args = process.argv.slice(2);
  const reel = flag(args, '--reel');

  if (reel) {
    const salida = flag(args, '--out') ?? `reels/${reel}/animatic-${reel}.mp4`;
    const r = await montarAnimaticReel(reel, salida);
    console.log(`\n=== Animatic reel ${reel}: ${r.segmentCount} segmento(s) ===`);
    console.log('  →', path.relative(WORK_DIR, r.localPath));
    if (r.omitidos.length) {
      console.log(`\n${r.omitidos.length} clip(s) omitido(s):`);
      for (const o of r.omitidos) console.log(`  · ${o.id}: ${o.motivo}`);
    }
    console.log('');
    return;
  }

  const arco = Number(flag(args, '--arco') ?? 3);
  const salida = flag(args, '--out') ?? `reels/la-grieta/animatic-arco-${arco}.mp4`;

  const specs = await leerPlanos(arco);
  for (const w of validarUnicidad(specs)) console.warn(`⚠ ${w}`);
  const offMap = await parseOff(arco);

  const r = await montarAnimatic({ arco, specs, offMap, salida });

  console.log(`\n=== Animatic Arco ${arco}: ${r.segmentCount} segmento(s) ===`);
  console.log('  →', path.relative(WORK_DIR, r.localPath));
  if (r.omitidos.length) {
    console.log(`\n${r.omitidos.length} clip(s) omitido(s):`);
    for (const o of r.omitidos) console.log(`  · ${o.id}: ${o.motivo}`);
  }
  console.log('');
}

main().catch((e) => {
  console.error('\nanimatic falló:', e);
  process.exit(1);
});
