/**
 * Motor unificado de generación: un solo `generar(spec)` para imágenes y clips.
 *
 * Sustituye a los esqueletos duplicados de generar-madres-a3.ts / generar-clips-a3.ts:
 * resuelve dependencias (madre padre en disco), resuelve refs según provider,
 * despacha por `kind` a image.ts / video.ts, saltea existentes (salvo force) y
 * escribe un sidecar JSON de procedencia junto al asset.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { PROJECT_ROOT } from '../config.js';
import { compositeRefs } from './composite.js';
import { generarImagen } from './image.js';
import { clipPath, ensureDirFor } from './paths.js';
import {
  resolveAssetRef,
  type AssetSpec,
  type ImageSpec,
  type VideoFlfSpec,
  type VideoI2VSpec,
} from './specs.js';
import { generarVideoFLF, generarVideoI2V } from './video.js';

const MAX_OPENROUTER_REFS = 4;
const DEFAULT_IMAGE_PROVIDER = 'openrouter';

export interface GenerarOpts {
  arco: number;
  /** Todas las specs del arco (para resolver referencias por id y dependencias). */
  specs: AssetSpec[];
  /** Override del provider declarado en la ficha. */
  provider?: string;
  /** Regenerar aunque el canónico exista. */
  force?: boolean;
  /** Destino alternativo (candidatos): relativo a PROJECT_ROOT o absoluto. */
  destOverride?: string;
}

export interface GenerarResult {
  id: string;
  kind: AssetSpec['kind'];
  localPath?: string;
  provider?: string;
  estCostCny?: number;
  duration?: number;
  mock?: boolean;
  skipped?: boolean;
  motivo?: string;
  warning?: string;
}

function abs(p: string): string {
  return path.isAbsolute(p) ? p : path.join(PROJECT_ROOT, p);
}

async function existe(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Resuelve una ref/anatomy a ruta absoluta existente en disco (dependencia). */
async function resolveDependencia(
  owner: string,
  ref: string,
  opts: GenerarOpts,
  etiqueta: string,
): Promise<string> {
  const rel = resolveAssetRef(ref, opts.arco, opts.specs);
  const p = abs(rel);
  if (!(await existe(p))) {
    throw new Error(`${owner}: ${etiqueta} ${ref} aún no existe en disco (${p}). Generalo primero.`);
  }
  return p;
}

/**
 * Refs de imagen según provider:
 * - openrouter: [ref, ...anatomy] separadas (máx 4).
 * - resto (minimax): 1 slot → composite ref + primera anatomy.
 */
async function resolveImageRefs(
  spec: ImageSpec,
  provider: string,
  opts: GenerarOpts,
): Promise<string[] | undefined> {
  if (!spec.ref && !(spec.anatomyRefs?.length)) return undefined;
  if (!spec.ref && spec.anatomyRefs?.length) {
    throw new Error(`${spec.id}: anatomyRefs sin ref — declarar ambos o solo ref`);
  }

  const basePath = await resolveDependencia(spec.id, spec.ref!, opts, 'ref');
  const anatomyPaths: string[] = [];
  for (const r of spec.anatomyRefs ?? []) {
    anatomyPaths.push(await resolveDependencia(spec.id, r, opts, 'anatomyRef'));
  }

  if (provider === 'openrouter') {
    return [basePath, ...anatomyPaths].slice(0, MAX_OPENROUTER_REFS);
  }
  if (anatomyPaths.length) {
    const outPath = abs(
      path.join('assets', `arco-${opts.arco}`, 'madre', '_candidates', '_refs', `${spec.id}-ref.png`),
    );
    await compositeRefs(basePath, anatomyPaths[0], outPath);
    return [outPath];
  }
  return [basePath];
}

async function escribirSidecar(destAbs: string, data: Record<string, unknown>): Promise<void> {
  const sidecar = `${destAbs}.json`;
  await fs.writeFile(sidecar, JSON.stringify({ ...data, generatedAt: new Date().toISOString() }, null, 2));
}

async function generarImage(spec: ImageSpec, opts: GenerarOpts): Promise<GenerarResult> {
  const provider = opts.provider ?? spec.provider ?? DEFAULT_IMAGE_PROVIDER;
  const destRel = opts.destOverride ?? spec.dest;
  const destAbs = abs(destRel);

  if (!opts.force && !opts.destOverride && (await existe(destAbs))) {
    return { id: spec.id, kind: spec.kind, skipped: true, motivo: `ya existe ${destRel}` };
  }

  const refs = await resolveImageRefs(spec, provider, opts);
  const img = await generarImagen({
    prompt: spec.prompt,
    arco: opts.arco,
    id: spec.id,
    slug: spec.slug,
    aspect: spec.aspect,
    refs,
    destOverride: destRel,
    provider,
    soloProvider: provider === 'openrouter',
  });

  await escribirSidecar(img.localPath, {
    id: spec.id,
    kind: spec.kind,
    prompt: spec.prompt,
    provider: img.provider,
    refs,
    aspect: spec.aspect,
    estCostCny: img.estCostCny,
    mock: img.mock,
  });

  return {
    id: spec.id,
    kind: spec.kind,
    localPath: img.localPath,
    provider: img.provider,
    estCostCny: img.estCostCny,
    mock: img.mock,
  };
}

async function generarVideo(
  spec: VideoI2VSpec | VideoFlfSpec,
  opts: GenerarOpts,
): Promise<GenerarResult> {
  const destAbs = clipPath(opts.arco, spec.id, spec.slug);
  if (!opts.force && (await existe(destAbs))) {
    return { id: spec.id, kind: spec.kind, skipped: true, motivo: `ya existe ${path.relative(PROJECT_ROOT, destAbs)}` };
  }

  const firstFrame = await resolveDependencia(spec.id, spec.firstFrame, opts, 'firstFrame');

  const out =
    spec.kind === 'video-flf'
      ? await generarVideoFLF({
          firstFrame,
          lastFrame: await resolveDependencia(spec.id, spec.lastFrame, opts, 'lastFrame'),
          motionPrompt: spec.motionPrompt,
          arco: opts.arco,
          id: spec.id,
          slug: spec.slug,
          duration: spec.duration,
          cameraPreset: spec.cameraPreset,
        })
      : await generarVideoI2V({
          imagen: firstFrame,
          motionPrompt: spec.motionPrompt,
          arco: opts.arco,
          id: spec.id,
          slug: spec.slug,
          duration: spec.duration,
          cameraPreset: spec.cameraPreset,
        });

  await escribirSidecar(out.localPath, {
    id: spec.id,
    kind: spec.kind,
    motionPrompt: spec.motionPrompt,
    provider: out.provider,
    firstFrame: spec.firstFrame,
    lastFrame: spec.kind === 'video-flf' ? spec.lastFrame : undefined,
    cameraPreset: spec.cameraPreset,
    duration: out.duration,
    mock: out.mock,
    warning: out.warning,
  });

  return {
    id: spec.id,
    kind: spec.kind,
    localPath: out.localPath,
    provider: out.provider,
    duration: out.duration,
    mock: out.mock,
    warning: out.warning,
  };
}

export async function generar(spec: AssetSpec, opts: GenerarOpts): Promise<GenerarResult> {
  if (spec.kind === 'montaje') {
    return { id: spec.id, kind: spec.kind, skipped: true, motivo: 'solo montaje, no se genera' };
  }
  if (spec.kind === 'image') return generarImage(spec, opts);
  return generarVideo(spec, opts);
}
