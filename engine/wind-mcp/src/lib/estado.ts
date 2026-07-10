import { loadWindComicEnv, windComicBaseUrl, WIND_COMIC_DIR } from '../config.js';

export interface EstadoResult {
  serverUp: boolean;
  baseUrl: string;
  mockEngines: boolean;
  planGateDisabled: boolean;
  keys: Record<string, boolean>;
  readiness?: Record<string, unknown>;
  error?: string;
}

const KEY_VARS = [
  'MINIMAX_API_KEY',
  'MJ_API_KEY',
  'KELING_API_KEY',
  'OPENAI_API_KEY',
  'QINGYUNTOP_API_KEY',
] as const;

export async function getEstado(): Promise<EstadoResult> {
  loadWindComicEnv();
  const baseUrl = windComicBaseUrl();

  const keys: Record<string, boolean> = {};
  for (const k of KEY_VARS) {
    const v = process.env[k];
    keys[k] = !!(v && !v.startsWith('your_'));
  }

  const result: EstadoResult = {
    serverUp: false,
    baseUrl,
    mockEngines: process.env.MOCK_ENGINES === '1',
    planGateDisabled: process.env.PLAN_GATE_DISABLED === '1',
    keys,
  };

  try {
    const res = await fetch(`${baseUrl}/api/runtime/readiness`, {
      signal: AbortSignal.timeout(8_000),
    });
    result.serverUp = res.ok;
    if (res.ok) {
      result.readiness = (await res.json()) as Record<string, unknown>;
      if (typeof result.readiness.mockEngines === 'boolean') {
        result.mockEngines = result.readiness.mockEngines;
      }
    } else {
      result.error = `readiness HTTP ${res.status}`;
    }
  } catch (e) {
    result.error = e instanceof Error ? e.message : String(e);
  }

  return result;
}

export function formatEstado(estado: EstadoResult): string {
  const lines = [
    `wind-comic: ${estado.serverUp ? 'arriba' : 'caído'} (${estado.baseUrl})`,
    `MOCK_ENGINES: ${estado.mockEngines ? '1 (dry-run)' : '0 (real)'}`,
    `PLAN_GATE_DISABLED: ${estado.planGateDisabled ? '1' : '0'}`,
    'Keys:',
    ...Object.entries(estado.keys).map(([k, ok]) => `  ${k}: ${ok ? 'sí' : 'no'}`),
  ];
  if (estado.error) lines.push(`Error: ${estado.error}`);
  if (estado.readiness?.demoMode != null) {
    lines.push(`demoMode: ${String(estado.readiness.demoMode)}`);
  }
  lines.push(`wind-comic dir: ${WIND_COMIC_DIR}`);
  return lines.join('\n');
}
