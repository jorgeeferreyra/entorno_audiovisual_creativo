# Providers, costos y glosario del framework

> Fuente única de **quién genera qué, a qué costo y cómo se estima**. Transversal a todos los proyectos.
>
> **Invariante de costos:** las únicas cifras de costo del repo viven acá y en [tarifas.json](tarifas.json). Ningún otro documento (TECH, PROGRESS, planos, reels, pipeline, insights) escribe tarifas, montos en ¥ ni tablas de presupuesto: solo referencian esta doc. El presupuesto **no se documenta**; se estima on-demand con la calculadora de costos (canvas de Cursor `calculadora-costos.canvas.tsx`, con tarifas sembradas de [tarifas.json](tarifas.json)). El costo real por asset vive en los sidecars `.json` que genera el pipeline, no en los `.md`.
>
> Las tarifas unitarias machine-readable viven en [tarifas.json](tarifas.json); acá se documentan, se convierten en fórmulas por capa y se explica cuándo/cómo actualizarlas.
>
> Credenciales revisadas contra [`wind-comic/.env.local`](../engine/wind-comic/.env.local). Los valores de las keys **no** se exponen aquí — solo si están configuradas o no.

---

## 1. Glosario de providers (capacidades y tarifa)

Qué motor expone cada provider, sus capacidades relevantes para el pipeline y su tarifa unitaria (de [tarifas.json](tarifas.json), en ¥ CNY, revisado 2026-07-09).

| Provider | Motor / modelo | Capacidades | Operación → tarifa | Variable (.env) |
|---|---|---|---|---|
| MiniMax | image-01 | Imagen madre | imagen → ¥0.3 | `MINIMAX_API_KEY` |
| MiniMax | Hailuo / I2V-01 | Video I2V (primer frame), S2V (1 sujeto) | video-i2v → ¥0.1/s | `MINIMAX_API_KEY` |
| MiniMax | speech-2.8-hd | TTS / clonado de voz | tts → ¥0.02/s | `MINIMAX_API_KEY` |
| Kling (vía qingyuntop) | Kling FLF | Morph first→last frame, lip-sync, 4K | video-flf → ¥0.2/s | `KELING_API_KEY` |
| Veo (vía qingyuntop) | Veo 3.1 | Video cinematográfico (finales) | video → ¥0.6/s | `VEO_API_KEY` |
| OpenRouter | gemini-2.5-flash-image (Nano Banana) | Imagen con multi-ref (Ref + anatomía) | imagen → a confirmar (proxy ¥0.3) | `OPENROUTER_API_KEY` |
| OpenAI | GPT / flux-kontext | LLM (guion/director) + fallback imagen | — | `OPENAI_API_KEY` |

Extensible: se registran providers propios con `registerImageProvider` / `registerVideoProvider`. El contrato de plugin (capability flags, prioridad de fallback) está documentado —a nivel de desarrollo— en [`wind-comic/docs/image-providers.md`](../engine/wind-comic/docs/image-providers.md) y [`wind-comic/docs/video-providers.md`](../engine/wind-comic/docs/video-providers.md). Esos docs describen el **cómo se integra** un motor, no sus precios: las tarifas son las de este glosario.

---

## 2. Fórmulas por capa

El tarifario da el costo por operación; cada capa de producción es una fórmula sobre esas tarifas. Así el costo unitario "sube" por cada capa y se pueden responder preguntas como "¿cuánto cuesta un reel de T segundos?".

| Capa | Fórmula | Con tarifas de hoy |
|---|---|---|
| Imagen madre (aprobada) | `candidatos × tarifa imagen` | 3 × ¥0.3 ≈ **¥0.9 por madre** |
| Clip U2V (I2V) | `duración(s) × tarifa video-i2v` | 5s Minimax ≈ **¥0.5** |
| Clip U2V-FLF | `duración(s) × tarifa video-flf` | 5s Kling ≈ **¥1** |
| Clip cinematográfico | `duración(s) × tarifa video` | 5s Veo ≈ **¥3** |
| Voz off (TTS) | `duración(s) × tarifa tts` | grabada propia = **¥0** |
| Animatic / montaje / export / destacadas | `0` (ffmpeg local) | **¥0 marginal** |

Regla rápida: **~¥0.5–1 por cada 5s de video terminado**, más ~¥0.9 por cada madre nueva que ese output exija. El **video es el mayor costo**: reservar los motores caros (Kling, Veo) para los planos-gancho y usar Minimax para el resto.

### Costo total vs. marginal

Un output (reel, destacada, animatic) tiene dos costos:

- **Total** — todos sus assets a tarifa plena.
- **Marginal** — solo lo que falta generar (restando los assets que ya existen en `assets/`).

Como los clips son **fuente reutilizable** entre salidas (reels transversales y destacadas comparten bloques), el **marginal** es la pregunta que importa a mitad de producción. El animatic, en particular, es ¥0 de operación: su costo real es el de las madres que aún le falten.

> Estimación interactiva: la calculadora de costos (canvas de Cursor `calculadora-costos.canvas.tsx`) aplica estas fórmulas en vivo para escenarios "¿y si el reel dura 90s?". Se abre desde Cursor al lado del chat; sus tarifas embebidas se siembran de este archivo.

---

## 3. Método de actualización de tarifas

1. **Cuándo:** al arrancar cada unidad de trabajo, antes de estimar su presupuesto con la calculadora. Y cuando un provider anuncie cambio de precios.
2. **Contra qué:** las páginas de pricing linkeadas en [tarifas.json](tarifas.json) (campo `pricing`) y en el glosario §1.
3. **Cómo:** editar `tarifas.json`, subir el campo `revisado`, y reflejar el cambio en la calculadora (canvas `calculadora-costos.canvas.tsx`, cuyas tarifas embebidas se siembran de este archivo).
4. **Loop de verificación (real vs. estimado):** cada asset generado deja un sidecar `.json` con su costo real (`escribirSidecar()` en [`wind-mcp/src/lib/motor.ts`](../engine/wind-mcp/src/lib/motor.ts)); el acumulado real se lee de esos sidecars, no de los `.md`. Si el real se despega del estimado (p. ej. el factor de retries `candidatosMadre` no calibra), corregir la tarifa o el parámetro acá.

---

## 4. Credenciales del pipeline (BYO keys)

Qué credenciales conseguir y en qué orden para correr el pipeline punta a punta (plano → imagen → video → voz → montaje → export) con la instancia local de `wind-comic` vía `wind-mcp`.

| Prioridad | Variable (.env) | Para qué se usa | Dónde conseguirla | Configurada |
|---|---|---|---|---|
| 1 (bloqueante) | `MINIMAX_API_KEY` | Imagen madre, video I2V, TTS y upload de frames obligatorio en modo real para cualquier video | [platform.minimax.io](https://platform.minimax.io) → API Keys → "Create new secret key" (internacional; la china es [platform.minimaxi.com](https://platform.minimaxi.com)) | **Sí** |
| 1 (acompaña) | `MINIMAX_GROUP_ID` | ID numérico de cuenta; `wind-mcp` lo pasa como query param en el upload de frames (API v1 legacy) | Mismo portal: Account → Your Profile → GroupID (19 dígitos) | **Sí** |
| 2 (ya resuelta) | `OPENAI_API_KEY` | Guion/director/polish (LLM) y fallback de imagen (flux-kontext vía gateway) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Sí |
| 3 (planos gancho) | `KELING_API_KEY` | FLF recomendado para transiciones; lip-sync y 4K. Fallback automático a Minimax I2V | Configurada con `KELING_BASE_URL=https://api.qingyuntop.top/kling` (gateway, key simple) — ver caveat abajo | **Sí** (vía Qingyun) |
| 4 (fallback video+imagen) | `QINGYUNTOP_API_KEY` | Gateway unificado de fallback: Sora-2/Veo-3 para video, MJ/kontext para imagen. Misma key que `KELING_API_KEY` | [api.qingyuntop.top/register](https://api.qingyuntop.top/register) → consola → "API令牌" ([docs](https://qingyuntop.apifox.cn/)) | **Sí** |
| 5 (opcional) | `VEO_API_KEY` | Sora/Veo cinematográfico para finales; mismo gateway que la fila anterior | Igual que `QINGYUNTOP_API_KEY` | **Sí** (misma key Qingyun; provider `veo` prioridad 60, primer fallback de video) |
| 6 (opcional) | `MJ_API_KEY` | Midjourney para storyboards/refs de personaje | `.env.example` apunta a `api.vectorengine.ai`, no confirmado; alternativa: [api.vectorengine.cn](https://api.vectorengine.cn/) o la misma `QINGYUNTOP_API_KEY` cubre MJ | No |
| 7 (opcional) | `VIDU_API_KEY` | T2V alternativo (clips largos 16s) | [platform.vidu.com](https://platform.vidu.com) → API Keys | No |
| 8 (opcional) | `FAL_KEY` | FLUX Kontext para consistencia por imagen de referencia | [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) | No |
| 9 (opcional) | `OPENROUTER_API_KEY` | Imagen vía Nano Banana (default Arco 3). Modelo/prioridad: `OPENROUTER_IMAGE_MODEL`, `OPENROUTER_IMAGE_PRIORITY` | [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) | Sí |

### No hacen falta para el pipeline

| Variable (.env) | Para qué | Configurada |
|---|---|---|
| `JWT_SECRET` | Firma de sesión local (ya lista para e2e) | Sí |
| `STRIPE_*` | Suscripciones SaaS (solo despliegue público) | No (placeholders) |
| `YOUTUBE_ACCESS_TOKEN` | Publicación automática a YouTube | No |
| `CRON_SECRET` | Worker de publicación programada (prod) | No |
| `NEXT_PUBLIC_SENTRY_DSN` | Telemetría de errores | No |
| `XVERSE_*` | LLM self-hosted alternativo | No (deshabilitado) |

### Mínimo viable vs. set completo

**Mínimo viable (primer e2e real):** 1 cuenta MiniMax = `MINIMAX_API_KEY` + `MINIMAX_GROUP_ID`. Cubre imagen madre → upload de frame → video I2V → TTS. `OPENAI_API_KEY` ya está; el montaje es ffmpeg local. FLF degradaría a Minimax I2V con warning — aceptable para el primer e2e.

**Set recomendado (ya configurado):** las 3 keys presentes en `.env.local` — MiniMax (motor principal), Kling vía Qingyun (FLF real en planos gancho), Qingyun (fallback Sora/Veo + MJ). La misma key de Qingyun está copiada en `VEO_API_KEY` (provider `veo`, prioridad 60) y sirve al canal `qyt-vidu` (Vidu Q3) desde el fix en [`wind-comic/services/qyt-vidu.service.ts`](../engine/wind-comic/services/qyt-vidu.service.ts).

---

## 5. Caveats

- **Kling y autenticación.** La consola oficial emite Access Key + Secret Key y exige JWT firmado (expira a los 30 min), pero `wind-comic` manda `KELING_API_KEY` directo como `Bearer` ([`wind-comic/services/kling.service.ts`](../engine/wind-comic/services/kling.service.ts)) — la key esperada es de un agregador compatible. No contratar Kling oficial (mínimo enterprise ~USD 1.400/mes) hasta validar. **Decisión (resuelta):** vía Qingyun, `KELING_BASE_URL=https://api.qingyuntop.top/kling`; FLF real disponible sin contrato, con fallback automático a Minimax I2V. Falta validar el morph por eslabón (ver [PROGRESS.md](../proyectos/charles-jones/redes/PROGRESS.md) §Gate Kling).
- **vectorengine.** URL no confirmada al 100% (fila 6). No asumir `api.vectorengine.ai` sin probarla.
- **MiniMax: upload vs. TTS.** El TTS `speech-2.8-hd` (endpoint t2a_v2) no requiere GroupId, pero el upload de archivos de `wind-mcp` sí — conseguir ambos valores al registrarse.
- **wind-mcp sube frames siempre a Minimax en modo real.** `resolveFrameUrlForVideo()` ([`wind-mcp/src/lib/image.ts`](../engine/wind-mcp/src/lib/image.ts)) sube los frames a Minimax incluso cuando el clip lo genera Kling FLF. Por eso `MINIMAX_API_KEY` bloquea todo el camino de video, no solo el motor Minimax.

---

## 6. Orden de acción sugerido

1. Registrarse en [MiniMax](https://platform.minimax.io), cargar saldo mínimo, crear key + copiar GroupID → pegar en `wind-comic/.env.local`.
2. Correr el e2e real de la primera madre (mismo flujo que el dry-run, con `MOCK_ENGINES=0`).
3. Si el I2V de los planos gancho no alcanza: registrarse en [Qingyun](https://api.qingyuntop.top/register) y evaluar Kling vía ese gateway.

---

## Referencias

- Tarifas machine-readable: [tarifas.json](tarifas.json)
- Pipeline de producción: [pipeline.md](pipeline.md)
- Contrato de plugin de providers (desarrollo): [`wind-comic/docs/image-providers.md`](../engine/wind-comic/docs/image-providers.md), [`wind-comic/docs/video-providers.md`](../engine/wind-comic/docs/video-providers.md)
- Variables completas: [`wind-comic/.env.example`](../engine/wind-comic/.env.example)
