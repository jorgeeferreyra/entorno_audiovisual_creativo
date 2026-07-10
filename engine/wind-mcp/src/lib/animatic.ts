/**
 * Animatic de madres: milestone barato previo a generar video/audio.
 *
 * Arma un MP4 9:16 donde cada clip del reel aparece como su imagen madre fija,
 * durante el tiempo que tendrá el clip (default 5s), con el subtítulo (off ES)
 * de ese fragmento quemado. Sirve para aprobar ritmo, orden y texto ANTES de
 * gastar en video/audio (el mayor costo del presupuesto).
 *
 * Es deliberadamente crudo: imagen fija + texto, sin Ken Burns ni transiciones.
 * Reutiliza el patrón ffmpeg de montaje.ts (spawn + concat demuxer).
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { WORK_DIR, resolveReadPath, resolveWritePath } from '../config.js';
import { runFfmpeg } from './montaje.js';
import { ensureDirFor } from './paths.js';
import { resolveAssetRef, type AssetSpec } from './specs.js';

const W = 1080;
const H = 1920;
const DEFAULT_DURATION = 5;
const FONT_SIZE = 48;
const WRAP_CHARS = 30;

/** Fuentes candidatas por SO; se usa la primera existente (drawtext las exige). */
const FONT_CANDIDATES = [
  '/System/Library/Fonts/Supplemental/Arial.ttf',
  '/System/Library/Fonts/Helvetica.ttc',
  '/Library/Fonts/Arial.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
];

export interface MontarAnimaticInput {
  arco: number;
  /** Todas las specs del arco (orden de documento). */
  specs: AssetSpec[];
  /** clipId → texto de subtítulo (off ES). Ver parseOff. */
  offMap: Map<string, string>;
  /** Ruta de salida, relativa a la unidad o absoluta. */
  salida: string;
}

export interface MontarAnimaticResult {
  localPath: string;
  segmentCount: number;
  omitidos: { id: string; motivo: string }[];
}

async function existe(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function resolveFont(): Promise<string | undefined> {
  for (const f of FONT_CANDIDATES) {
    if (await existe(f)) return f;
  }
  return undefined; // sin fontfile: drawtext cae a fontconfig si está disponible
}

/** Limpia una celda de la columna Off: quita markdown y devuelve el texto (o nada). */
function limpiarOff(cell: string): string | undefined {
  const clean = cell.replace(/\*/g, '').trim();
  if (!clean || /SIN off/i.test(clean)) return undefined;
  const quoted = clean.match(/"([^"]+)"/);
  return (quoted ? quoted[1] : clean).trim() || undefined;
}

/**
 * Lee planos/arco-N-off.md y devuelve un mapa clipId → subtítulo. Si el archivo
 * no existe (arcos aún sin off literal), devuelve un mapa vacío (animatic sin
 * subtítulos, no es un error).
 */
export async function parseOff(arco: number): Promise<Map<string, string>> {
  const offMd = path.join(WORK_DIR, 'planos', `arco-${arco}-off.md`);
  const map = new Map<string, string>();
  let md: string;
  try {
    md = await fs.readFile(offMd, 'utf8');
  } catch {
    return map;
  }
  const idRe = new RegExp(`a${arco}-[a-z0-9]+`);
  for (const line of md.split('\n')) {
    if (!line.trimStart().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2) continue;
    // El id vive en la primera columna solo en las tablas de off por clip; así
    // se ignoran encabezados, separadores y las tablas de destacadas/auditoría.
    const idMatch = cells[0].match(idRe);
    if (!idMatch) continue;
    const text = limpiarOff(cells[1]);
    if (text) map.set(idMatch[0], text);
  }
  return map;
}

/** Fuente de imagen fija de un clip: firstFrame (i2v/flf) o fuente (montaje). */
function fuenteDe(spec: AssetSpec): string | undefined {
  if (spec.kind === 'video-i2v' || spec.kind === 'video-flf') return spec.firstFrame;
  if (spec.kind === 'montaje') return spec.fuente;
  return undefined;
}

function duracionDe(spec: AssetSpec): number {
  if (spec.kind === 'video-i2v' || spec.kind === 'video-flf') return spec.duration;
  if (spec.kind === 'montaje' && typeof spec.duration === 'number') return spec.duration;
  return DEFAULT_DURATION;
}

/** Corta el texto en líneas de ~WRAP_CHARS para el drawtext (sin autowrap nativo). */
function wrap(text: string, max = WRAP_CHARS): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  }
  if (cur) lines.push(cur);
  return lines.join('\n');
}

interface Segmento {
  id: string;
  imagen: string;
  duracion: number;
  subtitulo?: string;
}

async function renderSegmento(
  seg: Segmento,
  tmpDir: string,
  fontFile: string | undefined,
): Promise<string> {
  const filtros = [
    `scale=${W}:${H}:force_original_aspect_ratio=decrease`,
    `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2`,
    'setsar=1',
  ];

  if (seg.subtitulo) {
    const textFile = path.join(tmpDir, `${seg.id}.txt`);
    await fs.writeFile(textFile, wrap(seg.subtitulo));
    const opts = [
      fontFile ? `fontfile='${fontFile}'` : '',
      `textfile='${textFile}'`,
      'fontcolor=white',
      `fontsize=${FONT_SIZE}`,
      'line_spacing=12',
      'box=1',
      'boxcolor=black@0.55',
      'boxborderw=28',
      'x=(w-text_w)/2',
      'y=h-text_h-160',
    ].filter(Boolean);
    filtros.push(`drawtext=${opts.join(':')}`);
  }

  const out = path.join(tmpDir, `${seg.id}.mp4`);
  await runFfmpeg([
    '-loop', '1',
    '-t', String(seg.duracion),
    '-i', seg.imagen,
    '-vf', filtros.join(','),
    '-r', '30',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-an',
    out,
  ]);
  return out;
}

export async function montarAnimatic(input: MontarAnimaticInput): Promise<MontarAnimaticResult> {
  const { arco, specs, offMap } = input;

  const clips = specs.filter(
    (s) => s.kind === 'video-i2v' || s.kind === 'video-flf' || s.kind === 'montaje',
  );

  const omitidos: { id: string; motivo: string }[] = [];
  const segmentos: Segmento[] = [];

  for (const spec of clips) {
    const fuente = fuenteDe(spec);
    if (!fuente) {
      omitidos.push({ id: spec.id, motivo: 'sin imagen fuente (firstFrame/fuente)' });
      continue;
    }
    const imagen = resolveReadPath(resolveAssetRef(fuente, arco, specs));
    if (!(await existe(imagen))) {
      omitidos.push({ id: spec.id, motivo: `imagen aún no generada (${fuente})` });
      continue;
    }
    segmentos.push({
      id: spec.id,
      imagen,
      duracion: duracionDe(spec),
      subtitulo: offMap.get(spec.id),
    });
  }

  if (!segmentos.length) {
    throw new Error(
      `Animatic vacío: ninguna imagen madre del arco ${arco} está en disco. Generá las madres primero (npm run gen).`,
    );
  }

  const outPath = resolveWritePath(input.salida);
  await ensureDirFor(outPath);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wind-animatic-'));
  try {
    const fontFile = await resolveFont();
    const segPaths: string[] = [];
    for (const seg of segmentos) {
      segPaths.push(await renderSegmento(seg, tmpDir, fontFile));
    }

    const listFile = path.join(tmpDir, 'concat.txt');
    const body = segPaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
    await fs.writeFile(listFile, body);

    await runFfmpeg(['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', outPath]);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }

  return { localPath: outPath, segmentCount: segmentos.length, omitidos };
}
