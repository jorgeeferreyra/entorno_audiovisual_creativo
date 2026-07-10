/**
 * v12.96 — OpenRouter 图像档:请求构造 + 无 key 短路 + multimodal refs.
 */
import { describe, it, expect } from 'vitest';
import { buildOpenRouterImageRequest, generateOpenRouterImage } from '@/lib/image-providers/openrouter-image';

describe('v12.96 · openrouter-image', () => {
  it('请求构造:modalities 带 image + 画幅提示注入 + 模型可覆盖', () => {
    const b = buildOpenRouterImageRequest('a coffee bottle', '9:16');
    expect(b.model).toBe('google/gemini-2.5-flash-image');
    expect(b.modalities).toEqual(['image', 'text']);
    expect(b.messages[0].content).toContain('a coffee bottle');
    expect(b.messages[0].content).toContain('9:16 portrait');
    expect(buildOpenRouterImageRequest('x', '16:9', 'my/model').model).toBe('my/model');
    expect(buildOpenRouterImageRequest('x', '1:1').messages[0].content).toContain('1:1');
  });

  it('con referenceImages → content multimodal text + image_url (máx 4)', () => {
    const refs = [
      'data:image/png;base64,AAA',
      'https://cdn.example/ref2.png',
      'ftp://skip-me',
      'https://cdn.example/ref3.png',
      'https://cdn.example/ref4.png',
      'https://cdn.example/ref5-extra.png',
    ];
    const b = buildOpenRouterImageRequest('edit this', '9:16', undefined, refs);
    expect(Array.isArray(b.messages[0].content)).toBe(true);
    const parts = b.messages[0].content as Array<{ type: string; text?: string; image_url?: { url: string } }>;
    expect(parts[0]).toEqual({ type: 'text', text: expect.stringContaining('edit this') });
    expect(parts.filter((p) => p.type === 'image_url')).toHaveLength(4);
    expect(parts[1].image_url?.url).toBe('data:image/png;base64,AAA');
    expect(parts.some((p) => p.image_url?.url?.startsWith('ftp:'))).toBe(false);
  });

  it('sin refs → content sigue siendo string (compat T2I)', () => {
    const b = buildOpenRouterImageRequest('solo texto', '16:9', undefined, []);
    expect(typeof b.messages[0].content).toBe('string');
  });

  it('无 OPENROUTER_API_KEY → 空串短路(不发请求,链落下一档)', async () => {
    expect(await generateOpenRouterImage('x', {}, {} as any)).toBe('');
  });
});
