# Redes (charles-jones) — Fundación técnica

_Status: Approved_
_Date: 2026-07-09_
_Based on: [SPEC.md](SPEC.md)_

> El **cómo** de las redes: motores por arco, presupuesto y decisiones de producción específicas. El método transversal (estrategia "un personaje por clip", convención de IDs, plantillas de ingesta) vive en [../../../metodo/pipeline.md](../../../metodo/pipeline.md) y no se duplica acá.

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

Referencia de motores/capacidades/tarifas: [../../../metodo/providers.md](../../../metodo/providers.md).

**Decisión de imagen (Arco 3):** madres con Ref/AnatomyRef se generan por defecto con **OpenRouter / Nano Banana** (`google/gemini-2.5-flash-image`), multi-ref (lock m01 + anatomía en `assets/fuentes/ornitorrincos/`). Fallback: `--provider minimax` (composite 1-slot).

## 3. Servicios y keys

BYO keys en `engine/wind-comic/.env.local`. Inventario priorizado y estado: [../../../metodo/providers.md](../../../metodo/providers.md) §4.

| Servicio | Uso | Estado |
|---|---|---|
| MINIMAX_API_KEY | Imagen + video I2V + TTS + upload de frames (bloqueante en modo real) | Configurada |
| KELING_API_KEY (vía gateway qingyuntop) | FLF real de la cadena de transiciones | Configurada — Gate Kling resuelto |
| OPENROUTER_API_KEY | Nano Banana (imagen con refs, default Arco 3) | Configurada |
| OPENAI_API_KEY | LLM / fallback imagen | Configurada |

## 4. Presupuesto estimado (techo operativo ~¥19–20)

Relocado desde el pipeline; es el costeo específico de este episodio (cantidades × tarifa unitaria). Las tarifas por operación y las fórmulas por capa están en [../../../metodo/providers.md](../../../metodo/providers.md) §2; el detalle real acumulado, en [PROGRESS.md](PROGRESS.md) §Presupuesto.

| Etapa | Estimado |
|---|---|
| Imágenes madre (16 × ¥0.3 + retries con `--candidates 3`) | ~¥4.8 + ~¥3–4 |
| Clips U2V (~11 × ¥0.5) + gaps A1/A2 (4 madres + 3 clips ~¥2.6) | ~¥8 |
| Clips FLF **del reel** (b4, c2; `a5`/`a5x`/`a5y`/`c0` diferidos a destacadas) | ~¥2 |
| **Total reel** | **~¥14.9 (techo ¥19–20 con retries)** |

El video es el mayor costo; los motores caros (Kling, Veo) se reservan a los planos-gancho.

## 5. Roadmap (stages)

Orden de ejecución del episodio, cada stage entregable por separado.

### Stage 1 — Docs y spec
**Goal:** planos / biblia / spec alineados a dirección. **Exit:** fichas de `planos/arco-3.md` válidas (`npm run gen -- --arco 3` sin errores).

### Stage 1.5 — Cadena narrativa (gate previo a imágenes)
**Método:** instancia del paso 0 del pipeline ([../../../metodo/pipeline.md](../../../metodo/pipeline.md) §2). **Goal:** mapa de beats del reel en lenguaje de historia (no de producción) aprobado por dirección, con el cruce beat→clip que expone los huecos de cobertura **antes** de gastar en madres/clips. **Scope:** [reels/la-grieta/cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md) — la cadena aprobada + mapa beat→clip contra la `cutlist`. **Gate:** no se generan imágenes nuevas sin la cadena aprobada; gobierna la cutlist (la cutlist la implementa). **Exit:** `cadena-narrativa.md` con `estado: aprobado`. Las madres del Arco 3 se generaron antes de formalizar este gate; rige retroactivamente para los gaps (A1/A2, zooms de los beats 8 y 9) y toda generación futura.

### Stage 2 — Imágenes madre en cascada
**Goal:** las 16 madres aprobadas. **Scope:** generar con `--candidates 3`, aprobar con `--pick`, en orden m03' → m02' → m10' → m17; pares FLF aprobados juntos. **Dependencies:** Stage 1.5 aprobado. **Exit:** todas las madres con criterio de la etapa Madres.

### Stage 2.5 — Animatic (gate previo a video/audio)
**Goal:** un animatic 9:16 que valide ritmo, orden narrativo y subtítulos con imágenes fijas, **antes** de gastar en video (el mayor costo: ~¥11.5 de ~¥16). **Scope:** dos modos de `npm run animatic` (puro ffmpeg local, no usa wind-comic ni APIs):
- `--reel la-grieta` → **animatic transversal**: intercala los clips de la `cutlist` del front-matter de [reels/la-grieta/README.md](reels/la-grieta/README.md) con sus duraciones recortadas, cruzando arcos. Es el gate principal (lo que se publica es el reel). Los clips de arcos aún sin planos (`a1-*`/`a2-*`) se omiten con aviso.
- `--arco N` → **animatic del hilo**: todas las fichas de `planos/arco-N.md` en orden; sirve para aprobar la fuente y las destacadas de ese arco.

Los `video-flf` se muestran como first→last (dos mitades de `dur/2`) para representar la transformación. Madres aún sin generar se omiten con aviso, así el animatic sirve también en pleno refinamiento. **Dependencies:** Stage 1.5 aprobado (la cadena narrativa gobierna la cutlist que alimenta el animatic). **Gate:** no se avanza a Stage 3 sin el animatic transversal aprobado. **Exit:** animatic aprobado en [reels/la-grieta/](reels/la-grieta/).

### Stage 3 — Clips
**Goal:** clips que el reel aprobado necesita, generados y aprobados. **Scope (ordenado por el reel):** regen `a3-a4` (huevo) y `a3-c1` (push-in m07); generar `a3-c3`; re-auditar `b1`–`c2` (mp4 pre-rediseño en disco); bajar madres+clips de A1 (`a1-a1`) y A2 (`a2-a1`). **Diferido a Stage 5 (destacadas):** puentes FLF `a5x`/`a5y`/`c0` y regen FLF de `a3-a5` — el reel de 30–45s los cubre con corte duro (auditoría §D). **Dependencies:** Stage 2.5 aprobado. **Exit:** clips con criterio de la etapa Clips (morph real en FLF donde aplique: b4, c2).

### Stage 4 — Montaje del reel transversal
**Goal:** reel transversal ([reels/la-grieta/](reels/la-grieta/)) montado a partir de los bloques (inserts: m-mano en a5, eco m09 tras c3, foto real en c4). **Dependencies:** Stage 3. **Exit:** continuidad de tinte, audio off, 9:16.

### Stage 5 — Destacadas del arco
**Goal:** destacadas S1–S5 por recorte, cero generación (carpetas `destacadas/arco-3/` se crean al montar la primera). **Dependencies:** Stage 4.

## 6. Open Questions

- [ ] Validar que el gateway qingyuntop soporte el morph primer→último frame en cada eslabón FLF.
- [ ] a3-a4 obsoleto (era cría): regenerar U2V sobre m04 huevo.

---

_Aprobado. Siguiente: producción por stages, seguimiento en [PROGRESS.md](PROGRESS.md)._
