/**
 * TTS gratuito (Edge Read Aloud) para la voz en off del animatic.
 * Sin API key. Caché local por hash de (voz + texto).
 */
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { ensureDirFor } from './paths.js';

/** Voz documental es-AR (masculina). Alternativa: es-AR-ElenaNeural. */
export const DEFAULT_VOZ = 'es-AR-TomasNeural';

/** Escapa texto plano para insertarlo en el SSML que arma msedge-tts. */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Hash corto de voz+texto: invalida la caché si cambia el off o la voz. */
export function hashOff(texto: string, voz: string): string {
  return createHash('sha256').update(`${voz}\n${texto}`).digest('hex').slice(0, 8);
}

/** Ruta canónica de caché: `<cacheDir>/<clipId>-<hash8>.mp3`. */
export function rutaCacheOff(cacheDir: string, clipId: string, texto: string, voz: string): string {
  // clipId puede traer sufijo -a/-b de FLF; la locución es del clip base.
  const baseId = clipId.replace(/-[ab]$/, '');
  return path.join(cacheDir, `${baseId}-${hashOff(texto, voz)}.mp3`);
}

async function existe(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sintetiza `texto` a mp3 en `destino`. Si el archivo ya existe, no llama a Edge.
 * Devuelve `{ cached: true }` cuando reutiliza.
 */
export async function sintetizarOff(
  texto: string,
  destino: string,
  voz = DEFAULT_VOZ,
): Promise<{ cached: boolean }> {
  if (await existe(destino)) return { cached: true };

  await ensureDirFor(destino);
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voz, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wind-tts-'));
  try {
    const { audioFilePath } = await tts.toFile(tmpDir, escapeXml(texto));
    await fs.rename(audioFilePath, destino);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
  return { cached: false };
}

/** Duración en segundos (ffprobe). */
export async function duracionAudio(file: string): Promise<number> {
  const out = await new Promise<string>((resolve, reject) => {
    const proc = spawn(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';
    proc.stdout?.on('data', (d) => { stdout += d.toString(); });
    proc.stderr?.on('data', (d) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`ffprobe salió ${code}: ${stderr.slice(-300)}`));
    });
    proc.on('error', reject);
  });
  const n = Number(out);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`duración inválida de ${file}: ${out}`);
  return n;
}
