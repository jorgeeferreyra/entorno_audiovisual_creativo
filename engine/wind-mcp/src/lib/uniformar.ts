/**
 * Gate de uniformidad de universo.
 *
 * Capa 1 (default): grade + crop 9:16 determinístico (ffmpeg), sin modelos.
 * Capa 2 (--capa 2): re-pase generativo vía Nano Banana (legado / Fase 2).
 *
 * Escribe en reels/<reel>/_madres-uniformes/ sin tocar canónicos.
 * Fuente de verdad del mapa: reels/<reel>/mapa-uniformidad.md (front-matter).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { WORK_DIR, resolveReadPath, resolveWritePath } from '../config.js';
import { parseCutlist } from './animatic.js';
import {
  applyCropOnly,
  applyGrade,
  auditDir,
  computeCrop,
  deriveLook,
  emitAuditSheet,
  emitParPropuesta,
  emitPropuestaAspecto,
  emitTitularCrop,
  probeDims,
  type GradePerfil,
} from './grade.js';
import { generarImagen } from './image.js';
import { escribirSidecar } from './motor.js';
import {
  leerPlanos,
  leerStyleBlock,
  resolveAssetRef,
  type AssetSpec,
  type ImageSpec,
} from './specs.js';

const STYLE_BLOCK_FALLBACK =
  'Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16';

const REALITY_GUARD =
  'photorealistic documentary realism, no illustration, no silhouette, no paper texture, vertical 9:16';

/** Pares FLF / switch a mostrar juntos en propuestas de aspecto. */
const PARES_ASPECTO: [string, string][] = [
  ['a3-m05', 'a3-m06'],
  ['a3-m09', 'a3-m17'],
  ['a3-m10', 'a3-m11'],
  ['a2-m07', 'a2-m08'],
];

export type Registro = 'cuento' | 'real';

export interface MadreMapa {
  id: string;
  lock?: Registro;
  tinte?: string;
  preserva?: string;
  /** Override de path cuando el dest de la ficha no está en disco o es literal. */
  fuente?: string;
  esLock?: boolean;
  exento?: boolean;
  /** Cutlist la alcanza pero se genera después (variations/keyframes). */
  diferido?: boolean;
  motivo?: string;
  /** Perfil de grade: full (default) | grano (solo grano/luz, sin papel). */
  grade?: GradePerfil;
  /**
   * Offset de crop horizontal: fracción −1..1 (relativo al margen) o px si |n|≥1.
   * Default: centro.
   */
  crop?: number;
  /**
   * outpaint = diferir extensión 9:16 a capa generativa (grade sin crop; aspectoPendiente).
   * nativo = conservar dims originales (sin crop ni marca de outpaint) — p.ej. lock a3-m14.
   */
  aspecto?: 'outpaint' | 'nativo';
  /** 0..1 — escala el look hacia neutro (default 1 sobre el look ya suave). */
  intensidad?: number;
  /**
   * Override absoluto de opacidad de papel (0..1).
   * Default: valor del look del registro. Útil cuando el tinte del beat lava la textura.
   */
  paper?: number;
}

export interface MapaUniformidad {
  reel: string;
  estado?: string;
  locks: { cuento: string; real: string };
  madres: MadreMapa[];
}

export interface UniformarOpts {
  reel: string;
  /** Re-pasar solo este id (mapa). */
  id?: string;
  force?: boolean;
  /** Promover _madres-uniformes/ → canónicos (archiva originales en _prev/). */
  promover?: boolean;
  /** 1 = determinístico (default); 2 = generativo (Nano Banana). */
  capa?: 1 | 2;
  /** Regenerar _look/ aunque exista. */
  relook?: boolean;
  /** Solo emitir propuestas de reencuadre en _audit/aspecto/; no escribe uniformes. */
  propuestas?: boolean;
}

export interface UniformarResultado {
  copiados: string[];
  generados: string[];
  skipped: string[];
  exentos: string[];
  diferidos: string[];
  omitidos: { id: string; motivo: string }[];
  propuestas?: string[];
  promovidos?: string[];
}

async function existe(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Mueve un archivo existente a `_prev/` junto a su carpeta (nunca pisa ni borra). */
export async function archiveIfExists(absPath: string): Promise<string | undefined> {
  if (!(await existe(absPath))) return undefined;
  const prevDir = path.join(path.dirname(absPath), '_prev');
  await fs.mkdir(prevDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const name = path.basename(absPath);
  let archivedName: string;
  if (name.endsWith('.png.json')) {
    archivedName = `${name.slice(0, -9)}-${stamp}.png.json`;
  } else if (name.endsWith('.png')) {
    archivedName = `${name.slice(0, -4)}-${stamp}.png`;
  } else if (name.endsWith('.json')) {
    archivedName = `${name.slice(0, -5)}-${stamp}.json`;
  } else {
    archivedName = `${name}-${stamp}`;
  }
  const archivedPath = path.join(prevDir, archivedName);
  await fs.rename(absPath, archivedPath);
  return archivedPath;
}

export function uniformesDir(reel: string): string {
  return path.join('reels', reel, '_madres-uniformes');
}

export function uniformesAbs(reel: string): string {
  return resolveWritePath(uniformesDir(reel));
}

/** Path preferido si existe la uniforme; si no, el canónico. */
export async function resolvePreferUniforme(reel: string, canonicalAbs: string): Promise<string> {
  const uniforme = path.join(uniformesAbs(reel), path.basename(canonicalAbs));
  if (await existe(uniforme)) return uniforme;
  return canonicalAbs;
}

export async function parseMapaUniformidad(reel: string): Promise<MapaUniformidad> {
  const mdPath = path.join(WORK_DIR, 'reels', reel, 'mapa-uniformidad.md');
  const md = await fs.readFile(mdPath, 'utf8');
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`${reel}: mapa-uniformidad.md sin front-matter YAML`);
  const data = YAML.parse(fm[1]) as {
    reel?: string;
    estado?: string;
    locks?: { cuento?: string; real?: string };
    madres?: MadreMapa[];
  };
  if (!data.locks?.cuento || !data.locks?.real) {
    throw new Error(`${reel}: mapa sin locks.cuento / locks.real`);
  }
  if (!Array.isArray(data.madres) || !data.madres.length) {
    throw new Error(`${reel}: mapa sin lista madres`);
  }
  return {
    reel: data.reel ?? reel,
    estado: data.estado,
    locks: { cuento: data.locks.cuento, real: data.locks.real },
    madres: data.madres,
  };
}

function arcoDeId(id: string): number | null {
  const m = id.match(/^a(\d+)-/);
  return m ? Number(m[1]) : null;
}

function fuenteDeClip(spec: AssetSpec): string[] {
  if (spec.kind === 'video-flf') return [spec.firstFrame, spec.lastFrame];
  if (spec.kind === 'video-i2v') return [spec.firstFrame];
  if (spec.kind === 'montaje' && spec.fuente) return [spec.fuente];
  return [];
}

/** Path literal tipo `…/a2-m04-lugar-blanco-c3.png` → id de mapa `a2-m04-c3`. */
function idDesdePathLiteral(ref: string): string | null {
  const base = path.basename(ref).replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const cMatch = base.match(/^(a\d+-m\d+[a-z]?)-.+-(c\d+)$/i);
  if (cMatch) return `${cMatch[1]}-${cMatch[2]}`;
  const mMatch = base.match(/^(a\d+-m\d+[a-z0-9]*?)(?:-|$)/i);
  return mMatch?.[1] ?? null;
}

/**
 * Madres alcanzadas por la cutlist (ids de imagen). Omite material de origen
 * que no es madre (ej. foto real de locación).
 */
export async function madresDeCutlist(reel: string): Promise<Set<string>> {
  const items = await parseCutlist(reel);
  const specsCache = new Map<number, AssetSpec[] | null>();
  const keys = new Set<string>();

  for (const item of items) {
    const arco = arcoDeId(item.clip);
    if (arco == null) continue;
    if (!specsCache.has(arco)) {
      try {
        specsCache.set(arco, await leerPlanos(arco));
      } catch {
        specsCache.set(arco, null);
      }
    }
    const specs = specsCache.get(arco);
    if (!specs) continue;
    const spec = specs.find((s) => s.id === item.clip);
    if (!spec || spec.kind === 'image') continue;

    for (const ref of fuenteDeClip(spec)) {
      if (/^a\d+-m/.test(ref) && !ref.includes('/') && !ref.includes('.')) {
        keys.add(ref);
        continue;
      }
      // Path literal: solo si parece madre (aN-m…), no foto real.
      const id = idDesdePathLiteral(ref);
      if (id && /^a\d+-m/.test(id)) keys.add(id);
    }
  }
  return keys;
}

function buildPrompt(entrada: MadreMapa, registro: Registro, styleBlock: string): string {
  const tinte = entrada.tinte ?? '';
  const preserva = entrada.preserva ?? 'preserve composition, framing and subject with near-100% fidelity';

  if (registro === 'cuento') {
    return [
      'The first reference is the universe lock — adopt exactly its palette, aged-paper texture, line weight and filigree density.',
      'The second reference is the approved madre — preserve its composition, framing and subject with near-100% fidelity.',
      preserva + '.',
      `Apply the beat tint (do NOT correct it toward the lock): ${tinte}.`,
      styleBlock,
    ].join(' ');
  }

  return [
    'The first reference is the universe lock — adopt exactly its film grain, documentary color science and light treatment.',
    'The second reference is the approved madre — preserve its composition, framing and subject with near-100% fidelity.',
    preserva + '.',
    tinte
      ? `Apply the beat light/tint (do NOT correct it toward the lock palette): ${tinte}.`
      : 'Do NOT impose the lock palette onto this frame.',
    REALITY_GUARD,
  ].join(' ');
}

async function resolveMadreSrc(
  entrada: MadreMapa,
  specsByArco: Map<number, AssetSpec[]>,
): Promise<{ abs: string; destRel: string; basename: string; arco: number }> {
  const arco = arcoDeId(entrada.id);
  if (arco == null && !entrada.fuente) {
    throw new Error(`${entrada.id}: id sin prefijo de arco y sin fuente`);
  }
  const arcoN = arco ?? 0;

  if (entrada.fuente) {
    const abs = resolveReadPath(entrada.fuente);
    if (!(await existe(abs))) {
      throw new Error(`${entrada.id}: fuente no existe (${entrada.fuente})`);
    }
    return {
      abs,
      destRel: entrada.fuente,
      basename: path.basename(entrada.fuente),
      arco: arcoN,
    };
  }

  const specs = specsByArco.get(arcoN);
  if (!specs) throw new Error(`${entrada.id}: planos/arco-${arcoN}.md no cargado`);
  const img = specs.find((s): s is ImageSpec => s.kind === 'image' && s.id === entrada.id);
  if (!img) throw new Error(`${entrada.id}: no es una imagen en planos/arco-${arcoN}.md`);
  const abs = resolveReadPath(img.dest);
  if (!(await existe(abs))) {
    throw new Error(`${entrada.id}: canónico aún no existe (${img.dest})`);
  }
  return { abs, destRel: img.dest, basename: path.basename(img.dest), arco: arcoN };
}

async function resolveLockPath(
  lockId: string,
  specsByArco: Map<number, AssetSpec[]>,
): Promise<string> {
  const arco = arcoDeId(lockId);
  if (arco == null) throw new Error(`lock ${lockId}: id inválido`);
  let specs = specsByArco.get(arco);
  if (!specs) {
    specs = await leerPlanos(arco);
    specsByArco.set(arco, specs);
  }
  const rel = resolveAssetRef(lockId, arco, specs);
  const abs = resolveReadPath(rel);
  if (!(await existe(abs))) throw new Error(`lock ${lockId}: no existe en disco (${rel})`);
  return abs;
}

function slugFromBasename(id: string, basename: string): string {
  const noExt = basename.replace(/\.png$/i, '');
  if (noExt.startsWith(`${id}-`)) return noExt.slice(id.length + 1);
  return noExt;
}

/**
 * Corre el gate: capa 1 (grade+crop) por defecto, o capa 2 (Nano Banana).
 * Con `promover: true`, copia uniformes → canónicos archivando originales.
 * Con `propuestas: true`, solo emite overlays de reencuadre en `_audit/aspecto/`.
 */
export async function uniformar(opts: UniformarOpts): Promise<UniformarResultado> {
  const capa = opts.capa ?? 1;
  const mapa = await parseMapaUniformidad(opts.reel);
  const cutlistKeys = await madresDeCutlist(opts.reel);
  const mapaIds = new Set(mapa.madres.map((m) => m.id));
  const faltan = [...cutlistKeys].filter((k) => !mapaIds.has(k));
  if (faltan.length) {
    throw new Error(
      `Mapa incompleto: la cutlist alcanza madres sin fila en mapa-uniformidad.md: ${faltan.join(', ')}`,
    );
  }

  const specsByArco = new Map<number, AssetSpec[]>();
  for (const arco of [1, 2, 3]) {
    try {
      specsByArco.set(arco, await leerPlanos(arco));
    } catch {
      /* arco sin planos */
    }
  }

  const lockPaths: Record<Registro, string> = {
    cuento: await resolveLockPath(mapa.locks.cuento, specsByArco),
    real: await resolveLockPath(mapa.locks.real, specsByArco),
  };

  const outDir = uniformesAbs(opts.reel);
  await fs.mkdir(outDir, { recursive: true });

  const result: UniformarResultado = {
    copiados: [],
    generados: [],
    skipped: [],
    exentos: [],
    diferidos: [],
    omitidos: [],
  };

  const entradas = opts.id
    ? mapa.madres.filter((m) => m.id === opts.id)
    : mapa.madres;
  if (opts.id && !entradas.length) {
    throw new Error(`--id ${opts.id} no está en el mapa de ${opts.reel}`);
  }

  if (opts.promover) {
    return promoverUniformes({ mapa, entradas, specsByArco, outDir, result });
  }

  if (opts.propuestas) {
    return emitirPropuestas({
      reel: opts.reel,
      entradas,
      specsByArco,
      result,
    });
  }

  if (capa === 1) {
    return uniformarCapa1({
      reel: opts.reel,
      mapa,
      entradas,
      specsByArco,
      lockPaths,
      outDir,
      force: !!opts.force,
      relook: !!opts.relook,
      result,
    });
  }

  return uniformarCapa2({
    reel: opts.reel,
    mapa,
    entradas,
    specsByArco,
    lockPaths,
    outDir,
    force: !!opts.force,
    result,
  });
}

async function promoverUniformes(ctx: {
  mapa: MapaUniformidad;
  entradas: MadreMapa[];
  specsByArco: Map<number, AssetSpec[]>;
  outDir: string;
  result: UniformarResultado;
}): Promise<UniformarResultado> {
  const { entradas, specsByArco, outDir, result } = ctx;
  result.promovidos = [];
  for (const entrada of entradas) {
    if (entrada.exento || entrada.diferido) {
      if (entrada.exento) result.exentos.push(entrada.id);
      if (entrada.diferido) result.diferidos.push(entrada.id);
      continue;
    }
    let srcInfo: Awaited<ReturnType<typeof resolveMadreSrc>>;
    try {
      srcInfo = await resolveMadreSrc(entrada, specsByArco);
    } catch (e) {
      result.omitidos.push({
        id: entrada.id,
        motivo: e instanceof Error ? e.message : String(e),
      });
      continue;
    }
    const uniformeAbs = path.join(outDir, srcInfo.basename);
    if (!(await existe(uniformeAbs))) {
      result.omitidos.push({ id: entrada.id, motivo: `uniforme aún no generada (${srcInfo.basename})` });
      continue;
    }
    let destCanónico: string;
    if (entrada.fuente && entrada.id.endsWith('-c3')) {
      destCanónico = resolveWritePath(entrada.fuente);
    } else if (entrada.fuente && entrada.id === 'a2-m07') {
      const specs = specsByArco.get(2);
      const img = specs?.find((s): s is ImageSpec => s.kind === 'image' && s.id === 'a2-m07');
      destCanónico = img ? resolveWritePath(img.dest) : resolveWritePath(entrada.fuente);
    } else {
      const specs = specsByArco.get(srcInfo.arco);
      const img = specs?.find((s): s is ImageSpec => s.kind === 'image' && s.id === entrada.id);
      destCanónico = img ? resolveWritePath(img.dest) : resolveWritePath(srcInfo.destRel);
    }
    await fs.mkdir(path.dirname(destCanónico), { recursive: true });
    const archived = await archiveIfExists(destCanónico);
    if (archived) console.log(`  archivado: ${path.relative(WORK_DIR, archived)}`);
    await archiveIfExists(`${destCanónico}.json`);
    await fs.copyFile(uniformeAbs, destCanónico);
    const sideSrc = `${uniformeAbs}.json`;
    if (await existe(sideSrc)) {
      await fs.copyFile(sideSrc, `${destCanónico}.json`);
    }
    result.promovidos.push(entrada.id);
    console.log(`  promovido: ${entrada.id} → ${path.relative(WORK_DIR, destCanónico)}`);
  }
  return result;
}

async function emitirPropuestas(ctx: {
  reel: string;
  entradas: MadreMapa[];
  specsByArco: Map<number, AssetSpec[]>;
  result: UniformarResultado;
}): Promise<UniformarResultado> {
  const { reel, entradas, specsByArco, result } = ctx;
  result.propuestas = [];
  const aspectoDir = path.join(auditDir(reel), 'aspecto');
  await fs.mkdir(aspectoDir, { recursive: true });
  const propuestaById = new Map<string, string>();

  for (const entrada of entradas) {
    if (entrada.exento || entrada.diferido) {
      if (entrada.exento) result.exentos.push(entrada.id);
      if (entrada.diferido) result.diferidos.push(entrada.id);
      continue;
    }
    if (!entrada.lock) {
      result.omitidos.push({ id: entrada.id, motivo: 'sin lock ni exento/diferido' });
      continue;
    }
    if (entrada.aspecto === 'outpaint') {
      result.omitidos.push({
        id: entrada.id,
        motivo: 'aspecto: outpaint — diferida a capa generativa (sin propuesta de crop)',
      });
      continue;
    }
    // nativo: igual se emite propuesta para que dirección vea qué se pierde al croppear
    // (útil para decidir nativo vs crop, p.ej. a3-m14).

    let srcInfo: Awaited<ReturnType<typeof resolveMadreSrc>>;
    try {
      srcInfo = await resolveMadreSrc(entrada, specsByArco);
    } catch (e) {
      result.omitidos.push({
        id: entrada.id,
        motivo: e instanceof Error ? e.message : String(e),
      });
      continue;
    }

    const dims = await probeDims(srcInfo.abs);
    const crop = computeCrop(dims, entrada.crop);
    const destAbs = path.join(aspectoDir, `${entrada.id}-propuesta.png`);
    const label = `${entrada.id} ${dims.width}x${dims.height} → ${crop.w}x${crop.h} (${crop.clase})`;
    await emitPropuestaAspecto({
      srcAbs: srcInfo.abs,
      destAbs,
      cropOffset: entrada.crop,
      label,
    });
    propuestaById.set(entrada.id, destAbs);
    result.propuestas.push(entrada.id);
    console.log(`  propuesta: ${label}`);
  }

  // Sheets de pares FLF/switch.
  for (const [a, b] of PARES_ASPECTO) {
    const left = propuestaById.get(a);
    const right = propuestaById.get(b);
    if (!left || !right) continue;
    const dest = path.join(aspectoDir, `par-${a}-${b}.png`);
    await emitParPropuesta({
      leftAbs: left,
      rightAbs: right,
      destAbs: dest,
      leftLabel: a,
      rightLabel: b,
    });
    console.log(`  par: ${a} + ${b}`);
  }

  console.log(`\nPropuestas en: reels/${reel}/_audit/aspecto/`);
  return result;
}

async function uniformarCapa1(ctx: {
  reel: string;
  mapa: MapaUniformidad;
  entradas: MadreMapa[];
  specsByArco: Map<number, AssetSpec[]>;
  lockPaths: Record<Registro, string>;
  outDir: string;
  force: boolean;
  relook: boolean;
  result: UniformarResultado;
}): Promise<UniformarResultado> {
  const { reel, mapa, entradas, specsByArco, lockPaths, outDir, force, relook, result } = ctx;

  const { look, lookDirAbs } = await deriveLook({
    reel,
    lockCuentoAbs: lockPaths.cuento,
    lockRealAbs: lockPaths.real,
    force: relook,
  });
  console.log(`  look: ${look.hash} (${lookDirAbs})`);

  const auditRoot = auditDir(reel);
  await fs.mkdir(auditRoot, { recursive: true });

  for (const entrada of entradas) {
    if (entrada.exento) {
      result.exentos.push(`${entrada.id}${entrada.motivo ? ` (${entrada.motivo})` : ''}`);
      continue;
    }
    if (entrada.diferido) {
      result.diferidos.push(`${entrada.id}${entrada.motivo ? ` (${entrada.motivo})` : ''}`);
      continue;
    }
    if (!entrada.lock) {
      result.omitidos.push({ id: entrada.id, motivo: 'sin lock ni exento/diferido' });
      continue;
    }

    let srcInfo: Awaited<ReturnType<typeof resolveMadreSrc>>;
    try {
      srcInfo = await resolveMadreSrc(entrada, specsByArco);
    } catch (e) {
      result.omitidos.push({
        id: entrada.id,
        motivo: e instanceof Error ? e.message : String(e),
      });
      continue;
    }

    const destAbs = path.join(outDir, srcInfo.basename);
    if (!force && (await existe(destAbs))) {
      result.skipped.push(entrada.id);
      continue;
    }
    if (force && (await existe(destAbs))) {
      await archiveIfExists(destAbs);
      await archiveIfExists(`${destAbs}.json`);
    }

    const skipCrop = entrada.aspecto === 'outpaint' || entrada.aspecto === 'nativo';
    const aspectoPendiente = entrada.aspecto === 'outpaint';
    const perfil: GradePerfil = entrada.grade ?? 'full';
    const intensidad = entrada.intensidad ?? 1;
    const paperOpacity = entrada.paper;

    // Locks: solo crop (sin grade); el look se deriva del canónico intacto.
    if (entrada.esLock) {
      const note = entrada.aspecto === 'nativo'
        ? ' (nativo)'
        : aspectoPendiente
          ? ' (outpaint pendiente)'
          : '';
      console.log(`  lock aspecto: ${entrada.id}${note}…`);
      const r = await applyCropOnly({
        srcAbs: srcInfo.abs,
        destAbs,
        cropOffset: entrada.crop,
        skipCrop,
        aspectoPendiente,
      });
      await escribirSidecar(destAbs, {
        id: entrada.id,
        kind: 'uniformada',
        capa: 1,
        esLock: true,
        registro: entrada.lock,
        lock: mapa.locks[entrada.lock],
        tinte: entrada.tinte,
        preserva: entrada.preserva,
        grade: perfil,
        aspecto: entrada.aspecto,
        crop: r.crop,
        outDims: r.outDims,
        aspectoPendiente: r.aspectoPendiente,
        lookHash: look.hash,
        refs: [srcInfo.abs],
        provider: 'ffmpeg-crop',
      });
      result.copiados.push(entrada.id);
      continue;
    }

    console.log(
      `  grade: ${entrada.id} (${entrada.lock}/${perfil}` +
        `${skipCrop ? (aspectoPendiente ? ', sin crop/outpaint' : ', nativo') : ''}` +
        `${intensidad !== 1 ? `, int=${intensidad}` : ''}` +
        `${paperOpacity != null ? `, paper=${paperOpacity}` : ''})…`,
    );
    const r = await applyGrade({
      srcAbs: srcInfo.abs,
      destAbs,
      registro: entrada.lock,
      perfil,
      look,
      lookDir: lookDirAbs,
      skipCrop,
      aspectoPendiente,
      cropOffset: entrada.crop,
      intensidad,
      paperOpacity,
    });

    await escribirSidecar(destAbs, {
      id: entrada.id,
      kind: 'uniformada',
      capa: 1,
      registro: entrada.lock,
      lock: mapa.locks[entrada.lock],
      tinte: entrada.tinte,
      preserva: entrada.preserva,
      grade: perfil,
      aspecto: entrada.aspecto,
      intensidad,
      ...(paperOpacity != null ? { paper: paperOpacity } : {}),
      crop: r.crop,
      outDims: r.outDims,
      aspectoPendiente: r.aspectoPendiente,
      lookHash: look.hash,
      refs: [lockPaths[entrada.lock], srcInfo.abs],
      provider: 'ffmpeg-grade',
    });

    // Audit tríptico: ANTES | DESPUÉS | LOCK.
    const sheetAbs = path.join(auditRoot, `${entrada.id}-antes-despues.png`);
    try {
      await emitAuditSheet({
        beforeAbs: srcInfo.abs,
        afterAbs: destAbs,
        destAbs: sheetAbs,
        label: entrada.id,
        lockAbs: lockPaths[entrada.lock],
        lockLabel: `LOCK ${mapa.locks[entrada.lock]}`,
      });
    } catch (e) {
      console.warn(`  audit sheet falló (${entrada.id}):`, e instanceof Error ? e.message : e);
    }

    if (entrada.id === 'a1-m01') {
      try {
        await emitTitularCrop({
          srcAbs: destAbs,
          destAbs: path.join(auditRoot, 'a1-m01-titular.png'),
        });
      } catch (e) {
        console.warn('  titular crop falló:', e instanceof Error ? e.message : e);
      }
    }

    result.generados.push(entrada.id);
  }

  return result;
}

async function uniformarCapa2(ctx: {
  reel: string;
  mapa: MapaUniformidad;
  entradas: MadreMapa[];
  specsByArco: Map<number, AssetSpec[]>;
  lockPaths: Record<Registro, string>;
  outDir: string;
  force: boolean;
  result: UniformarResultado;
}): Promise<UniformarResultado> {
  const { reel, mapa, entradas, specsByArco, lockPaths, outDir, force, result } = ctx;

  let styleBlock = STYLE_BLOCK_FALLBACK;
  try {
    styleBlock = await leerStyleBlock();
  } catch {
    /* biblia no legible: fallback */
  }

  for (const entrada of entradas) {
    if (entrada.exento) {
      result.exentos.push(`${entrada.id}${entrada.motivo ? ` (${entrada.motivo})` : ''}`);
      continue;
    }
    if (entrada.diferido) {
      result.diferidos.push(`${entrada.id}${entrada.motivo ? ` (${entrada.motivo})` : ''}`);
      continue;
    }
    if (!entrada.lock) {
      result.omitidos.push({ id: entrada.id, motivo: 'sin lock ni exento/diferido' });
      continue;
    }

    let srcInfo: Awaited<ReturnType<typeof resolveMadreSrc>>;
    try {
      srcInfo = await resolveMadreSrc(entrada, specsByArco);
    } catch (e) {
      result.omitidos.push({
        id: entrada.id,
        motivo: e instanceof Error ? e.message : String(e),
      });
      continue;
    }

    const destAbs = path.join(outDir, srcInfo.basename);
    const destRel = path.join(uniformesDir(reel), srcInfo.basename);

    if (!force && (await existe(destAbs))) {
      result.skipped.push(entrada.id);
      continue;
    }
    if (force && (await existe(destAbs))) {
      await archiveIfExists(destAbs);
      await archiveIfExists(`${destAbs}.json`);
    }

    if (entrada.esLock) {
      await fs.copyFile(srcInfo.abs, destAbs);
      await escribirSidecar(destAbs, {
        id: entrada.id,
        kind: 'uniformada',
        capa: 2,
        esLock: true,
        registro: entrada.lock,
        lock: mapa.locks[entrada.lock],
        tinte: entrada.tinte,
        preserva: entrada.preserva,
        refs: [srcInfo.abs],
        provider: 'copy',
        prompt: '(lock — copied as-is)',
      });
      result.copiados.push(entrada.id);
      console.log(`  lock copiado: ${entrada.id}`);
      continue;
    }

    const lockAbs = lockPaths[entrada.lock];
    const prompt = buildPrompt(entrada, entrada.lock, styleBlock);
    const slug = slugFromBasename(entrada.id, srcInfo.basename);

    console.log(`  generando (capa 2): ${entrada.id} (lock ${entrada.lock})…`);
    const img = await generarImagen({
      prompt,
      aspect: '9:16',
      refs: [lockAbs, srcInfo.abs],
      arco: srcInfo.arco,
      id: entrada.id,
      slug,
      destOverride: destRel,
      provider: 'openrouter',
      soloProvider: true,
    });

    await escribirSidecar(img.localPath, {
      id: entrada.id,
      kind: 'uniformada',
      capa: 2,
      registro: entrada.lock,
      lock: mapa.locks[entrada.lock],
      tinte: entrada.tinte,
      preserva: entrada.preserva,
      refs: [lockAbs, srcInfo.abs],
      prompt,
      provider: img.provider,
      estCostCny: img.estCostCny,
      mock: img.mock,
    });
    result.generados.push(entrada.id);
  }

  return result;
}
