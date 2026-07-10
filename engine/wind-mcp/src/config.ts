import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Raíz del framework/estudio (engine/wind-mcp/src → ../../..). */
export const FRAMEWORK_ROOT = path.resolve(__dirname, '../../..');

export const WIND_COMIC_DIR = path.join(FRAMEWORK_ROOT, 'engine', 'wind-comic');

/**
 * Episodio activo, en la forma "serie/episodio". Se elige (en este orden):
 *   1. flag `--project <serie>/<episodio>` (CLI de generación),
 *   2. env `WIND_PROJECT`,
 *   3. default `charles-jones/episodio-1`.
 */
function activeProject(): string {
  const i = process.argv.indexOf('--project');
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return process.env.WIND_PROJECT || 'charles-jones/episodio-1';
}

/** Carpeta del episodio activo: contiene `planos/` y `assets/` (generados). */
export const EPISODE_DIR = path.join(FRAMEWORK_ROOT, 'proyectos', activeProject());
/** Carpeta de la serie (padre del episodio): biblia-visual.md, assets/fuentes/. */
export const SERIE_DIR = path.dirname(EPISODE_DIR);
/** Assets generados del episodio (madre, clips, reels). */
export const ASSETS_ROOT = path.join(EPISODE_DIR, 'assets');

/**
 * Compat con el motor histórico (raíz única de resolución). Las escrituras van
 * siempre al episodio, así que apunta al episodio. Para lecturas que pueden vivir
 * a nivel serie (assets/fuentes/), usar `resolveReadPath`.
 */
export const PROJECT_ROOT = EPISODE_DIR;

/**
 * Resuelve una ruta de LECTURA. Absoluta → tal cual. Relativa → episodio primero
 * (assets/arco-N/…), y si no existe, serie (assets/fuentes/… compartidas entre
 * episodios). Fuente única de la resolución serie/episodio.
 */
export function resolveReadPath(p: string): string {
  if (path.isAbsolute(p)) return p;
  const episodePath = path.join(EPISODE_DIR, p);
  if (fs.existsSync(episodePath)) return episodePath;
  return path.join(SERIE_DIR, p);
}

/** Resuelve una ruta de ESCRITURA: siempre relativa al episodio. */
export function resolveWritePath(p: string): string {
  return path.isAbsolute(p) ? p : path.join(EPISODE_DIR, p);
}

let envLoaded = false;

/** Carga .env.local de wind-comic antes de importar sus libs. */
export function loadWindComicEnv(): void {
  if (envLoaded) return;
  dotenv.config({ path: path.join(WIND_COMIC_DIR, '.env.local') });
  dotenv.config({ path: path.join(WIND_COMIC_DIR, '.env') });
  envLoaded = true;
}

export function windComicBaseUrl(): string {
  return (
    process.env.WIND_COMIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'http://localhost:3000'
  ).replace(/\/+$/, '');
}

export function isMockEngines(): boolean {
  loadWindComicEnv();
  return process.env.MOCK_ENGINES === '1';
}

export const CAMERA_PRESETS = [
  'push-in',
  'pull-out',
  'orbit',
  'dolly-zoom',
  'whip-pan',
  'crash-zoom',
  'handheld',
  'locked-tripod',
  'crane-up',
  'tilt-down',
  'tracking',
  'arc',
] as const;

export type CameraPreset = (typeof CAMERA_PRESETS)[number];
