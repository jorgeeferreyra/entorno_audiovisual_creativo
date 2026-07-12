/**
 * Animatic de madres: milestone barato previo a generar video/audio.
 *
 * Arma un MP4 9:16 donde cada clip del reel aparece como su imagen madre fija,
 * con el subtítulo (off ES) quemado. Con `--off`, la duración de cada escena la
 * determina su locución (`max(presupuesto, durOff + respiro)`): el `duration` de
 * la ficha / `dur` de la cutlist es presupuesto/piso. Sirve para aprobar ritmo,
 * orden, texto y convergencia texto/duración ANTES de gastar en video/audio.
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
import {
  DEFAULT_VOZ,
  duracionAudio,
  rutaCacheOff,
  sintetizarOff,
} from './tts.js';

const W = 1080;
const H = 1920;
const DEFAULT_DURATION = 5;
const FONT_SIZE = 48;
const WRAP_CHARS = 30;
/** Respiro tras la locución antes del corte (segundos). */
const RESPIRO = 0.4;

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
   * Modo borrador: (1) variación aún no generada (`a{arco}-m{nn}v{k}`) → madre
   * base; (2) FLF con un keyframe faltante → still del keyframe que sí existe
   * por la duración completa. Habilita aprobar ritmo/orden ANTES de pagar
   * variaciones/keyframes. No valida unicidad: las repeticiones son esperadas.
   */
  borrador?: boolean;
  /**
   * Si se setea (slug del reel), al resolver una madre preferir
   * `reels/<slug>/_madres-uniformes/{basename}` cuando exista.
   */
  uniformesReel?: string;
  /**
   * Sintetiza la voz en off (Edge TTS, gratis) y la muxea sobre el animatic.
   * Opt-in: sin el flag el MP4 sigue mudo (solo subtítulos quemados).
   */
  off?: boolean;
  /** Voz Edge TTS. Default: es-AR-TomasNeural. */
  voz?: string;
}

/**
 * Slot degradado en modo borrador: variación→madre base, o FLF incompleto
 * (keyframe faltante → keyframe existente). `ref` = lo pedido; `base` = lo usado.
 */
export interface Degradado {
  id: string;
  ref: string;
  base: string;
}

/**
 * Locución cuyo audio supera el presupuesto del slot.
 * Señal del gate: refinar texto en `arco-N-off.md` (o subir `duration` al valor
 * permitido por el motor). El animatic ya estira la escena para quedar escuchable.
 */
export interface OffAviso {
  id: string;
  /** Duración real del audio TTS. */
  durOff: number;
  /** Presupuesto original (ficha / cutlist), antes de estirar. */
  durSlot: number;
  /** Duración final del slot tras estirar por audio. */
  durFinal: number;
  /** Segundos que el audio excede el presupuesto (`durOff - durSlot`, ≥ 0). */
  exceso: number;
}

export interface MontarAnimaticResult {
  localPath: string;
  segmentCount: number;
  omitidos: { id: string; motivo: string }[];
  degradados: Degradado[];
  /** Locuciones sintetizadas o cacheadas (0 si `--off` no está activo). */
  offLocuciones: number;
  /** Offs que exceden su presupuesto (criterio de salida del gate: 0). */
  offAvisos: OffAviso[];
  /** Duración total del animatic (suma de segmentos, post-ajuste por audio). */
  durTotal: number;
  /** Suma de presupuestos originales (pre-ajuste). */
  durPresupuesto: number;
}

export interface MontarAnimaticReelOpts {
  borrador?: boolean;
  /** Preferir reels/<reel>/_madres-uniformes/ al resolver madres. */
  uniformes?: boolean;
  off?: boolean;
  voz?: string;
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
  // "(silencio)" / "silencio" = sin locución (no sintetizar la palabra).
  if (/^\(?\s*silencio\s*\)?$/i.test(clean)) return undefined;
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
  opts?: { borrador?: boolean; uniformesReel?: string; degradados?: Degradado[] },
): Promise<{ segmentos: Segmento[]; omitido?: Omitido }> {
  const subtitulo = offMap.get(spec.id);
  const duracion = durOverride ?? duracionDe(spec);

  const resolver = async (ref: string): Promise<string | Omitido> => {
    let imagen = resolveReadPath(resolveAssetRef(ref, arco, specs));
    if (opts?.uniformesReel) {
      const { resolvePreferUniforme } = await import('./uniformar.js');
      imagen = await resolvePreferUniforme(opts.uniformesReel, imagen);
    }
    if (await existe(imagen)) return imagen;
    // Borrador: una variación aún no generada degrada a su madre base, que ya
    // está en disco. Deja registro en `degradados` para que la salida lo avise.
    if (opts?.borrador) {
      const m = ref.match(VARIATION_RE);
      if (m) {
        const base = m[1];
        let baseImagen = resolveReadPath(resolveAssetRef(base, arco, specs));
        if (opts.uniformesReel) {
          const { resolvePreferUniforme } = await import('./uniformar.js');
          baseImagen = await resolvePreferUniforme(opts.uniformesReel, baseImagen);
        }
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
    const last = await resolver(spec.lastFrame);
    const firstOk = typeof first === 'string';
    const lastOk = typeof last === 'string';

    if (firstOk && lastOk) {
      const half = duracion / 2;
      return {
        segmentos: [
          { id: `${spec.id}-a`, imagen: first, duracion: half, subtitulo },
          { id: `${spec.id}-b`, imagen: last, duracion: half, subtitulo },
        ],
      };
    }

    // Borrador: FLF con un solo keyframe en disco → still de ese keyframe
    // (duración completa). Evita omitir el slot entero (hook a1-a1, huevo a2-a1b).
    if (opts?.borrador && (firstOk || lastOk)) {
      const imagen = firstOk ? first : last;
      const refFaltante = firstOk ? spec.lastFrame : spec.firstFrame;
      const baseUsada = firstOk ? spec.firstFrame : spec.lastFrame;
      opts.degradados?.push({ id: spec.id, ref: refFaltante, base: baseUsada });
      return {
        segmentos: [{ id: spec.id, imagen: imagen as string, duracion, subtitulo }],
      };
    }

    if (!firstOk) return { segmentos: [], omitido: first as Omitido };
    return { segmentos: [], omitido: last as Omitido };
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

/** Evento de voz: un off hablado una sola vez al inicio de su run de segmentos. */
interface OffEvento {
  id: string;
  texto: string;
  /** Índice del primer segmento del run en el array. */
  startIdx: number;
  /** Cantidad de segmentos del run (FLF = 2 mitades). */
  count: number;
  /** Duración acumulada del slot (suma de segmentos del run). */
  durSlot: number;
}

/**
 * Agrupa segmentos consecutivos con el mismo subtítulo en un solo evento de TTS.
 * Los FLF parten el off en first/last: se habla una vez y `durSlot` suma ambas mitades.
 */
function eventosOff(segmentos: Segmento[]): OffEvento[] {
  const events: OffEvento[] = [];
  let i = 0;
  while (i < segmentos.length) {
    const seg = segmentos[i];
    if (!seg.subtitulo) {
      i++;
      continue;
    }
    const texto = seg.subtitulo;
    const id = seg.id.replace(/-[ab]$/, '');
    const startIdx = i;
    let durSlot = 0;
    let count = 0;
    while (i < segmentos.length && segmentos[i].subtitulo === texto) {
      durSlot += segmentos[i].duracion;
      count++;
      i++;
    }
    events.push({ id, texto, startIdx, count, durSlot });
  }
  return events;
}

/** Redondeo a 2 decimales para reportes. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

interface OffPreparacion {
  /** Rutas de audio ya sintetizadas, en orden de eventos. */
  audioPaths: string[];
  /** Offset de inicio (ms) de cada audio, recalculado tras estirar. */
  delaysMs: number[];
  locuciones: number;
  avisos: OffAviso[];
}

/**
 * Sintetiza cada off, mide su duración y estira los segmentos del run cuando
 * `durOff + RESPIRO > presupuesto`. Nunca acorta: el presupuesto es piso.
 * Mutates `segmentos` in place. Devuelve paths + delays listos para muxear.
 */
async function prepararYAjustarOff(
  segmentos: Segmento[],
  cacheDir: string,
  voz: string,
): Promise<OffPreparacion> {
  const events = eventosOff(segmentos);
  if (!events.length) return { audioPaths: [], delaysMs: [], locuciones: 0, avisos: [] };

  await fs.mkdir(cacheDir, { recursive: true });

  const avisos: OffAviso[] = [];
  const audioPaths: string[] = [];

  for (const ev of events) {
    const dest = rutaCacheOff(cacheDir, ev.id, ev.texto, voz);
    await sintetizarOff(ev.texto, dest, voz);
    const durOff = await duracionAudio(dest);
    audioPaths.push(dest);

    const target = durOff + RESPIRO;
    let durFinal = ev.durSlot;
    if (target > ev.durSlot + 0.05) {
      const scale = target / ev.durSlot;
      for (let j = 0; j < ev.count; j++) {
        segmentos[ev.startIdx + j].duracion = round2(segmentos[ev.startIdx + j].duracion * scale);
      }
      // Corregir drift de redondeo: el último segmento absorbe el resto.
      const sumScaled = Array.from({ length: ev.count }, (_, j) => segmentos[ev.startIdx + j].duracion)
        .reduce((a, b) => a + b, 0);
      const drift = round2(target - sumScaled);
      if (drift !== 0) {
        segmentos[ev.startIdx + ev.count - 1].duracion = round2(
          segmentos[ev.startIdx + ev.count - 1].duracion + drift,
        );
      }
      durFinal = target;
      avisos.push({
        id: ev.id,
        durOff: round2(durOff),
        durSlot: round2(ev.durSlot),
        durFinal: round2(durFinal),
        exceso: round2(durOff - ev.durSlot),
      });
    }
  }

  // Offsets con las duraciones ya ajustadas.
  const delaysMs: number[] = [];
  let t = 0;
  let evIdx = 0;
  let i = 0;
  while (i < segmentos.length && evIdx < events.length) {
    const ev = events[evIdx];
    if (i === ev.startIdx) {
      delaysMs.push(Math.round(t * 1000));
      for (let j = 0; j < ev.count; j++) t += segmentos[i + j].duracion;
      i += ev.count;
      evIdx++;
      continue;
    }
    t += segmentos[i].duracion;
    i++;
  }

  return { audioPaths, delaysMs, locuciones: events.length, avisos };
}

/**
 * Arma una pista única (silencio + adelay + amix) y la muxea sobre el video.
 * Los paths/delays ya vienen de `prepararYAjustarOff` (duraciones ya estiradas).
 */
async function muxearOffTrack(
  videoPath: string,
  segmentos: Segmento[],
  audioPaths: string[],
  delaysMs: number[],
): Promise<void> {
  if (!audioPaths.length) return;

  const totalDur = segmentos.reduce((s, seg) => s + seg.duracion, 0);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wind-off-'));
  const trackPath = path.join(tmpDir, 'off-track.m4a');
  // Mismo directorio que el video: rename atómico (evita EXDEV entre /tmp y el proyecto).
  const muxedPath = `${videoPath}.off-tmp.mp4`;

  try {
    // [0] silencio de la duración total; [1..] cada off con adelay al offset del slot.
    const inputs: string[] = [
      '-f', 'lavfi', '-t', String(totalDur), '-i', 'anullsrc=channel_layout=mono:sample_rate=24000',
    ];
    for (const p of audioPaths) inputs.push('-i', p);

    const labels: string[] = [];
    const filters: string[] = [];
    for (let i = 0; i < audioPaths.length; i++) {
      const ms = delaysMs[i];
      filters.push(`[${i + 1}:a]adelay=${ms}|${ms}[o${i}]`);
      labels.push(`[o${i}]`);
    }
    const n = audioPaths.length + 1;
    filters.push(
      `[0:a]${labels.join('')}amix=inputs=${n}:duration=first:dropout_transition=0:normalize=0[aout]`,
    );

    await runFfmpeg([
      ...inputs,
      '-filter_complex', filters.join(';'),
      '-map', '[aout]',
      '-c:a', 'aac', '-b:a', '192k',
      trackPath,
    ]);

    await runFfmpeg([
      '-i', videoPath,
      '-i', trackPath,
      '-c:v', 'copy',
      '-c:a', 'aac', '-b:a', '192k',
      '-shortest',
      muxedPath,
    ]);

    await fs.rename(muxedPath, videoPath);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
    await fs.rm(muxedPath, { force: true }).catch(() => undefined);
  }
}

/** Renderiza cada segmento y concatena en el MP4 de salida. */
async function renderYConcat(
  segmentos: Segmento[],
  salida: string,
  offOpts?: { cacheDir: string; voz: string },
): Promise<{
  localPath: string;
  offLocuciones: number;
  offAvisos: OffAviso[];
  durTotal: number;
  durPresupuesto: number;
}> {
  const outPath = resolveWritePath(salida);
  await ensureDirFor(outPath);

  const colapsados = colapsarKeyframesCompartidos(segmentos);
  const durPresupuesto = round2(colapsados.reduce((s, seg) => s + seg.duracion, 0));

  // Con --off: sintetizar y estirar ANTES de renderizar, para que la duración
  // de cada escena la determine su audio (presupuesto = piso).
  let prep: OffPreparacion | undefined;
  if (offOpts) {
    prep = await prepararYAjustarOff(colapsados, offOpts.cacheDir, offOpts.voz);
  }

  const durTotal = round2(colapsados.reduce((s, seg) => s + seg.duracion, 0));

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

  if (prep?.audioPaths.length) {
    await muxearOffTrack(outPath, colapsados, prep.audioPaths, prep.delaysMs);
  }

  return {
    localPath: outPath,
    offLocuciones: prep?.locuciones ?? 0,
    offAvisos: prep?.avisos ?? [],
    durTotal,
    durPresupuesto,
  };
}

/**
 * Animatic de un hilo (arco): cada clip del `planos/arco-N.md` en orden de
 * documento. Útil para aprobar la fuente y las destacadas de ese arco.
 */
export async function montarAnimatic(input: MontarAnimaticInput): Promise<MontarAnimaticResult> {
  const { arco, specs, offMap, borrador, uniformesReel, off, voz } = input;

  const clips = specs.filter(
    (s) => s.kind === 'video-i2v' || s.kind === 'video-flf' || s.kind === 'montaje',
  );

  const omitidos: Omitido[] = [];
  const degradados: Degradado[] = [];
  const segmentos: Segmento[] = [];

  for (const spec of clips) {
    const r = await segmentosDeSpec(spec, arco, specs, offMap, undefined, {
      borrador,
      uniformesReel,
      degradados,
    });
    if (r.omitido) omitidos.push(r.omitido);
    segmentos.push(...r.segmentos);
  }

  if (!segmentos.length) {
    throw new Error(
      `Animatic vacío: ninguna imagen madre del arco ${arco} está en disco. Generá las madres primero (npm run gen).`,
    );
  }

  const offOpts = off
    ? {
        cacheDir: resolveWritePath(path.join('assets', `arco-${arco}`, 'audio', '_off-tts')),
        voz: voz ?? DEFAULT_VOZ,
      }
    : undefined;
  const rendered = await renderYConcat(segmentos, input.salida, offOpts);
  return {
    localPath: rendered.localPath,
    segmentCount: segmentos.length,
    omitidos,
    degradados,
    offLocuciones: rendered.offLocuciones,
    offAvisos: rendered.offAvisos,
    durTotal: rendered.durTotal,
    durPresupuesto: rendered.durPresupuesto,
  };
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
 * En modo `borrador`, las variaciones faltantes degradan a madre base y los FLF
 * con un keyframe faltante degradan a still del existente, para aprobar
 * ritmo/orden antes de pagarlos (ver MontarAnimaticInput.borrador).
 * Con `off`, sintetiza la voz en off (Edge TTS) y la muxea sobre el MP4.
 */
export async function montarAnimaticReel(
  reel: string,
  salida: string,
  opts: MontarAnimaticReelOpts | boolean = {},
): Promise<MontarAnimaticResult> {
  // Compat: firma vieja `montarAnimaticReel(reel, salida, borrador: boolean)`.
  const { borrador, uniformes, off, voz } = typeof opts === 'boolean' ? { borrador: opts } : opts;
  const items = await parseCutlist(reel);

  // Carga perezosa por arco: null = el arco aún no tiene planos.
  const specsCache = new Map<number, AssetSpec[] | null>();
  const offCache = new Map<number, Map<string, string>>();

  const omitidos: Omitido[] = [];
  const degradados: Degradado[] = [];
  const segmentos: Segmento[] = [];
  const uniformesReel = uniformes ? reel : undefined;

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
    const offMap = offCache.get(arco) ?? new Map<string, string>();
    const r = await segmentosDeSpec(spec, arco, specs, offMap, item.dur, {
      borrador,
      uniformesReel,
      degradados,
    });
    if (r.omitido) omitidos.push(r.omitido);
    segmentos.push(...r.segmentos);
  }

  if (!segmentos.length) {
    throw new Error(
      `Animatic vacío: ningún clip de la cut-list de ${reel} tiene su imagen madre en disco.`,
    );
  }

  const offOpts = off
    ? {
        cacheDir: resolveWritePath(path.join('reels', reel, '_off-tts')),
        voz: voz ?? DEFAULT_VOZ,
      }
    : undefined;
  const rendered = await renderYConcat(segmentos, salida, offOpts);
  return {
    localPath: rendered.localPath,
    segmentCount: segmentos.length,
    omitidos,
    degradados,
    offLocuciones: rendered.offLocuciones,
    offAvisos: rendered.offAvisos,
    durTotal: rendered.durTotal,
    durPresupuesto: rendered.durPresupuesto,
  };
}
