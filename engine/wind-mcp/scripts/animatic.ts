/**
 * CLI del animatic: milestone barato previo a video/audio.
 *
 * Arma un MP4 9:16 donde cada clip es su imagen madre fija con el subtítulo
 * (off ES) quemado; los FLF muestran first→last. Con `--off`, la duración de
 * cada escena la determina su locución (presupuesto = piso) y el CLI reporta
 * excesos para refinar texto. NO llama a wind-comic ni a APIs de imagen/video:
 * es puro ffmpeg local + Edge TTS gratis.
 *
 * Dos modos:
 *   --arco N   animatic del hilo (todas las fichas de planos/arco-N.md, en orden).
 *   --reel S   animatic del reel transversal (intercut de la cut-list del
 *              front-matter de reels/S/README.md; cruza varios arcos).
 *
 * Flags transversales:
 *   --borrador  variaciones faltantes → madre base; FLF con un keyframe faltante
 *               → still del existente (duración completa). Para aprobar ritmo/
 *               orden ANTES de pagar variaciones/keyframes. No valida unicidad.
 *   --uniformes preferir reels/<reel>/_madres-uniformes/ si existe el basename
 *               (gate de uniformidad de universo, previo a promover canónicos).
 *   --off       sintetiza la voz en off (Edge TTS, es-AR) y la muxea al MP4;
 *               estira escenas por audio y reporta excesos vs presupuesto.
 *   --voz NAME  voz Edge TTS (default: es-AR-TomasNeural).
 *
 * Uso:
 *   npm run animatic                                 (arco 3 → animatic-arco-3.mp4)
 *   npm run animatic -- --arco 3
 *   npm run animatic -- --reel la-grieta             (→ animatic-la-grieta.mp4)
 *   npm run animatic -- --reel la-grieta --borrador  (bases en vez de variaciones)
 *   npm run animatic -- --reel la-grieta --uniformes (madres del gate de universo)
 *   npm run animatic -- --reel la-grieta --borrador --off
 *   npm run animatic -- --reel la-grieta --off --voz es-AR-ElenaNeural
 *   npm run animatic -- --reel la-grieta --out reels/la-grieta/animatic-v2.mp4
 *   npm run animatic -- --project charles-jones/redes --arco 3
 */
import path from 'node:path';
import { WORK_DIR } from '../src/config.js';
import { montarAnimatic, montarAnimaticReel, parseOff, type MontarAnimaticResult } from '../src/lib/animatic.js';
import { DEFAULT_VOZ } from '../src/lib/tts.js';
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
  console.log(`  duración: ${r.durTotal}s (presupuesto ${r.durPresupuesto}s)`);
  if (borrador) {
    console.log('\n⚠ Modo borrador: pasada previa a las variaciones — NO valida unicidad.');
    console.log('  Aprueba solo ritmo, orden y subtítulos. Las imágenes repetidas son esperadas.');
  }
  if (r.degradados.length) {
    console.log(`\n${r.degradados.length} slot(s) degradado(s) (variación→base o FLF incompleto):`);
    for (const d of r.degradados) console.log(`  · ${d.id}: ${d.ref} → ${d.base}`);
  }
  if (r.omitidos.length) {
    console.log(`\n${r.omitidos.length} clip(s) omitido(s):`);
    for (const o of r.omitidos) console.log(`  · ${o.id}: ${o.motivo}`);
  }
  if (r.offLocuciones > 0) {
    console.log(`\n${r.offLocuciones} locución(es) de off (Edge TTS).`);
  }
  if (r.offAvisos.length) {
    console.log(`\n⚠ ${r.offAvisos.length} off(s) exceden su presupuesto (refinar texto):`);
    for (const a of r.offAvisos) {
      const arco = a.id.match(/^a(\d+)-/)?.[1];
      const offDoc = arco ? `arco-${arco}-off.md` : 'arco-N-off.md';
      console.log(
        `  · ${a.id}: audio ${a.durOff}s > presupuesto ${a.durSlot}s (+${a.exceso}s)` +
          ` → escena ${a.durFinal}s; refinar texto en ${offDoc}, o subir duration`,
      );
    }
    console.log('  Criterio de salida del gate: 0 excesos.');
  } else if (r.offLocuciones > 0) {
    console.log('  ✓ 0 excesos — texto entra en el presupuesto de cada escena.');
  }
  console.log('');
}

async function main() {
  const args = process.argv.slice(2);
  const borrador = hasFlag(args, '--borrador');
  const uniformes = hasFlag(args, '--uniformes');
  const off = hasFlag(args, '--off');
  const voz = flag(args, '--voz') ?? DEFAULT_VOZ;
  const reel = flag(args, '--reel');

  if (reel) {
    const salida = flag(args, '--out') ?? `reels/${reel}/animatic-${reel}.mp4`;
    const r = await montarAnimaticReel(reel, salida, { borrador, uniformes, off, voz });
    reportar(
      `Animatic reel ${reel}${borrador ? ' (borrador)' : ''}${uniformes ? ' +uniformes' : ''}${off ? ' +off' : ''}`,
      r,
      borrador,
    );
    return;
  }

  const arco = Number(flag(args, '--arco') ?? 3);
  const salida = flag(args, '--out') ?? `reels/la-grieta/animatic-arco-${arco}.mp4`;

  const specs = await leerPlanos(arco);
  // En borrador las repeticiones son esperadas (aún no hay variaciones): omitir el chequeo.
  if (!borrador) for (const w of validarUnicidad(specs)) console.warn(`⚠ ${w}`);
  const offMap = await parseOff(arco);

  const r = await montarAnimatic({
    arco,
    specs,
    offMap,
    salida,
    borrador,
    uniformesReel: uniformes ? 'la-grieta' : undefined,
    off,
    voz,
  });

  reportar(
    `Animatic Arco ${arco}${borrador ? ' (borrador)' : ''}${uniformes ? ' +uniformes' : ''}${off ? ' +off' : ''}`,
    r,
    borrador,
  );
}

main().catch((e) => {
  console.error('\nanimatic falló:', e);
  process.exit(1);
});
