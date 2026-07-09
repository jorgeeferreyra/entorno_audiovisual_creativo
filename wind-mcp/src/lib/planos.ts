/**
 * Extractor de prompts del Arco 3 desde la fuente de verdad:
 * docs/produccion/arco-3-planos.md (los prompts NO se duplican en código).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { CAMERA_PRESETS, PROJECT_ROOT, type CameraPreset } from '../config.js';

const PLANOS_MD = path.join(PROJECT_ROOT, 'docs', 'produccion', 'arco-3-planos.md');
const BIBLIA_MD = path.join(PROJECT_ROOT, 'docs', 'produccion', 'biblia-visual.md');

/** Madres que rompen la estética silueta A PROPÓSITO (no llevan STYLE-BLOCK). */
const MADRES_SIN_STYLE_BLOCK = new Set(['a3-m12', 'a3-m13', 'a3-m14', 'a3-m15']);

export interface MadrePlano {
  id: string;
  titulo: string;
  /** Relativo a PROJECT_ROOT, ej. assets/arco-3/madre/a3-m01-madre-ornitorrinco.png */
  archivoDestino: string;
  /** Derivado del archivo destino, ej. madre-ornitorrinco */
  slug: string;
  prompt: string;
}

export interface ClipPlano {
  id: string;
  titulo: string;
  herramienta: 'U2V' | 'U2V-FLF' | 'ninguna';
  /** Relativo a PROJECT_ROOT (imagen madre). */
  firstFrame?: string;
  lastFrame?: string;
  cameraPreset?: CameraPreset;
  duration?: number;
  motionPrompt?: string;
}

export interface PlanosArco3 {
  madres: MadrePlano[];
  clips: ClipPlano[];
}

function primerFence(bloque: string): string | undefined {
  const m = bloque.match(/```\n([\s\S]*?)\n```/);
  return m ? m[1].trim() : undefined;
}

function parseMadres(md: string): MadrePlano[] {
  const madres: MadrePlano[] = [];
  const re = /^\*\*(a3-m\d{2}) — (.+?)\*\*.*\n([\s\S]*?)(?=^\*\*|^#{2,3} |^---$)/gm;
  for (const m of md.matchAll(re)) {
    const [, id, titulo, bloque] = m;
    const destino = bloque.match(/Archivo destino: `([^`]+)`/)?.[1];
    const prompt = primerFence(bloque);
    if (!destino || !prompt) continue;
    const slug = path.basename(destino, path.extname(destino)).replace(`${id}-`, '');
    madres.push({ id, titulo, archivoDestino: destino, slug, prompt });
  }
  return madres;
}

function parseClips(md: string): ClipPlano[] {
  const clips: ClipPlano[] = [];
  const re = /^\*\*Clip (a3-[a-z]\d+[a-z]?) — (.+?)\*\*\n([\s\S]*?)(?=^\*\*|^#{2,3} |^---$)/gm;
  for (const m of md.matchAll(re)) {
    const [, id, titulo, bloque] = m;
    const herr = bloque.match(/- Herramienta: (U2V-FLF|U2V|ninguna)/)?.[1] as
      | ClipPlano['herramienta']
      | undefined;
    if (!herr) continue;

    const frame = (campo: string): string | undefined =>
      bloque.match(new RegExp(`- ${campo}: a3-m\\d{2} \\(\`([^\`]+)\`\\)`))?.[1];

    const presetRaw = bloque.match(/- cameraPreset: `([^`]+)`/)?.[1];
    const cameraPreset = CAMERA_PRESETS.includes(presetRaw as CameraPreset)
      ? (presetRaw as CameraPreset)
      : undefined;

    const durRaw = bloque.match(/- duration: (\d+)/)?.[1];
    const motion = bloque.match(/- Motion prompt \(EN\):\n```\n([\s\S]*?)\n```/)?.[1]?.trim();

    clips.push({
      id,
      titulo,
      herramienta: herr,
      firstFrame: frame('firstFrame'),
      lastFrame: frame('lastFrame'),
      cameraPreset,
      duration: durRaw ? Number(durRaw) : undefined,
      motionPrompt: motion,
    });
  }
  return clips;
}

export async function leerPlanosArco3(): Promise<PlanosArco3> {
  const md = await fs.readFile(PLANOS_MD, 'utf8');
  return { madres: parseMadres(md), clips: parseClips(md) };
}

export async function getMadre(id: string): Promise<MadrePlano> {
  const { madres } = await leerPlanosArco3();
  const madre = madres.find((m) => m.id === id);
  if (!madre) throw new Error(`Madre ${id} no encontrada en ${PLANOS_MD}`);
  return madre;
}

export async function getClip(id: string): Promise<ClipPlano> {
  const { clips } = await leerPlanosArco3();
  const clip = clips.find((c) => c.id === id);
  if (!clip) throw new Error(`Clip ${id} no encontrado en ${PLANOS_MD}`);
  return clip;
}

/** STYLE-BLOCK canónico desde biblia-visual.md (única definición). */
export async function leerStyleBlock(): Promise<string> {
  const md = await fs.readFile(BIBLIA_MD, 'utf8');
  const seccion = md.match(/### STYLE-BLOCK[\s\S]*?```\n([\s\S]*?)\n```/);
  if (!seccion) throw new Error(`STYLE-BLOCK no encontrado en ${BIBLIA_MD}`);
  return seccion[1].trim();
}

/**
 * Validación blanda: toda madre debe embeber el STYLE-BLOCK literal,
 * salvo las que rompen la estética a propósito (m12–m15).
 */
export async function validarStyleBlock(madres: MadrePlano[]): Promise<string[]> {
  const styleBlock = await leerStyleBlock();
  return madres
    .filter((m) => !MADRES_SIN_STYLE_BLOCK.has(m.id) && !m.prompt.includes(styleBlock))
    .map((m) => `${m.id}: el prompt no contiene el STYLE-BLOCK literal de biblia-visual.md`);
}
