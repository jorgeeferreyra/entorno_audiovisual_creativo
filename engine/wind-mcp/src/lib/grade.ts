/**
 * Capa determinística de uniformidad: look derivado de locks + crop 9:16 + grade.
 * Sin modelos generativos — solo ffmpeg (ops globales / per-pixel).
 */
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveWritePath } from '../config.js';
import { runFfmpeg } from './montaje.js';
import { ensureDirFor } from './paths.js';

export type GradePerfil = 'full' | 'grano';
export type RegistroGrade = 'cuento' | 'real';

export interface ImageDims {
  width: number;
  height: number;
}

export interface ImageStats extends ImageDims {
  meanY: number;
  meanU: number;
  meanV: number;
}

export interface CropWindow {
  /** Offset X del crop (px). */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Clasificación para auditoría. */
  clase: 'ya-916' | 'trivial' | 'recorte' | 'apaisada';
}

export interface LookRegistro {
  sat: number;
  contrast: number;
  brightness: number;
  gamma: number;
  paperOpacity: number;
  grainOpacity: number;
  vignette: number;
}

export interface LookDoc {
  version: 1;
  reel: string;
  derivedAt: string;
  locks: {
    cuento: { path: string; stats: ImageStats };
    real: { path: string; stats: ImageStats };
  };
  cuento: LookRegistro;
  real: LookRegistro;
  grano: LookRegistro;
  hash: string;
}

export interface ApplyGradeOpts {
  srcAbs: string;
  destAbs: string;
  registro: RegistroGrade;
  perfil: GradePerfil;
  look: LookDoc;
  lookDir: string;
  /** Si true, no aplica crop (outpaint pendiente o aspecto nativo). */
  skipCrop?: boolean;
  /** Marca sidecar: true solo para outpaint diferido (no para nativo). */
  aspectoPendiente?: boolean;
  /** Offset horizontal relativo al centro (−1..1) o px absolutos si |valor| ≥ 1. */
  cropOffset?: number;
  /** 0..1 — escala el look hacia neutro (default 1). */
  intensidad?: number;
}

async function existe(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function runCapture(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    proc.stdout?.on('data', (d) => { out += d.toString(); });
    proc.stderr?.on('data', (d) => { err += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve(out || err);
      else reject(new Error(`${cmd} salió ${code}: ${(err || out).slice(-400)}`));
    });
    proc.on('error', reject);
  });
}

export async function probeDims(abs: string): Promise<ImageDims> {
  const raw = await runCapture('ffprobe', [
    '-v', 'quiet',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=p=0',
    abs,
  ]);
  const [w, h] = raw.trim().split(',').map(Number);
  if (!w || !h) throw new Error(`probeDims: dims inválidas para ${abs}`);
  return { width: w, height: h };
}

/** Stats lavfi signalstats (YUV) — suficiente para anclar el look. */
export async function measureImage(abs: string): Promise<ImageStats> {
  const dims = await probeDims(abs);
  const err = await runCapture('ffmpeg', [
    '-i', abs,
    '-vf', 'signalstats,metadata=print:file=-',
    '-f', 'null', '-',
  ]);
  const pick = (key: string, fallback: number): number => {
    const m = err.match(new RegExp(`lavfi\\.signalstats\\.${key}=([\\d.]+)`));
    return m ? Number(m[1]) : fallback;
  };
  return {
    ...dims,
    meanY: pick('YAVG', 128),
    meanU: pick('UAVG', 128),
    meanV: pick('VAVG', 128),
  };
}

export function lookDir(reel: string): string {
  return resolveWritePath(path.join('reels', reel, '_look'));
}

export function auditDir(reel: string): string {
  return resolveWritePath(path.join('reels', reel, '_audit'));
}

function hashLookPayload(payload: Omit<LookDoc, 'hash' | 'derivedAt'>): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16);
}

/** Parámetros fijos por registro, anclados a stats del lock (nunca por madre). */
function buildLookRegistros(cuento: ImageStats, real: ImageStats): {
  cuento: LookRegistro;
  real: LookRegistro;
  grano: LookRegistro;
} {
  // Defaults suaves: el bug de opacidad previa aplicaba textura a intensidad plena.
  // sat anclado leve al lock; contraste casi neutro para no aplastar negros.
  const cuentoSat = cuento.meanV > 128 ? 1.02 : 1.0;
  const realSat = real.meanU > 128 ? 0.96 : 0.98;
  return {
    cuento: {
      sat: cuentoSat,
      contrast: 1.02,
      brightness: 0.005,
      gamma: 1.0,
      paperOpacity: 0.035,
      grainOpacity: 0.025,
      vignette: 0.08,
    },
    real: {
      sat: realSat,
      contrast: 1.03,
      brightness: 0,
      gamma: 1.01,
      paperOpacity: 0,
      grainOpacity: 0.07,
      vignette: 0.06,
    },
    grano: {
      sat: 1,
      contrast: 1,
      brightness: 0,
      gamma: 1,
      paperOpacity: 0,
      grainOpacity: 0.035,
      vignette: 0.025,
    },
  };
}

/**
 * Ventana 9:16. cropOffset: fracción del margen disponible (−1 izq … +1 der),
 * o píxeles absolutos si |offset| ≥ 1.
 */
export function computeCrop(dims: ImageDims, cropOffset?: number): CropWindow {
  const { width: W, height: H } = dims;
  const target = 9 / 16;
  const ratio = W / H;

  // Ya 9:16 (tol 0.5%).
  if (Math.abs(ratio - target) < 0.005) {
    return { x: 0, y: 0, w: W, h: H, clase: 'ya-916' };
  }

  let cropW: number;
  let cropH: number;
  let x: number;
  let y: number;
  let clase: CropWindow['clase'];

  if (ratio > target) {
    // Más ancha que 9:16 → recortar ancho, altura completa.
    cropH = H;
    cropW = Math.floor((H * 9) / 16);
    // Paridad: evitar dims impares raras en algunos codecs.
    if (cropW % 2) cropW -= 1;
    const margin = W - cropW;
    x = resolveOffset(margin, cropOffset);
    y = 0;
    const lost = margin / W;
    if (lost <= 0.03) clase = 'trivial';
    else if (lost > 0.5 || ratio > 1.5) clase = 'apaisada';
    else clase = 'recorte';
  } else {
    // Más alta que 9:16 → recortar alto, ancho completo.
    cropW = W;
    cropH = Math.floor((W * 16) / 9);
    if (cropH % 2) cropH -= 1;
    const margin = H - cropH;
    x = 0;
    y = resolveOffset(margin, cropOffset);
    clase = 'recorte';
  }

  return { x, y, w: cropW, h: cropH, clase };
}

function resolveOffset(margin: number, cropOffset?: number): number {
  if (margin <= 0) return 0;
  if (cropOffset == null) return Math.floor(margin / 2);
  if (Math.abs(cropOffset) >= 1) {
    return Math.max(0, Math.min(margin, Math.round(cropOffset)));
  }
  // −1..1 → 0..margin
  const t = (cropOffset + 1) / 2;
  return Math.max(0, Math.min(margin, Math.round(t * margin)));
}

/**
 * Placa de papel: mottle sintético = noise mono blureado a tamaño de salida.
 * Seed fijo → reproducible; format=gray → cero crominancia.
 */
async function ensurePaperPlate(lookDirAbs: string, _lockCuentoAbs: string, w: number, h: number): Promise<string> {
  const name = `paper-${w}x${h}.png`;
  const out = path.join(lookDirAbs, name);
  if (await existe(out)) return out;

  await ensureDirFor(out);
  await runFfmpeg([
    '-f', 'lavfi',
    '-i', `color=c=gray:s=${w}x${h}:d=1`,
    '-vf',
    'format=gray,noise=alls=40:allf=u:all_seed=4242,gblur=sigma=12,eq=contrast=1.1:brightness=0.02,format=rgb24',
    '-frames:v', '1',
    out,
  ]);
  return out;
}

/** Archiva look.json + placas existentes en _look/_prev/ (nunca borra). */
async function archiveLookArtifacts(lookDirAbs: string): Promise<void> {
  const prev = path.join(lookDirAbs, '_prev');
  await fs.mkdir(prev, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  let entries: string[] = [];
  try {
    entries = await fs.readdir(lookDirAbs);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === '_prev') continue;
    if (!/\.(json|png)$/i.test(name)) continue;
    const src = path.join(lookDirAbs, name);
    const dest = path.join(prev, `${name.replace(/\.(json|png)$/i, '')}-${stamp}${(name.match(/\.(json|png)$/i) ?? [''])[0]}`);
    await fs.rename(src, dest);
  }
}

export async function deriveLook(opts: {
  reel: string;
  lockCuentoAbs: string;
  lockRealAbs: string;
  force?: boolean;
}): Promise<{ look: LookDoc; lookDirAbs: string }> {
  const lookDirAbs = lookDir(opts.reel);
  const lookPath = path.join(lookDirAbs, 'look.json');
  await fs.mkdir(lookDirAbs, { recursive: true });

  if (!opts.force && (await existe(lookPath))) {
    const raw = JSON.parse(await fs.readFile(lookPath, 'utf8')) as LookDoc;
    return { look: raw, lookDirAbs };
  }

  if (opts.force) {
    await archiveLookArtifacts(lookDirAbs);
  }

  const cuentoStats = await measureImage(opts.lockCuentoAbs);
  const realStats = await measureImage(opts.lockRealAbs);
  const regs = buildLookRegistros(cuentoStats, realStats);

  const base: Omit<LookDoc, 'hash' | 'derivedAt'> = {
    version: 1,
    reel: opts.reel,
    locks: {
      cuento: { path: opts.lockCuentoAbs, stats: cuentoStats },
      real: { path: opts.lockRealAbs, stats: realStats },
    },
    ...regs,
  };
  const look: LookDoc = {
    ...base,
    derivedAt: new Date().toISOString(),
    hash: hashLookPayload(base),
  };

  await ensurePaperPlate(lookDirAbs, opts.lockCuentoAbs, cuentoStats.width, cuentoStats.height);

  await fs.writeFile(lookPath, JSON.stringify(look, null, 2));
  return { look, lookDirAbs };
}

function pickParams(
  look: LookDoc,
  registro: RegistroGrade,
  perfil: GradePerfil,
  intensidad = 1,
): LookRegistro {
  const base = perfil === 'grano' ? look.grano : registro === 'cuento' ? look.cuento : look.real;
  const t = Math.max(0, Math.min(1, intensidad));
  if (t >= 1) return base;
  // Interpola sat/contrast hacia neutro; multiplica opacidades/viñeta/brightness.
  return {
    sat: 1 + (base.sat - 1) * t,
    contrast: 1 + (base.contrast - 1) * t,
    brightness: base.brightness * t,
    gamma: 1 + (base.gamma - 1) * t,
    paperOpacity: base.paperOpacity * t,
    grainOpacity: base.grainOpacity * t,
    vignette: base.vignette * t,
  };
}

/**
 * Aplica crop (si corresponde) + grade. Salida PNG.
 * Orden: crop → eq/sat → paper overlay → grain → vignette.
 */
export async function applyGrade(opts: ApplyGradeOpts): Promise<{
  crop?: CropWindow;
  outDims: ImageDims;
  aspectoPendiente: boolean;
}> {
  const dims = await probeDims(opts.srcAbs);
  const params = pickParams(opts.look, opts.registro, opts.perfil, opts.intensidad ?? 1);
  // outpaint pendiente solo si el caller lo marca; skipCrop solo (nativo) no marca pendiente.
  const aspectoPendiente = opts.aspectoPendiente ?? false;

  let crop: CropWindow | undefined;
  let outW = dims.width;
  let outH = dims.height;

  const filters: string[] = [];
  let last = '[0:v]';

  if (!opts.skipCrop) {
    crop = computeCrop(dims, opts.cropOffset);
    if (crop.clase !== 'ya-916') {
      filters.push(`${last}crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}[c]`);
      last = '[c]';
      outW = crop.w;
      outH = crop.h;
    } else {
      outW = crop.w;
      outH = crop.h;
    }
  }

  if (params.contrast !== 1 || params.brightness !== 0 || params.gamma !== 1 || params.sat !== 1) {
    filters.push(
      `${last}eq=contrast=${params.contrast}:brightness=${params.brightness}:gamma=${params.gamma}:saturation=${params.sat}[eq]`,
    );
    last = '[eq]';
  }

  const inputs: string[] = ['-i', opts.srcAbs];
  let inputIdx = 1;

  // Opacidad real vía all_opacity (blend NO pondera alfa del input).
  if (params.paperOpacity > 0) {
    const paper = await ensurePaperPlate(opts.lookDir, opts.look.locks.cuento.path, outW, outH);
    inputs.push('-i', paper);
    const pi = inputIdx++;
    filters.push(
      `${last}format=rgb24[basep]`,
      `[${pi}:v]format=rgb24[pap]`,
      `[basep][pap]blend=all_mode=softlight:all_opacity=${params.paperOpacity.toFixed(4)}[p]`,
    );
    last = '[p]';
  }

  // Grano: ruido SOLO en luma (c0), seed fijo → mono, sin placa, sin retícula de overlay.
  // Intensidad escalada ~0–25 (ffmpeg noise strength); opacity 0.04 ≈ strength ~6.
  if (params.grainOpacity > 0) {
    const strength = Math.max(1, Math.round(params.grainOpacity * 120));
    const seed = opts.perfil === 'grano' ? 9001 : 7777;
    filters.push(
      `${last}format=yuv444p,noise=c0s=${strength}:c0f=u:c0_seed=${seed}:c1s=0:c2s=0,format=rgb24[g]`,
    );
    last = '[g]';
  }

  if (params.vignette > 0) {
    filters.push(`${last}vignette=PI/${(1 / params.vignette).toFixed(2)}:mode=backward[v]`);
    last = '[v]';
  }

  filters.push(`${last}format=rgb24[out]`);

  await ensureDirFor(opts.destAbs);
  await runFfmpeg([
    ...inputs,
    '-filter_complex', filters.join(';'),
    '-map', '[out]',
    '-frames:v', '1',
    opts.destAbs,
  ]);

  return {
    crop,
    outDims: { width: outW, height: outH },
    aspectoPendiente,
  };
}

/** Solo copia + crop (locks: sin grade). */
export async function applyCropOnly(opts: {
  srcAbs: string;
  destAbs: string;
  cropOffset?: number;
  skipCrop?: boolean;
  /** true solo para outpaint diferido (no para nativo). */
  aspectoPendiente?: boolean;
}): Promise<{ crop?: CropWindow; outDims: ImageDims; aspectoPendiente: boolean }> {
  const dims = await probeDims(opts.srcAbs);
  const aspectoPendiente = opts.aspectoPendiente ?? false;
  if (opts.skipCrop) {
    await ensureDirFor(opts.destAbs);
    await fs.copyFile(opts.srcAbs, opts.destAbs);
    return { outDims: dims, aspectoPendiente };
  }
  const crop = computeCrop(dims, opts.cropOffset);
  await ensureDirFor(opts.destAbs);
  if (crop.clase === 'ya-916') {
    await fs.copyFile(opts.srcAbs, opts.destAbs);
    return { crop, outDims: dims, aspectoPendiente };
  }
  await runFfmpeg([
    '-i', opts.srcAbs,
    '-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`,
    '-frames:v', '1',
    opts.destAbs,
  ]);
  return {
    crop,
    outDims: { width: crop.w, height: crop.h },
    aspectoPendiente,
  };
}

/** Overlay de ventana 9:16: colores originales, fuera 50% luma, ventana 100% + borde. */
export async function emitPropuestaAspecto(opts: {
  srcAbs: string;
  destAbs: string;
  cropOffset?: number;
  label?: string;
}): Promise<CropWindow> {
  const dims = await probeDims(opts.srcAbs);
  const crop = computeCrop(dims, opts.cropOffset);
  await ensureDirFor(opts.destAbs);

  const labelFilter = opts.label
    ? `,drawtext=text='${opts.label.replace(/:/g, '\\:').replace(/'/g, '')}':x=24:y=24:fontsize=32:fontcolor=yellow:box=1:boxcolor=black@0.7`
    : '';

  // 1) atenuar solo luma (chroma intacto → sin tinte)
  // 2) overlay de la ventana original al 100%
  // 3) borde amarillo + label
  await runFfmpeg([
    '-i', opts.srcAbs,
    '-filter_complex',
    [
      `[0:v]split=2[base][win]`,
      `[base]lutyuv=y=val*0.5[dim]`,
      `[win]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}[c]`,
      `[dim][c]overlay=${crop.x}:${crop.y},` +
        `drawbox=x=${crop.x}:y=${crop.y}:w=${crop.w}:h=${crop.h}:color=yellow@0.95:t=6` +
        `${labelFilter}[out]`,
    ].join(';'),
    '-map', '[out]',
    '-frames:v', '1',
    opts.destAbs,
  ]);
  return crop;
}

/** Contact sheet: ANTES | DESPUÉS [| LOCK]. */
export async function emitAuditSheet(opts: {
  beforeAbs: string;
  afterAbs: string;
  destAbs: string;
  label?: string;
  lockAbs?: string;
  lockLabel?: string;
}): Promise<void> {
  await ensureDirFor(opts.destAbs);
  const label = opts.label?.replace(/:/g, '\\:').replace(/'/g, '') ?? '';
  const lockLabel = (opts.lockLabel ?? 'LOCK').replace(/:/g, '\\:').replace(/'/g, '');

  const cell = (idx: number, text: string, tag: string) =>
    `[${idx}:v]scale=540:-1:flags=lanczos,pad=540:960:(ow-iw)/2:(oh-ih)/2:black,` +
    `drawtext=text='${text}':x=16:y=16:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.6[${tag}]`;

  if (opts.lockAbs) {
    await runFfmpeg([
      '-i', opts.beforeAbs,
      '-i', opts.afterAbs,
      '-i', opts.lockAbs,
      '-filter_complex',
      [
        cell(0, 'ANTES', 'a'),
        cell(1, `DESPUES${label ? ' ' + label : ''}`, 'b'),
        cell(2, lockLabel, 'c'),
        `[a][b][c]hstack=inputs=3[out]`,
      ].join(';'),
      '-map', '[out]',
      '-frames:v', '1',
      opts.destAbs,
    ]);
    return;
  }

  await runFfmpeg([
    '-i', opts.beforeAbs,
    '-i', opts.afterAbs,
    '-filter_complex',
    [
      cell(0, 'ANTES', 'a'),
      cell(1, `DESPUES${label ? ' ' + label : ''}`, 'b'),
      `[a][b]hstack=inputs=2[out]`,
    ].join(';'),
    '-map', '[out]',
    '-frames:v', '1',
    opts.destAbs,
  ]);
}

/** Crop del titular (zona superior) para verificar legibilidad de a1-m01. */
export async function emitTitularCrop(opts: {
  srcAbs: string;
  destAbs: string;
}): Promise<void> {
  const dims = await probeDims(opts.srcAbs);
  const h = Math.floor(dims.height * 0.35);
  await ensureDirFor(opts.destAbs);
  await runFfmpeg([
    '-i', opts.srcAbs,
    '-vf', `crop=${dims.width}:${h}:0:0`,
    '-frames:v', '1',
    opts.destAbs,
  ]);
}

/** Sheet de par FLF/switch: dos propuestas lado a lado. */
export async function emitParPropuesta(opts: {
  leftAbs: string;
  rightAbs: string;
  destAbs: string;
  leftLabel: string;
  rightLabel: string;
}): Promise<void> {
  await ensureDirFor(opts.destAbs);
  const L = opts.leftLabel.replace(/:/g, '\\:').replace(/'/g, '');
  const R = opts.rightLabel.replace(/:/g, '\\:').replace(/'/g, '');
  await runFfmpeg([
    '-i', opts.leftAbs,
    '-i', opts.rightAbs,
    '-filter_complex',
    [
      `[0:v]scale=540:-1:flags=lanczos,pad=540:960:(ow-iw)/2:(oh-ih)/2:black,` +
        `drawtext=text='${L}':x=16:y=16:fontsize=24:fontcolor=yellow:box=1:boxcolor=black@0.6[a]`,
      `[1:v]scale=540:-1:flags=lanczos,pad=540:960:(ow-iw)/2:(oh-ih)/2:black,` +
        `drawtext=text='${R}':x=16:y=16:fontsize=24:fontcolor=yellow:box=1:boxcolor=black@0.6[b]`,
      `[a][b]hstack=inputs=2[out]`,
    ].join(';'),
    '-map', '[out]',
    '-frames:v', '1',
    opts.destAbs,
  ]);
}
