/**
 * Regenera SOLO a3-m02 (cría dormida en nido). Sin a3-a4.
 * Genera 3 candidatos en _candidates/ y copia el mejor a path canónico si se pasa --pick N.
 *
 * Uso:
 *   npx tsx --tsconfig tsconfig.json scripts/regenerar-cria-nido-a3.ts
 *   npx tsx --tsconfig tsconfig.json scripts/regenerar-cria-nido-a3.ts --pick 2
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PROJECT_ROOT, loadWindComicEnv } from '../src/config.js';
import { downloadToFile } from '../src/lib/download.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { getMadre } from '../src/lib/planos.js';

const execFileAsync = promisify(execFile);
const CAND_DIR = path.join(PROJECT_ROOT, 'assets/arco-3/madre/_candidates');
const DEST = path.join(PROJECT_ROOT, 'assets/arco-3/madre/a3-m02-cria-ornitorrinco.png');

async function main() {
  const args = process.argv.slice(2);
  const pickIdx = args.indexOf('--pick');
  const pick = pickIdx !== -1 ? Number(args[pickIdx + 1]) : undefined;

  if (pick) {
    const src = path.join(CAND_DIR, `m02-c${pick}.jpg`);
    await fs.access(src);
    await execFileAsync('ffmpeg', ['-y', '-i', src, DEST]);
    console.log('Canónico ←', src, '→', DEST);
    return;
  }

  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.serverUp) throw new Error('wind-comic no está arriba');

  loadWindComicEnv();
  const { MinimaxService } = await import('@/services/minimax.service');
  const svc = new MinimaxService();
  const m02 = await getMadre('a3-m02');
  await fs.mkdir(CAND_DIR, { recursive: true });

  console.log('\n--- a3-m02 ×3 (prompt: arco-3-planos.md; prompt_optimizer: on) ---');
  console.log('prompt:', m02.prompt);

  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- candidate ${i} ---`);
    const imageUrl = await svc.generateImage(m02.prompt, { aspectRatio: '9:16' });
    const cand = path.join(CAND_DIR, `m02-c${i}.jpg`);
    await downloadToFile(imageUrl, cand);
    console.log('OK:', cand);
  }

  console.log('\nRevisá _candidates/m02-c1..c3.jpg');
  console.log('Promover: npm run ... -- --pick 2  (o el número elegido)');
  console.log('(No regenerar a3-a4 hasta aprobar m02)\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
