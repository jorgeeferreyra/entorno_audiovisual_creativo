/**
 * Parser genérico arco-N de fichas de producción.
 *
 * Fuente de verdad: <unidad>/planos/arco-{N}.md. Cada ficha declara sus
 * campos estructurados en un bloque ```yaml``` embebido y su prompt en el primer
 * bloque de código siguiente. El id y el título salen del header **id — título**
 * (no se duplican en el YAML). Los prompts NO se duplican en código.
 *
 * Reemplaza al viejo planos.ts (regexes por campo) por: extraer bloque yaml +
 * fence de prompt, y validar con zod (error ruidoso, nunca silencioso).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';
import { CAMERA_PRESETS, WORK_DIR, SERIE_DIR, type CameraPreset } from '../config.js';

const BIBLIA_MD = path.join(SERIE_DIR, 'biblia-visual.md');

export type Aspect = '16:9' | '9:16' | '1:1' | '2.35:1' | '4:3' | '3:4';

export interface ImageSpec {
  kind: 'image';
  id: string;
  titulo: string;
  /** Derivado del basename de dest (sin `${id}-`). */
  slug: string;
  /** Relativo al episodio (assets/arco-N/...). */
  dest: string;
  prompt: string;
  /** Id de la madre padre (subject_reference). Se resuelve a su dest. */
  ref?: string;
  /** Fotos de anatomía (rutas o ids). OpenRouter las recibe separadas; Minimax las compone. */
  anatomyRefs?: string[];
  /** Provider preferido del registry (ej. openrouter). */
  provider?: string;
  aspect: Aspect;
  /** false = rompe la estética silueta a propósito (no valida STYLE-BLOCK/tinte). */
  styleBlock: boolean;
}

export interface VideoI2VSpec {
  kind: 'video-i2v';
  id: string;
  titulo: string;
  slug: string;
  /** Id de la imagen madre (se resuelve a su dest). */
  firstFrame: string;
  motionPrompt: string;
  cameraPreset?: CameraPreset;
  duration: 5 | 6 | 10 | 15;
  /** Provider preferido del registry (ej. minimax-video, kling, veo). Se pasa como prefer. */
  provider?: string;
}

export interface VideoFlfSpec {
  kind: 'video-flf';
  id: string;
  titulo: string;
  slug: string;
  firstFrame: string;
  lastFrame: string;
  motionPrompt: string;
  cameraPreset?: CameraPreset;
  duration: 5 | 10;
  /** Provider preferido del registry (ej. kling). Se pasa como prefer. */
  provider?: string;
}

export interface MontajeSpec {
  kind: 'montaje';
  id: string;
  titulo: string;
  slug: string;
  /** Id de asset o ruta literal (material de origen). No se genera. */
  fuente?: string;
  /** Duración en segundos para el animatic (montaje libre: no limitado a 5/6/10/15). */
  duration?: number;
}

export type AssetSpec = ImageSpec | VideoI2VSpec | VideoFlfSpec | MontajeSpec;

const aspectSchema = z.enum(['16:9', '9:16', '1:1', '2.35:1', '4:3', '3:4']);
const cameraPresetSchema = z.enum(CAMERA_PRESETS);

const imageYaml = z
  .object({
    kind: z.literal('image'),
    dest: z.string(),
    ref: z.string().optional(),
    anatomyRefs: z.array(z.string()).optional(),
    provider: z.string().optional(),
    aspect: aspectSchema.optional(),
    styleBlock: z.boolean().optional(),
  })
  .strict();

const videoI2VYaml = z
  .object({
    kind: z.literal('video-i2v'),
    firstFrame: z.string(),
    cameraPreset: cameraPresetSchema.optional(),
    duration: z.union([z.literal(5), z.literal(6), z.literal(10), z.literal(15)]).optional(),
    provider: z.string().optional(),
  })
  .strict();

const videoFlfYaml = z
  .object({
    kind: z.literal('video-flf'),
    firstFrame: z.string(),
    lastFrame: z.string(),
    cameraPreset: cameraPresetSchema.optional(),
    duration: z.union([z.literal(5), z.literal(10)]).optional(),
    provider: z.string().optional(),
  })
  .strict();

const montajeYaml = z
  .object({
    kind: z.literal('montaje'),
    fuente: z.string().optional(),
    duration: z.number().optional(),
  })
  .strict();

const yamlSchema = z.discriminatedUnion('kind', [imageYaml, videoI2VYaml, videoFlfYaml, montajeYaml]);

/** Slug de archivo para clips: título sin prefijo "Foo: " → kebab-case ASCII. */
export function tituloToClipSlug(titulo: string): string {
  const core = titulo.includes(':') ? titulo.split(':').slice(1).join(':').trim() : titulo;
  return core
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/^(la|el|los|las)\s+/i, '')
    .replace(/\s+(de|del|en|su|la|el)\s+/gi, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface FichaRaw {
  id: string;
  titulo: string;
  yaml: string;
  prompt?: string;
}

function extraerFichas(md: string, arco: number): FichaRaw[] {
  const fichas: FichaRaw[] = [];
  // Delimitador sintético final: garantiza capturar la última ficha aunque no
  // la siga un `---`/heading (el lookahead exige un borde para cerrar el bloque).
  const texto = `${md}\n---\n`;
  const re = new RegExp(
    `^\\*\\*(?:Clip )?(a${arco}-[a-z0-9]+) — (.+?)\\*\\*.*\\n([\\s\\S]*?)(?=^\\*\\*|^#{2,3} |^---$)`,
    'gm',
  );
  for (const m of texto.matchAll(re)) {
    const [, id, titulo, bloque] = m;
    const yamlMatch = bloque.match(/```yaml\n([\s\S]*?)\n```/);
    if (!yamlMatch) continue; // bloque no es una ficha con spec
    const afterYaml = bloque.slice(bloque.indexOf(yamlMatch[0]) + yamlMatch[0].length);
    const promptMatch = afterYaml.match(/```\n([\s\S]*?)\n```/);
    fichas.push({
      id,
      titulo,
      yaml: yamlMatch[1],
      prompt: promptMatch?.[1]?.trim(),
    });
  }
  return fichas;
}

function construirSpec(ficha: FichaRaw): AssetSpec {
  let parsedYaml: unknown;
  try {
    parsedYaml = YAML.parse(ficha.yaml);
  } catch (e) {
    throw new Error(`${ficha.id}: YAML inválido — ${e instanceof Error ? e.message : e}`);
  }

  const parsed = yamlSchema.safeParse(parsedYaml);
  if (!parsed.success) {
    throw new Error(`${ficha.id}: ficha inválida — ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  const y = parsed.data;
  const base = { id: ficha.id, titulo: ficha.titulo };

  if (y.kind === 'image') {
    if (!ficha.prompt) throw new Error(`${ficha.id}: imagen sin bloque de prompt`);
    const slug = path.basename(y.dest, path.extname(y.dest)).replace(`${ficha.id}-`, '');
    return {
      kind: 'image',
      ...base,
      slug,
      dest: y.dest,
      prompt: ficha.prompt,
      ref: y.ref,
      anatomyRefs: y.anatomyRefs,
      provider: y.provider,
      aspect: y.aspect ?? '9:16',
      styleBlock: y.styleBlock ?? true,
    };
  }

  if (y.kind === 'montaje') {
    return {
      kind: 'montaje',
      ...base,
      slug: tituloToClipSlug(ficha.titulo),
      fuente: y.fuente,
      duration: y.duration,
    };
  }

  // video-i2v | video-flf
  if (!ficha.prompt) throw new Error(`${ficha.id}: clip sin bloque de motion prompt`);
  const slug = tituloToClipSlug(ficha.titulo);
  if (y.kind === 'video-flf') {
    return {
      kind: 'video-flf',
      ...base,
      slug,
      firstFrame: y.firstFrame,
      lastFrame: y.lastFrame,
      motionPrompt: ficha.prompt,
      cameraPreset: y.cameraPreset,
      duration: y.duration ?? 5,
      provider: y.provider,
    };
  }
  return {
    kind: 'video-i2v',
    ...base,
    slug,
    firstFrame: y.firstFrame,
    motionPrompt: ficha.prompt,
    cameraPreset: y.cameraPreset,
    duration: y.duration ?? 5,
    provider: y.provider,
  };
}

/**
 * Resuelve una referencia (ref/firstFrame/lastFrame/fuente) a ruta relativa al
 * proyecto. Si tiene forma de id de asset (`a{arco}-...`), exige que exista
 * una imagen con ese id y devuelve su dest; si no, es una ruta literal.
 */
export function resolveAssetRef(ref: string, arco: number, specs: AssetSpec[]): string {
  if (new RegExp(`^a${arco}-`).test(ref)) {
    const img = specs.find((s): s is ImageSpec => s.kind === 'image' && s.id === ref);
    if (!img) throw new Error(`Referencia ${ref} no corresponde a ninguna imagen del arco ${arco}`);
    return img.dest;
  }
  return ref;
}

/** Valida integridad de referencias entre specs (error ruidoso). */
function validarReferencias(specs: AssetSpec[], arco: number): void {
  const check = (owner: string, ref: string | undefined) => {
    if (ref) resolveAssetRef(ref, arco, specs);
  };
  for (const s of specs) {
    if (s.kind === 'image') check(s.id, s.ref);
    if (s.kind === 'image' && s.anatomyRefs) s.anatomyRefs.forEach((r) => check(s.id, r));
    if (s.kind === 'video-i2v' || s.kind === 'video-flf') check(s.id, s.firstFrame);
    if (s.kind === 'video-flf') check(s.id, s.lastFrame);
    if (s.kind === 'montaje') check(s.id, s.fuente);
  }
}

export async function leerPlanos(arco: number): Promise<AssetSpec[]> {
  const planosMd = path.join(WORK_DIR, 'planos', `arco-${arco}.md`);
  const md = await fs.readFile(planosMd, 'utf8');
  const specs = extraerFichas(md, arco).map(construirSpec);
  validarReferencias(specs, arco);
  return specs;
}

export async function getSpec(arco: number, id: string): Promise<AssetSpec> {
  const specs = await leerPlanos(arco);
  const spec = specs.find((s) => s.id === id);
  if (!spec) throw new Error(`Asset ${id} no encontrado en arco-${arco}-planos.md`);
  return spec;
}

export function esGenerable(spec: AssetSpec): spec is ImageSpec | VideoI2VSpec | VideoFlfSpec {
  return spec.kind !== 'montaje';
}

/** STYLE-BLOCK canónico desde biblia-visual.md (única definición). */
export async function leerStyleBlock(): Promise<string> {
  const md = await fs.readFile(BIBLIA_MD, 'utf8');
  const seccion = md.match(/### STYLE-BLOCK[\s\S]*?```\n([\s\S]*?)\n```/);
  if (!seccion) throw new Error(`STYLE-BLOCK no encontrado en ${BIBLIA_MD}`);
  return seccion[1].trim();
}

/**
 * Validación blanda de coherencia de imágenes (warnings, no bloquea):
 * STYLE-BLOCK literal y línea de tinte, salvo las que rompen la estética
 * a propósito (styleBlock: false).
 */
export async function validarImagenes(specs: AssetSpec[]): Promise<string[]> {
  const styleBlock = await leerStyleBlock();
  const warnings: string[] = [];
  for (const s of specs) {
    if (s.kind !== 'image' || !s.styleBlock) continue;
    if (!s.prompt.includes(styleBlock)) {
      warnings.push(`${s.id}: el prompt no contiene el STYLE-BLOCK literal de biblia-visual.md`);
    }
    if (!/\btint/i.test(s.prompt)) {
      warnings.push(`${s.id}: el prompt no menciona tinte de fondo del guion de color`);
    }
  }
  return warnings;
}

/**
 * Validación blanda de unicidad por escena (madres variations, warnings no bloqueantes):
 * una imagen usada como `firstFrame` de más de un clip generable se ve repetida en
 * pantalla — cada reutilización debería tener su variación (`a{arco}-m{nn}v{k}`,
 * ver pipeline.md §2 paso 3 y biblia-visual.md §3 regla 7).
 *
 * Exenciones automáticas (no suman repetición, no hace falta codificarlas aparte):
 * el keyframe compartido de una cadena FLF aparece como `lastFrame` de un eslabón y
 * `firstFrame` del siguiente (cuenta como firstFrame una sola vez), y los ecos/stills
 * (`kind: montaje`) no usan `firstFrame`.
 */
export function validarUnicidad(specs: AssetSpec[]): string[] {
  const usos = new Map<string, string[]>();
  for (const s of specs) {
    if (s.kind === 'video-i2v' || s.kind === 'video-flf') {
      const clips = usos.get(s.firstFrame) ?? [];
      clips.push(s.id);
      usos.set(s.firstFrame, clips);
    }
  }
  const warnings: string[] = [];
  for (const [frame, clips] of usos) {
    if (clips.length > 1) {
      warnings.push(
        `${frame}: firstFrame reutilizado en ${clips.length} clips (${clips.join(', ')}) — generar una variación (${frame}vN) por reutilización para unicidad en pantalla`,
      );
    }
  }
  return warnings;
}
