/**
 * v12.104 — Vidu Q3 provider(经 qingyuntop):注册/capability/开关。
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';

const SAVED = ['QYT_VIDU_DISABLE', 'QINGYUNTOP_API_KEY', 'QINGYUNTOP_BASE_URL'] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => { for (const k of SAVED) saved[k] = process.env[k]; });
afterEach(() => {
  for (const k of SAVED) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe('v12.104 · qyt-vidu provider', () => {
  it('注册成功:priority 75(kling 后 minimax 前),I2V+T2V', async () => {
    await import('@/lib/video-providers/builtins');
    const { listVideoProviders } = await import('@/lib/video-providers/registry');
    const p = listVideoProviders().find((x) => x.id === 'qyt-vidu')!;
    expect(p).toBeTruthy();
    expect(p.priority).toBe(75);
    expect(p.supportsImage2Video).toBe(true);
    expect(p.supportsText2Video).toBe(true);
  });

  it('QYT_VIDU_DISABLE=1 → available false(开关硬生效,与 key 无关)', async () => {
    const { hasQytVidu } = await import('@/services/qyt-vidu.service');
    process.env.QYT_VIDU_DISABLE = '1';
    expect(hasQytVidu()).toBe(false); // 有无 key 都必须 false
  });

  it('QINGYUNTOP_API_KEY 存在 → available true(不依赖 OPENAI_BASE_URL)', async () => {
    const { hasQytVidu } = await import('@/services/qyt-vidu.service');
    process.env.QINGYUNTOP_API_KEY = 'sk-test';
    expect(hasQytVidu()).toBe(true);
  });

  it('无 QINGYUNTOP key 且 OPENAI_BASE_URL=OpenAI 官方 → available false(官方不转发 /ent/v2)', async () => {
    const { hasQytVidu } = await import('@/services/qyt-vidu.service');
    delete process.env.QINGYUNTOP_API_KEY;
    // API_CONFIG.openai.baseURL 在测试环境默认 https://api.openai.com/v1
    expect(hasQytVidu()).toBe(false);
  });
});
