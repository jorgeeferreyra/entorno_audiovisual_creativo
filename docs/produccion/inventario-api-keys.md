# Inventario de API keys para el pipeline real

> Qué credenciales conseguir y en qué orden para correr el pipeline punta a punta (plano → imagen → video → voz → montaje → export) con la instancia local de `wind-comic` vía `wind-mcp`.
>
> Estado revisado contra [`wind-comic/.env.local`](../../wind-comic/.env.local). Los valores de las keys **no** se exponen aquí — solo si están configuradas o no.

---

## Inventario (ordenado por prioridad para el Arco 3)

| Prioridad | Variable (.env) | Proveedor | Para qué se usa | Dónde conseguirla (link) | Ya configurada |
|---|---|---|---|---|---|
| 1 (bloqueante) | `MINIMAX_API_KEY` | MiniMax | Motor principal: imagen madre (image-01), video I2V (Hailuo/I2V-01), TTS (speech-2.8-hd), y upload de frames obligatorio en modo real para cualquier video | [platform.minimax.io](https://platform.minimax.io) → API Keys → "Create new secret key" (internacional; la china es [platform.minimaxi.com](https://platform.minimaxi.com)) | No |
| 1 (acompaña) | `MINIMAX_GROUP_ID` | MiniMax | ID numérico de cuenta; `wind-mcp` lo pasa como query param en el upload de frames (API v1 legacy) | Mismo portal: Account → Your Profile → campo GroupID (19 dígitos) | No |
| 2 (ya resuelta) | `OPENAI_API_KEY` | OpenAI | Guion/director/polish (LLM) y fallback de imagen (flux-kontext vía gateway) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Sí |
| 3 (planos gancho A3) | `KELING_API_KEY` | Kling (Kuaishou) | FLF (first-last-frame) recomendado para los ornitorrincos del Arco 3; también lip-sync y 4K. Con fallback automático a Minimax I2V si falta | Consola oficial: [app.klingai.com/global/dev](https://app.klingai.com/global/dev). Ver caveat de autenticación abajo | No |
| 4 (fallback video+imagen) | `QINGYUNTOP_API_KEY` | Qingyun (agregador chino) | Gateway unificado de fallback: Sora-2/Veo-3 para video, MJ/kontext para imagen | [api.qingyuntop.top/register](https://api.qingyuntop.top/register) → consola → "API令牌" → añadir token ([docs](https://qingyuntop.apifox.cn/)) | No |
| 5 (opcional, mismo gateway) | `VEO_API_KEY` | Qingyun | Sora/Veo cinematográfico para finales; usa el mismo gateway que la fila anterior — la misma key de Qingyun sirve para ambas variables | Igual que `QINGYUNTOP_API_KEY` | No |
| 6 (opcional, storyboards) | `MJ_API_KEY` | vectorengine (agregador MJ) | Midjourney para storyboards/refs de personaje (mejor calidad de imagen fija) | **No confirmado con certeza:** el `.env.example` apunta a `api.vectorengine.ai`, pero lo único verificable en la web es [api.vectorengine.cn](https://api.vectorengine.cn/) (mismo agregador, dominio `.cn`) con base URL `www.vectronode.com/v1`. Alternativa confirmada: la misma `QINGYUNTOP_API_KEY` cubre MJ | No |
| 7 (opcional, T2V alternativo) | `VIDU_API_KEY` | Vidu | Motor T2V alternativo (clips largos 16s) | [platform.vidu.com](https://platform.vidu.com) → dashboard → API Keys (login con Google) | No |
| 8 (opcional, consistencia) | `FAL_KEY` | fal.ai | FLUX Kontext para consistencia por imagen de referencia | [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) | No |

### No hacen falta para el pipeline

| Variable (.env) | Para qué | Ya configurada |
|---|---|---|
| `JWT_SECRET` | Firma de sesión local (ya lista para e2e) | Sí |
| `STRIPE_*` | Suscripciones SaaS (solo despliegue público) | No (placeholders) |
| `YOUTUBE_ACCESS_TOKEN` | Publicación automática a YouTube | No |
| `CRON_SECRET` | Worker de publicación programada (prod) | No |
| `NEXT_PUBLIC_SENTRY_DSN` | Telemetría de errores | No |
| `XVERSE_*` | LLM self-hosted alternativo | No (deshabilitado) |

---

## Mínimo viable vs. set completo

### Mínimo viable — primer e2e real de a3-m01

**1 cuenta nueva (MiniMax) = 2 variables.**

- `MINIMAX_API_KEY` + `MINIMAX_GROUP_ID` (misma cuenta, un solo registro)
- Con eso: imagen madre → upload de frame → video I2V → TTS
- `OPENAI_API_KEY` ya está configurada; el montaje es ffmpeg local (sin key)
- FLF degradaría a Minimax I2V con warning — aceptable para el primer e2e

### Set recomendado — toolkit completo del Arco 3

**3 cuentas / keys.**

1. MiniMax (`MINIMAX_API_KEY` + `MINIMAX_GROUP_ID`) — motor principal
2. Kling (`KELING_API_KEY`) — FLF real en planos gancho
3. Qingyun (`QINGYUNTOP_API_KEY`) — fallback Sora/Veo + MJ para storyboards sin depender de vectorengine

Opcionalmente copiar la misma key de Qingyun en `VEO_API_KEY` si se quiere explícito en el fallback de video cinematográfico.

---

## Caveats

### Kling y autenticación

La consola oficial emite un par **Access Key + Secret Key** y exige un JWT firmado (expira a los 30 min), pero `wind-comic` manda `KELING_API_KEY` directo como `Bearer` ([`wind-comic/services/kling.service.ts`](../../wind-comic/services/kling.service.ts)). Esto sugiere que la key esperada es de un agregador compatible (o un JWT pregenerado, poco práctico). El propio repo reconoce que el FLF de Kling nunca se validó con key real ([`wind-comic/docs/TODO-CARRYOVERS.md`](../../wind-comic/docs/TODO-CARRYOVERS.md) #1).

**Recomendación:** no contratar Kling oficial (mínimo enterprise ~USD 1.400/mes) hasta validar. Probar primero vía Qingyun, que expone endpoints Kling (`/kling/v1/videos/...`) con key simple.

### vectorengine

URL no confirmada al 100% (fila 6 de la tabla). No asumir `api.vectorengine.ai` como válida sin probarla.

### Minimax: upload vs TTS

El modelo TTS `speech-2.8-hd` por endpoint t2a_v2 no requiere GroupId, pero el upload de archivos de `wind-mcp` sí lo usa — conseguir ambos valores juntos al registrarse.

### wind-mcp sube frames siempre a Minimax en modo real

En modo real (sin `MOCK_ENGINES=1`), `resolveFrameUrlForVideo()` de [`wind-mcp/src/lib/image.ts`](../../wind-mcp/src/lib/image.ts) sube los frames a Minimax **siempre**, incluso cuando el clip lo genera Kling FLF. Por eso `MINIMAX_API_KEY` bloquea todo el camino de video, no solo el motor Minimax.

---

## Orden de acción sugerido

1. Registrarse en [MiniMax](https://platform.minimax.io), cargar saldo mínimo, crear key + copiar GroupID → pegar en `wind-comic/.env.local`.
2. Correr el e2e real de a3-m01 (mismo flujo que el dry-run, con `MOCK_ENGINES=0` en `wind-comic/.env.local`).
3. Si el resultado I2V de los planos gancho no alcanza: registrarse en [Qingyun](https://api.qingyuntop.top/register) y evaluar Kling vía ese gateway.

---

## Referencias

- Variables completas: [`wind-comic/.env.example`](../../wind-comic/.env.example)
- Pipeline de producción: [pipeline-wind-comic.md](pipeline-wind-comic.md)
- Providers de imagen/video: [`wind-comic/docs/image-providers.md`](../../wind-comic/docs/image-providers.md), [`wind-comic/docs/video-providers.md`](../../wind-comic/docs/video-providers.md)
