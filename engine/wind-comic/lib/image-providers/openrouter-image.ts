/**
 * OpenRouter 图像生成档(v12.96.0,P0-2 图像跨网关兜底)。
 *
 * 病根:MJ 通道 parameter error 时图像只剩 minimax/kontext 同类网关档,整组翻车 → 分镜全占位
 * (实测 12 占位残片)。OpenRouter 聚合多家图像模型(gemini-flash-image 等)且 provider 级自动
 * failover —— 作图像链**最后真实档**(mock 之前)。
 *
 * API 形态:OpenAI chat/completions + `modalities:["image","text"]`,返回
 * choices[0].message.images[0].image_url.url(data:base64)。纯请求构造可单测。
 *
 * Multimodal refs: content 可为 string (T2I) o array text+image_url (I2I / Nano Banana).
 */

export type OpenRouterContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export type OpenRouterMessageContent = string | OpenRouterContentPart[];

export function buildOpenRouterImageRequest(
  prompt: string,
  aspectRatio?: string,
  model?: string,
  referenceImages?: string[],
): {
  model: string;
  messages: Array<{ role: string; content: OpenRouterMessageContent }>;
  modalities: string[];
} {
  const aspectHint = aspectRatio === '9:16'
    ? ' Vertical 9:16 portrait composition.'
    : aspectRatio === '1:1' ? ' Square 1:1 composition.' : ' Wide 16:9 cinematic composition.';
  const text = `${prompt}${aspectHint}`;
  const refs = (referenceImages || [])
    .filter((u) => typeof u === 'string' && (u.startsWith('http') || u.startsWith('data:image/')))
    .slice(0, 4);

  const content: OpenRouterMessageContent = refs.length === 0
    ? text
    : [
        { type: 'text', text },
        ...refs.map((url) => ({ type: 'image_url' as const, image_url: { url } })),
      ];

  return {
    model: model || 'google/gemini-2.5-flash-image',
    messages: [{ role: 'user', content }],
    modalities: ['image', 'text'],
  };
}

/** 生成一张图,返回 data:URI;未配 key / 失败 → ''(调用方落下一档)。 */
export async function generateOpenRouterImage(
  prompt: string,
  opts?: { aspectRatio?: string; referenceImages?: string[] },
  env: NodeJS.ProcessEnv = process.env,
): Promise<string> {
  const key = env.OPENROUTER_API_KEY;
  if (!key) return '';
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);
    let r: Response;
    try {
      r = await fetch(`${env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'}/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(buildOpenRouterImageRequest(
          prompt,
          opts?.aspectRatio,
          env.OPENROUTER_IMAGE_MODEL,
          opts?.referenceImages,
        )),
      });
    } finally { clearTimeout(timer); }
    if (!r.ok) {
      console.warn(`[OpenRouterImage] HTTP ${r.status}: ${(await r.text()).slice(0, 100)}`);
      return '';
    }
    const j: any = await r.json();
    const url = j?.choices?.[0]?.message?.images?.[0]?.image_url?.url || '';
    return typeof url === 'string' && (url.startsWith('data:image') || url.startsWith('http')) ? url : '';
  } catch (e) {
    console.warn('[OpenRouterImage] 失败:', e instanceof Error ? e.message : e);
    return '';
  }
}
