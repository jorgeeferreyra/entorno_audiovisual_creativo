/**
 * Paso 1 del pipeline Arco 3: genera las imágenes madre con los prompts
 * canónicos de docs/produccion/arco-3-planos.md (vía src/lib/planos.ts).
 *
 * Uso (requiere wind-comic arriba en modo real):
 *   npm run madres:a3 -- --id a3-m01     (una sola; el lock de consistencia va primero)
 *   npm run madres:a3 -- --todas         (las 15; ~¥4.5)
 *
 * Por defecto (sin flags) solo lista las madres y sus prompts, sin generar.
 */
import path from 'node:path';
import { PROJECT_ROOT } from '../src/config.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { generarImagen, uploadImageToWindComic } from '../src/lib/image.js';
import { leerPlanosArco3, validarStyleBlock, type MadrePlano } from '../src/lib/planos.js';

async function generar(madre: MadrePlano, refUrls?: string[]) {
  console.log(`\n--- generar_imagen ${madre.id} (${madre.titulo}) ---`);
  const img = await generarImagen({
    prompt: madre.prompt,
    arco: 3,
    id: madre.id,
    slug: madre.slug,
    aspect: '9:16',
    refs: refUrls,
  });
  console.log('OK:', img.localPath, `[${img.provider}]`, img.estCostCny ? `~¥${img.estCostCny}` : '');
}

async function main() {
  const args = process.argv.slice(2);
  const idFlag = args.indexOf('--id');
  const id = idFlag !== -1 ? args[idFlag + 1] : undefined;
  const refM01 = args.includes('--ref-m01');
  const todas = args.includes('--todas');

  const { madres } = await leerPlanosArco3();
  const warnings = await validarStyleBlock(madres);
  for (const w of warnings) console.warn(`⚠ STYLE-BLOCK: ${w}`);

  if (!id && !todas) {
    console.log('Madres del Arco 3 (fuente: docs/produccion/arco-3-planos.md):\n');
    for (const m of madres) console.log(`  ${m.id} — ${m.titulo} → ${m.archivoDestino}`);
    console.log('\nGenerar: --id a3-m01 (una) | --todas (las 15, ~¥4.5)');
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

  let refUrls: string[] | undefined;
  if (refM01) {
    const m01Path = path.join(PROJECT_ROOT, 'assets/arco-3/madre/a3-m01-madre-ornitorrinco.png');
    refUrls = [await uploadImageToWindComic(m01Path)];
    console.log('Ref m01:', refUrls[0].slice(0, 80));
  }

  for (const m of seleccion) await generar(m, refUrls);
  console.log(`\n=== ${seleccion.length} madre(s) generada(s) ===\n`);
}

main().catch((e) => {
  console.error('\ngenerar-madres falló:', e);
  process.exit(1);
});
