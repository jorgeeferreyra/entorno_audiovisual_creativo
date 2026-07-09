import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Raíz del monorepo (hermano de wind-comic/ y wind-mcp/). */
export const PROJECT_ROOT = path.resolve(__dirname, '../..');

export const WIND_COMIC_DIR = path.join(PROJECT_ROOT, 'wind-comic');
export const ASSETS_ROOT = path.join(PROJECT_ROOT, 'assets');

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
