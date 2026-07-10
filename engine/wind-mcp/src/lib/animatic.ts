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
import YAML from 'yaml';
import { WORK_DIR, resolveReadPath, resolveWritePath } from '../config.js';
import { runFfmpeg } from './montaje.js';
import { ensureDirFor } from './paths.js';
import { leerPlanos, resolveAssetRef, type AssetSpec } from './specs.js';

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
  /**
   * Modo borrador: si un `firstFrame`/`lastFrame` apunta a una variación aún no
   * generada (`a{arco}-m{nn}v{k}`), degrada a su madre base (`a{arco}-m{nn}`).
   * Habilita aprobar ritmo/orden ANTES de pagar las variaciones. No valida
   * unicidad: las repeticiones son esperadas en esta pasada.
   */
  borrador?: boolean;
}

/** Slot cuyo frame de variación se resolvió a la madre base (solo modo borrador). */
export interface Degradado {
  id: string;
  ref: string;
  base: string;
}

export interface MontarAnimaticResult {
  localPath: string;
  segmentCount: number;
  omitidos: { id: string; motivo: string }[];
  degradados: Degradado[];
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

/** Fuente de imagen fija de un clip no-FLF: firstFrame (i2v) o fuente (montaje). */
function fuenteDe(spec: AssetSpec): string | undefined {
  if (spec.kind === 'video-i2v') return spec.firstFrame;
  if (spec.kind === 'montaje') return spec.fuente;
  return undefined;
}

function duracionDe(spec: AssetSpec): number {
  if (spec.kind === 'video-i2v' || spec.kind === 'video-flf') return spec.duration;
  if (spec.kind === 'montaje' && typeof spec.duration === 'number') return spec.duration;
  return DEFAULT_DURATION;
}

/** Número de arco de un id de clip (`a3-c2` → 3), o null si no tiene prefijo. */
function arcoDeClip(clip: string): number | null {
  const m = clip.match(/^a(\d+)-/);
  return m ? Number(m[1]) : null;
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

type Omitido = { id: string; motivo: string };

/** `a3-m01v1` → grupo 1 = `a3-m01` (madre base). No matchea madres ni intermedias. */
const VARIATION_RE = /^(a\d+-m\d+)v\d+$/;

async function renderSegmento(
  seg: Segmento,
  idx: number,
  tmpDir: string,
  fontFile: string | undefined,
): Promise<string> {
  const filtros = [
    `scale=${W}:${H}:force_original_aspect_ratio=decrease`,
    `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2`,
    'setsar=1',
  ];

  if (seg.subtitulo) {
    // idx en el nombre: garantiza unicidad aunque un clip aparezca dos veces.
    const textFile = path.join(tmpDir, `${idx}-${seg.id}.txt`);
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

  const out = path.join(tmpDir, `${idx}-${seg.id}.mp4`);
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

/**
 * Traduce una spec de clip a 0..2 segmentos de animatic.
 * - i2v / montaje: 1 segmento (imagen fija por su duración).
 * - flf: 2 segmentos de `duracion/2` (firstFrame → lastFrame) para representar
 *   la transformación; si no, un FLF se vería idéntico a su still inicial.
 * Si una imagen fuente aún no está en disco, devuelve un omitido (animatic parcial).
 */
async function segmentosDeSpec(
  spec: AssetSpec,
  arco: number,
  specs: AssetSpec[],
  offMap: Map<string, string>,
  durOverride?: number,
  opts?: { borrador?: boolean; degradados?: Degradado[] },
): Promise<{ segmentos: Segmento[]; omitido?: Omitido }> {
  const subtitulo = offMap.get(spec.id);
  const duracion = durOverride ?? duracionDe(spec);

  const resolver = async (ref: string): Promise<string | Omitido> => {
    const imagen = resolveReadPath(resolveAssetRef(ref, arco, specs));
    if (await existe(imagen)) return imagen;
    // Borrador: una variación aún no generada degrada a su madre base, que ya
    // está en disco. Deja registro en `degradados` para que la salida lo avise.
    if (opts?.borrador) {
      const m = ref.match(VARIATION_RE);
      if (m) {
        const base = m[1];
        const baseImagen = resolveReadPath(resolveAssetRef(base, arco, specs));
        if (await existe(baseImagen)) {
          opts.degradados?.push({ id: spec.id, ref, base });
          return baseImagen;
        }
      }
    }
    return { id: spec.id, motivo: `imagen aún no generada (${ref})` };
  };

  if (spec.kind === 'video-flf') {
    const first = await resolver(spec.firstFrame);
    if (typeof first !== 'string') return { segmentos: [], omitido: first };
    const last = await resolver(spec.lastFrame);
    if (typeof last !== 'string') return { segmentos: [], omitido: last };
    const half = duracion / 2;
    return {
      segmentos: [
        { id: `${spec.id}-a`, imagen: first, duracion: half, subtitulo },
        { id: `${spec.id}-b`, imagen: last, duracion: half, subtitulo },
      ],
    };
  }

  const fuente = fuenteDe(spec);
  if (!fuente) return { segmentos: [], omitido: { id: spec.id, motivo: 'sin imagen fuente (firstFrame/fuente)' } };
  const imagen = await resolver(fuente);
  if (typeof imagen !== 'string') return { segmentos: [], omitido: imagen };
  return { segmentos: [{ id: spec.id, imagen, duracion, subtitulo }] };
}

/**
 * Colapsa segmentos consecutivos con la misma imagen y el mismo subtítulo,
 * sumando sus duraciones. En una cadena de keyframes (m_A→m_B→m_C, eslabones
 * FLF que comparten el keyframe intermedio), el `lastFrame` de un eslabón y el
 * `firstFrame` del siguiente son la MISMA madre: sin colapsar, m_B aparecería
 * dos veces seguidas y duplicaría su tiempo en pantalla, distorsionando el
 * ritmo que el gate debe evaluar. Si el subtítulo difiere, se conservan ambos
 * (el texto manda).
 */
function colapsarKeyframesCompartidos(segmentos: Segmento[]): Segmento[] {
  const out: Segmento[] = [];
  for (const seg of segmentos) {
    const prev = out[out.length - 1];
    if (prev && prev.imagen === seg.imagen && prev.subtitulo === seg.subtitulo) {
      prev.duracion += seg.duracion;
    } else {
      out.push({ ...seg });
    }
  }
  return out;
}

/** Renderiza cada segmento y concatena en el MP4 de salida. */
async function renderYConcat(segmentos: Segmento[], salida: string): Promise<string> {
  const outPath = resolveWritePath(salida);
  await ensureDirFor(outPath);

  const colapsados = colapsarKeyframesCompartidos(segmentos);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wind-animatic-'));
  try {
    const fontFile = await resolveFont();
    const segPaths: string[] = [];
    for (let i = 0; i < colapsados.length; i++) {
      segPaths.push(await renderSegmento(colapsados[i], i, tmpDir, fontFile));
    }

    const listFile = path.join(tmpDir, 'concat.txt');
    const body = segPaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
    await fs.writeFile(listFile, body);

    await runFfmpeg(['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', outPath]);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
  return outPath;
}

/**
 * Animatic de un hilo (arco): cada clip del `planos/arco-N.md` en orden de
 * documento. Útil para aprobar la fuente y las destacadas de ese arco.
 */
export async function montarAnimatic(input: MontarAnimaticInput): Promise<MontarAnimaticResult> {
  const { arco, specs, offMap, borrador } = input;

  const clips = specs.filter(
    (s) => s.kind === 'video-i2v' || s.kind === 'video-flf' || s.kind === 'montaje',
  );

  const omitidos: Omitido[] = [];
  const degradados: Degradado[] = [];
  const segmentos: Segmento[] = [];

  for (const spec of clips) {
    const r = await segmentosDeSpec(spec, arco, specs, offMap, undefined, { borrador, degradados });
    if (r.omitido) omitidos.push(r.omitido);
    segmentos.push(...r.segmentos);
  }

  if (!segmentos.length) {
    throw new Error(
      `Animatic vacío: ninguna imagen madre del arco ${arco} está en disco. Generá las madres primero (npm run gen).`,
    );
  }

  const localPath = await renderYConcat(segmentos, input.salida);
  return { localPath, segmentCount: segmentos.length, omitidos, degradados };
}

export interface CutlistItem {
  clip: string;
  /** Override de duración en segundos para el recorte del reel. */
  dur?: number;
}

/**
 * Lee la cut-list del front-matter del README de un reel
 * (`reels/<reel>/README.md`). Formato: `cutlist: [{ clip, dur }, ...]`.
 */
export async function parseCutlist(reel: string): Promise<CutlistItem[]> {
  const readme = path.join(WORK_DIR, 'reels', reel, 'README.md');
  const md = await fs.readFile(readme, 'utf8');
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`${reel}: README sin front-matter YAML`);
  const data = YAML.parse(fm[1]) as { cutlist?: { clip?: unknown; dur?: unknown }[] };
  if (!Array.isArray(data?.cutlist) || !data.cutlist.length) {
    throw new Error(`${reel}: front-matter sin 'cutlist' (lista de { clip, dur })`);
  }
  return data.cutlist.map((c) => ({
    clip: String(c.clip),
    dur: typeof c.dur === 'number' ? c.dur : undefined,
  }));
}

/**
 * Animatic del reel transversal: intercala clips de varios arcos en el orden y
 * las duraciones de la cut-list del README. Es el gate que protege el mayor
 * costo (video). Los clips cuyo `planos/arco-N.md` aún no existe, o cuya imagen
 * madre no está en disco, se reportan como omitidos (animatic parcial).
 * En modo `borrador`, las variaciones aún no generadas degradan a su madre base
 * para aprobar ritmo/orden antes de pagarlas (ver MontarAnimaticInput.borrador).
 */
export async function montarAnimaticReel(
  reel: string,
  salida: string,
  borrador = false,
): Promise<MontarAnimaticResult> {
  const items = await parseCutlist(reel);

  // Carga perezosa por arco: null = el arco aún no tiene planos.
  const specsCache = new Map<number, AssetSpec[] | null>();
  const offCache = new Map<number, Map<string, string>>();

  const omitidos: Omitido[] = [];
  const degradados: Degradado[] = [];
  const segmentos: Segmento[] = [];

  for (const item of items) {
    const arco = arcoDeClip(item.clip);
    if (arco == null) {
      omitidos.push({ id: item.clip, motivo: 'id sin prefijo de arco (aN-)' });
      continue;
    }
    if (!specsCache.has(arco)) {
      try {
        specsCache.set(arco, await leerPlanos(arco));
        offCache.set(arco, await parseOff(arco));
      } catch {
        specsCache.set(arco, null);
      }
    }
    const specs = specsCache.get(arco);
    if (!specs) {
      omitidos.push({ id: item.clip, motivo: `planos/arco-${arco}.md aún no existe` });
      continue;
    }
    const spec = specs.find((s) => s.id === item.clip);
    if (!spec) {
      omitidos.push({ id: item.clip, motivo: `no está en planos/arco-${arco}.md` });
      continue;
    }
    if (spec.kind === 'image') {
      omitidos.push({ id: item.clip, motivo: 'es una imagen madre, no un clip' });
      continue;
    }
    const off = offCache.get(arco) ?? new Map<string, string>();
    const r = await segmentosDeSpec(spec, arco, specs, off, item.dur, { borrador, degradados });
    if (r.omitido) omitidos.push(r.omitido);
    segmentos.push(...r.segmentos);
  }

  if (!segmentos.length) {
    throw new Error(
      `Animatic vacío: ningún clip de la cut-list de ${reel} tiene su imagen madre en disco.`,
    );
  }

  const localPath = await renderYConcat(segmentos, salida);
  return { localPath, segmentCount: segmentos.length, omitidos, degradados };
}
