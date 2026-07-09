/**
 * Genera las 3 BGM del Arco 3 (ámbar → rojo → gris) vía Minimax music-2.6.
 *
 * Uso (requiere MINIMAX_API_KEY en wind-comic/.env.local):
 *   npm run audio:a3           (las 3 pistas)
 *   npm run audio:a3 -- --id amber|red|grey
 *   npm run audio:a3 -- --force (regenerar aunque existan)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadWindComicEnv, PROJECT_ROOT } from '../src/config.js';
import { downloadToFile } from '../src/lib/download.js';
import { formatEstado, getEstado } from '../src/lib/estado.js';
import { ensureDirFor } from '../src/lib/paths.js';

const AUDIO_DIR = path.join(PROJECT_ROOT, 'assets', 'arco-3', 'audio');

const PISTAS = [
  {
    id: 'amber',
    archivo: 'bgm-reel-a-amber.mp3',
    prompt: 'warm amber and gentle green, tender documentary, soft strings, no percussion, Attenborough nature film',
    style: 'cinematic orchestral',
    duration: 60,
  },
  {
    id: 'red',
    archivo: 'bgm-reel-a-red.mp3',
    prompt: 'dramatic deep red, ominous but sincere, low strings and subtle tension, no percussion, nature documentary',
    style: 'cinematic orchestral',
    duration: 45,
  },
  {
    id: 'grey',
    archivo: 'bgm-reel-bc-grey.mp3',
    prompt: 'cold desaturated grey fading to stone, elegiac minimal piano and strings, no percussion, documentary farewell',
    style: 'cinematic orchestral',
    duration: 60,
  },
] as const;

type PistaId = (typeof PISTAS)[number]['id'];

async function existe(archivo: string): Promise<boolean> {
  try {
    await fs.access(path.join(AUDIO_DIR, archivo));
    return true;
  } catch {
    return false;
  }
}

async function generarPista(pista: (typeof PISTAS)[number]) {
  const dest = path.join(AUDIO_DIR, pista.archivo);
  console.log(`\n--- BGM ${pista.id} → ${path.relative(PROJECT_ROOT, dest)} ---`);
  console.log(`  prompt: ${pista.prompt.slice(0, 80)}...`);

  loadWindComicEnv();
  const { MinimaxService } = await import('@/services/minimax.service');
  const svc = new MinimaxService();
  const audioUrl = await svc.generateMusic(pista.prompt, {
    style: pista.style,
    duration: pista.duration,
  });

  await ensureDirFor(dest);
  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
    await downloadToFile(audioUrl, dest);
  } else if (audioUrl.startsWith('/')) {
    // persistHexAudioToFile devuelve ruta local servida por wind-comic
    const localSrc = path.join(PROJECT_ROOT, 'wind-comic', 'public', audioUrl.replace(/^\//, ''));
    await fs.copyFile(localSrc, dest);
  } else {
    throw new Error(`URL de audio no reconocida: ${audioUrl.slice(0, 120)}`);
  }

  console.log('OK:', dest);
}

async function main() {
  const args = process.argv.slice(2);
  const idFlag = args.indexOf('--id');
  const id = idFlag !== -1 ? (args[idFlag + 1] as PistaId) : undefined;
  const force = args.includes('--force');

  if (!id && !args.includes('--todas') && args.length === 0) {
    console.log('BGM del Arco 3:\n');
    for (const p of PISTAS) {
      const exists = await existe(p.archivo);
      console.log(`  ${p.id} → assets/arco-3/audio/${p.archivo}${exists ? ' ✓' : ''}`);
    }
    console.log('\nGenerar: npm run audio:a3 (las 3) | --id amber|red|grey | --force');
    return;
  }

  const estado = await getEstado();
  console.log(formatEstado(estado));
  if (!estado.keys.MINIMAX_API_KEY && !estado.mockEngines) {
    throw new Error('Configurá MINIMAX_API_KEY en wind-comic/.env.local');
  }

  const seleccion = id ? PISTAS.filter((p) => p.id === id) : [...PISTAS];
  if (!seleccion.length) throw new Error(`Pista desconocida: ${id}. Usar: amber, red, grey`);

  await fs.mkdir(AUDIO_DIR, { recursive: true });

  for (const p of seleccion) {
    if (!force && (await existe(p.archivo))) {
      console.log(`\n--- ${p.id}: ya existe ${p.archivo}, se omite (usar --force) ---`);
      continue;
    }
    await generarPista(p);
  }

  console.log(`\n=== ${seleccion.length} pista(s) procesada(s) ===\n`);
}

main().catch((e) => {
  console.error('\ngenerar-bgm falló:', e);
  process.exit(1);
});
