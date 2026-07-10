# Episodio 1 (redes) — Fundación técnica

_Status: Approved_
_Date: 2026-07-09_
_Based on: [SPEC.md](SPEC.md)_

> El **cómo** de este episodio: motores por arco, presupuesto y decisiones de producción específicas. El método transversal (estrategia "un personaje por clip", convención de IDs, plantillas de ingesta) vive en [../../../metodo/pipeline.md](../../../metodo/pipeline.md) y no se duplica acá.

---

## 1. Contexto

Producción con la instancia local de `wind-comic` (en `engine/wind-comic`) orquestada por `engine/wind-mcp` (BYO keys). Un solo CLI: `npm run gen` lee las fichas de `planos/arco-3.md` y despacha por `kind`.

## 2. Motores por arco

Qué lockear y con qué motor, según el tipo de contenido de cada arco (relocado desde el pipeline; es decisión específica de esta serie).

| Arco | Elemento a lockear | Motor recomendado | Por qué |
|---|---|---|---|
| 1 · Mano Negra | Ninguno (solo mano + cadenita) | Minimax Hailuo (~¥0.1/s) | La mano se mantiene con prompt + primer frame; no gasta lock |
| 2 · Charles | 1 sujeto | Minimax S2V o Kling | S2V lockea 1 protagonista; silueta de espaldas = poca cara = fácil |
| 3 · Ornitorrincos | Referencia de imagen por animal | Kling FLF o Seedance multi-ref | Consistencia desde imagen madre como primer frame (I2V) |

Referencia de motores/capacidades/costos: `engine/wind-comic/docs/{video,image}-providers.md`.

**Decisión de imagen (Arco 3):** madres con Ref/AnatomyRef se generan por defecto con **OpenRouter / Nano Banana** (`google/gemini-2.5-flash-image`), multi-ref (lock m01 + anatomía en `assets/fuentes/ornitorrincos/`). Fallback: `--provider minimax` (composite 1-slot).

## 3. Servicios y keys

BYO keys en `engine/wind-comic/.env.local`. Inventario priorizado y estado: [../../../metodo/inventario-api-keys.md](../../../metodo/inventario-api-keys.md).

| Servicio | Uso | Estado |
|---|---|---|
| MINIMAX_API_KEY | Imagen + video I2V + TTS + upload de frames (bloqueante en modo real) | Configurada |
| KELING_API_KEY (vía gateway qingyuntop) | FLF real de la cadena de transiciones | Configurada — Gate Kling resuelto |
| OPENROUTER_API_KEY | Nano Banana (imagen con refs, default Arco 3) | Configurada |
| OPENAI_API_KEY | LLM / fallback imagen | Configurada |

## 4. Presupuesto estimado (techo operativo ~¥19–20)

Relocado desde el pipeline; es el costeo específico de este episodio. El detalle real acumulado se lleva en [PROGRESS.md](PROGRESS.md) §Presupuesto.

| Etapa | Estimado |
|---|---|
| Imágenes madre (16 × ¥0.3 + retries con `--candidates 3`) | ~¥4.8 + ~¥3–4 |
| Clips U2V (~11 × ¥0.5) | ~¥5.5 |
| Clips FLF (6 × ~¥1: a5, a5x, a5y, b4, c0, c2) | ~¥6 |
| **Total** | **~¥16.3 (techo ¥19–20 con retries)** |

El video es el mayor costo; Kling (~¥0.2/s) y Veo (~¥0.6/s) se reservan a los planos-gancho.

## 5. Roadmap (stages)

Orden de ejecución del episodio, cada stage entregable por separado.

### Stage 1 — Docs y spec
**Goal:** planos / biblia / spec alineados a dirección. **Exit:** fichas de `planos/arco-3.md` válidas (`npm run gen -- --arco 3` sin errores).

### Stage 2 — Imágenes madre en cascada
**Goal:** las 16 madres aprobadas. **Scope:** generar con `--candidates 3`, aprobar con `--pick`, en orden m03' → m02' → m10' → m17; pares FLF aprobados juntos. **Exit:** todas las madres con criterio de la etapa Madres.

### Stage 3 — Clips
**Goal:** clips A/B/C generados y aprobados. **Scope:** Reel B (b1–b4) → FLF experimental (a5x) → puentes (a5y, c0) → Reel C; regenerar a3-a5 como FLF real. **Dependencies:** Stage 2. **Exit:** clips con criterio de la etapa Clips (morph real en FLF).

### Stage 4 — Montaje de reels
**Goal:** Reels A/B/C montados (inserts: m-mano en a5, eco m09 tras c3, foto real en c4). **Dependencies:** Stage 3. **Exit:** continuidad de tinte, audio off, 9:16.

### Stage 5 — Stories
**Goal:** S1–S5 por recorte, cero generación. **Dependencies:** Stage 4.

## 6. Open Questions

- [ ] Validar que el gateway qingyuntop soporte el morph primer→último frame en cada eslabón FLF.
- [ ] a3-a4 obsoleto (era cría): regenerar U2V sobre m04 huevo.

---

_Aprobado. Siguiente: producción por stages, seguimiento en [PROGRESS.md](PROGRESS.md)._
