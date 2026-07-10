# Arco 3 — Roadmap de producción

> Documento de **seguimiento** (estados, costos, gates). No duplica prompts ni fichas: la fuente de verdad de los prompts es [arco-3-planos.md](arco-3-planos.md); el STYLE-BLOCK y los switches cuento↔real viven en [biblia-visual.md](biblia-visual.md); la convención de IDs/archivos en [pipeline-wind-comic.md](pipeline-wind-comic.md) §5.
> Comandos: los scripts de `wind-mcp/` leen los prompts directamente de arco-3-planos.md (`wind-mcp/src/lib/planos.ts`) — nunca editar prompts fuera del doc fuente.

Estados: `pendiente` → `generado` (existe el archivo) → `aprobado` (pasó el criterio de su etapa). Se actualiza a mano al avanzar.

---

## Orden de ejecución

1. **Docs** — planos / biblia / roadmap alineados a las decisiones de dirección (paso 1 ✓ en curso).
2. **Madres en cascada** — regenerar/generar con `--candidates 3` y aprobar con `--pick`, en orden: **m03' → m02' joven → m10' → m17**. Pares FLF se aprueban juntos (mismo encuadre).
3. **Clips** — Reel B (b1–b4) → FLF experimental m06→m14 (`a3-a5x`) → puentes m15→m08 (`a3-a5y`) y m14→m07 (`a3-c0`) → Reel C. Regenerar `a3-a5` como FLF real cuando toque la cadena.
4. **Montaje reels** — A, B, C (inserts: m-mano en a3-a5, eco m09 tras c3, foto real en a3-c4).
5. **Stories** — S1–S5 derivadas por recorte, cero generación.

### Próxima acción

**Paso 2 (madres en cascada) listo** — m02/m03/m10/m17 aprobados vía **OpenRouter / Nano Banana** (`google/gemini-2.5-flash-image`), con multi-ref (m01 lock + anatomía en `assets/fuentes/ornitorrincos/`). Provider por defecto en `npm run madres:a3`; fallback `--provider minimax`.

**Siguiente = paso 3: clips.** Reel B (b1–b4) → puentes / Reel C. Requiere wind-comic arriba.

```bash
cd wind-comic && PLAN_GATE_DISABLED=1 npm run dev
cd wind-mcp && npm run clips:a3 -- # (o el script/U2V que toque por clip)
```

**Reel A:** a3-a1…a3-a6 aprobados; a3-a4 queda **obsoleto** (era cría; regenerar U2V sobre m04 huevo). a3-a5 aprobado como I2V degradado — regen FLF real pendiente. **Gate Kling resuelto** (FLF real vía gateway qingyuntop).

---

## Criterios de aprobación por etapa

| Etapa | Criterio |
|---|---|
| Madres | Silueta 100% negra recorte plano (NO fieltro/3D/plush), fondo tintado del beat correcto (guion de color de [arco-3-planos.md](arco-3-planos.md)), STYLE-BLOCK respetado (salvo m12–m15 que rompen a propósito), 9:16. Personajes distinguibles por contorno. **Madres emparejadas** (par first/last de un FLF: m05/m06, m10/m11, m09/m17): mismo encuadre y composición base, solo cambia el estado — el par se aprueba junto ([biblia-visual.md](biblia-visual.md) §3). Dirección de Ref: hereda de la madre ya aprobada/querida (hoy m10←m11). |
| Clips | Arranca 1:1 de su imagen madre, movimiento tipo títere de papel plano (no 3D), tinte estable durante el clip, duración correcta. FLF: morph real primer→último (provider `Kling-FLF`, no fallback I2V). |
| Reels | Continuidad de tinte entre clips, switches cuento↔real solo en la cadena de transiciones aprobada (ver abajo), audio off sincero sin chistes. |
| Stories | 15s, legibles sin audio, sin generación extra. |

**Dosificación de switches cuento↔real:** recurso **estructural** del arco (columna vertebral de transiciones), no un único quiebre aislado. Cadena aprobada en [arco-3-planos.md](arco-3-planos.md) §Cadena de transiciones: a5 (m05→m06), a5x experimental (m06→m14), a5y (m15→m08), c0 (m14→m07), c1 U2V+corte (m07→m10'), eco montaje m09, salto clínico c3/c4. No inventar switches fuera de esa cadena. El recurso híbrido (abajo) cuenta aparte con su propio tope.

---

## Checklist — Imágenes madre (16 generadas; m16 eliminada)

| ID | Título | Estado | Costo real | Nota |
|---|---|---|---|---|
| a3-m01 | Madre ornitorrinco | aprobado | ~¥0.3 | Lock de consistencia ✓ — no tocar |
| a3-m02 | Ornitorrinco joven | aprobado | OpenRouter | Nano Banana multi-ref; pick c1 (más chico, panza arriba); path `a3-m02-ornitorrinco-joven.png` |
| a3-m03 | Padre ornitorrinco | aprobado | OpenRouter | Nano Banana multi-ref; pick c3 (fornido, 4 patas, orilla de lago) |
| a3-m04 | Huevo | aprobado | ~¥0.3 | Close-up nido; ahora firstFrame de a3-a4 ✓ |
| a3-m05 | Paisaje Pangea | aprobado | ~¥0.3 | |
| a3-m06 | Pangea partida | aprobado | ~¥0.3 | Grieta roja, agua en el gap ✓ |
| a3-m07 | Rocas Coloradas | aprobado | ~¥0.6 | Retry ×1; firstFrame de a3-c1 (U2V) ✓ |
| a3-m08 | Australia próspera | aprobado | ~¥0.3 | lastFrame de puente a3-a5y ✓ |
| a3-m09 | Argentina en declive | aprobado | ~¥0.3 | firstFrame a3-b4 + eco montaje c3e ✓ |
| a3-m10 | Ornitorrinco sobre roca | aprobado | OpenRouter | Nano Banana: Ref m01 + mundo m07 + foto; pick c3; MADRE muriendo junto al agua ✓ |
| a3-m11 | Fósil de piedra | aprobado | ~¥0.3 | NO tocar — madre padre del par fosilización ✓ |
| a3-m12 | Apertura cuaderno Charles | aprobado | ~¥0.3 | Intro transversal POV ✓ |
| a3-m13 | Fósil en yacimiento | aprobado | ~¥0.3 | Salto realidad clínico ✓ |
| a3-m14 | Grieta Revenant | aprobado | ~¥0.3 | REALITY-BLOCK-CHAOS; keyframe de a5x y c0 ✓ |
| a3-m15 | Zoom-out poético | aprobado | ~¥0.6 | Retry ×1; firstFrame de a3-a5y ✓ |
| ~~a3-m16~~ | ~~Ornitorrinco caminando~~ | **ELIMINADA** | — | Con m10 reencuadrada no comparte encuadre; a3-c1 = U2V sobre m07 |
| a3-m17 | Argentina seca (estado final) | aprobado | OpenRouter | Par m09→m17; pick c2; mismo encuadre más seco/oscuro ✓ |
| a3-m18 | Joven muriendo sobre roca | aprobado | OpenRouter | Nueva: Ref m02 + mundo m07 + foto; pick c2; JOVEN muriendo en cornisa (escena hermana de m10) ✓ |

> **Switch provider (2026-07-09):** madres con Ref/AnatomyRef pasan por `openrouter` (Nano Banana) en vez de Minimax. Minimax se queda como `--provider minimax` (composite 1-slot) por si hace falta.

## Checklist — Clips

| ID | Reel | Herramienta | Estado | Costo real | Nota |
|---|---|---|---|---|---|
| a3-a1 | A | U2V | aprobado | ~¥0.5 | Intro transversal ✓ |
| a3-a2 | A | U2V | aprobado | ~¥0.5 | Establishing Pangea ✓ |
| a3-a3 | A | U2V | aprobado | ~¥0.5 | Ritual madre ✓ |
| a3-a4 | A | U2V | **obsoleto → regen** | ~¥0.5 (prev) | Regenerar: firstFrame m04 huevo (ya no cría) |
| a3-a5 | A | U2V-FLF | aprobado (regen FLF pendiente) | ~¥0.5 | I2V degradado; regenerar FLF real m05→m06 |
| a3-a5b | A | U2V | aprobado | ~¥0.5 | Switch caos Revenant ✓ |
| a3-a5c | A | U2V | aprobado | ~¥0.5 | Switch respiro crane-up ✓ |
| a3-a5x | A | U2V-FLF | pendiente | — | **EXPERIMENTAL** m06→m14; gate morphs cruzados |
| a3-a5y | A/B | U2V-FLF | pendiente | — | Puente m15→m08; cierra A / abre B |
| a3-a6 | A | U2V | aprobado | ~¥0.5 | |
| a3-b1 | B | U2V | pendiente | — | Requiere m03' aprobada; pantalla partida con b3 |
| a3-b2 | B | U2V | pendiente | — | Requiere m02' joven aprobada |
| a3-b3 | B | U2V | pendiente | — | |
| a3-b4 | B | U2V-FLF | pendiente | — | Par m09→m17 (requiere m17) |
| a3-c0 | C | U2V-FLF | pendiente | — | Puente m14→m07; abre Reel C |
| a3-c1 | C | U2V | pendiente | — | Push-in sobre m07 + corte a c2 (NO FLF) |
| a3-c2 | C | U2V-FLF | pendiente | — | Par m10'→m11 (requiere m10'); **Gate Kling** |
| a3-c3 | C | U2V | pendiente | — | |
| a3-c3e | C | ninguna | pendiente | — | Eco 1–2s m09 (solo montaje) |
| a3-c4 | C | ninguna | pendiente | — | Solo montaje (foto real) |

## Continuidad y QC (vision-audit por clip)

Formaliza el QC que ya se hace informalmente (carpetas `_candidates`/`_audit`). Cada clip aprobado registra acá su chequeo contra los criterios de la etapa Clips (arranca 1:1 de la madre, movimiento títere plano, tinte estable, duración correcta).

**Character Studio (`/dashboard/characters`):** fichas en [personajes-studio.md](personajes-studio.md); tras aprobar m02'/m03' subir archivos y pegar `imageUrls`.

| Clip | Vision-audit (scene/action/mood) | Contorno OK | Tinte estable | Estado |
|---|---|---|---|---|
| a3-a1 | — | ✓ | ✓ | aprobado |
| a3-a2 | — | ✓ | ✓ | aprobado |
| a3-a3 | — | ✓ | ✓ | aprobado |
| a3-a4 | (prev: baby) → regen huevo | — | — | obsoleto |
| a3-a5b | real earth splitting, debris | ✓ | ✓ | aprobado |
| a3-a5c | aerial two landmasses, golden dusk | ✓ | ✓ | aprobado |
| a3-a6 | mother at chasm edge, head lowering | ✓ | ✓ | aprobado |
| a3-a5x…a3-c4 | — | — | — | pendiente |

## Checklist — Reels y stories (montaje, sin costo de generación)

| Pieza | Fuente | Estado |
|---|---|---|
| Reel A "La grieta" | a3-a1…a3-a6 (+a5x/a5y si aprueban; +1–2 frames m-mano en a3-a5) | pendiente |
| Reel B "Vidas paralelas" | a3-b1…a3-b4 (pantalla partida) | pendiente |
| Reel C "El último" | a3-c0…a3-c4 (+eco m09) | pendiente |
| S1 La familia feliz | a3-a3 + a3-a4 (madre + huevo) | pendiente |
| S2 La grieta | a3-a5 | pendiente |
| S3 La despedida | a3-a6 | pendiente |
| S4 El declive | a3-b3 (+a3-b4) | pendiente |
| S5 El fósil | a3-c2 + a3-c3 + eco m09 + a3-c4 | pendiente |

---

## Presupuesto (techo operativo ~¥19–20)

| Etapa | Estimado | Real acumulado |
|---|---|---|
| Madres (16 × ¥0.3 + retries m02/m03/m10/m17 ×3 candidates) | ~¥4.8 + ~¥3–4 retries | ~¥6.0 (prev) |
| Clips U2V (~11 × ¥0.5, incl. a4 regen + c1) | ~¥5.5 | ~¥4.0 (Reel A) |
| Clips FLF (6 × ~¥1: a5, a5x, a5y, b4, c0, c2) | ~¥6 | ¥0 |
| **Total** | **~¥16.3** (techo **¥19–20** con retries) | **~¥10** |

Los retries de madres con `--candidates 3` suman ~¥0.9 c/u antes del pick: por eso la cascada ordenada (m03' → m02' → m10' → m17) y no regenerar en lote.

---

## Gate Kling — RESUELTO

`KELING_API_KEY` está configurada y `KELING_BASE_URL` apunta al **gateway qingyuntop** (`https://api.qingyuntop.top/kling`), que expone los endpoints Kling con key simple `Bearer` — exactamente la vía recomendada en [inventario-api-keys.md](inventario-api-keys.md) §Caveats (evita el contrato enterprise de Kling oficial). La misma key sirve para `QINGYUNTOP_API_KEY`. Por lo tanto **FLF real está disponible** para la cadena de transiciones (a3-a5, a3-a5x, a3-a5y, a3-b4, a3-c0, a3-c2).

- Si la llamada a Kling falla, el fallback a Minimax I2V ya es automático en `generateFlfViaKling()` ([`wind-mcp/src/lib/video.ts`](../../wind-mcp/src/lib/video.ts)) — degrada a solo primer frame con warning.
- Validación pendiente: aprobar cada FLF mirando que el morph efectivamente ocurra; si el gateway no lo soporta en un eslabón, se acepta I2V degradado o corte duro (especialmente a5x experimental).

### Regeneración pendiente de a3-a5 (créditos Qingyun ya cargados)

a3-a5 salió por I2V fallback cuando Kling devolvió "quota insufficient"; ahora hay saldo en el gateway. Regenerar con:

```bash
cd wind-mcp && npm run clips:a3 -- --id a3-a5 --force
```

Requiere wind-comic arriba en modo real (`MOCK_ENGINES=0`). Criterio de aceptación: el log debe mostrar provider `Kling-FLF` (no `Minimax-I2V-fallback`) y el morph primer→último frame de la grieta debe ocurrir. Costo estimado ~¥1. Al aprobar, actualizar la fila de a3-a5 en el checklist de clips.

---

## Recurso híbrido (catalogado, regla en [biblia-visual.md](biblia-visual.md) §1)

Sobrantes del primer e2e (estética cuaderno naturalista, NO canon). Nunca como lock ni firstFrame canónico.

| Archivo | Tipo | Usos (máx 2 en el arco) |
|---|---|---|
| `assets/arco-3/madre/a3-m01-madre-ornitorrinco-hibrid-1.png` | imagen | 0 |
| `assets/arco-3/madre/a3-m01-madre-ornitorrinco-hibrid-2.png` | imagen | 0 |
| `assets/arco-3/clips/a3-a3-madre-ritual-hibrid-1.mp4` | clip | 0 |
| `assets/arco-3/clips/a3-a3-madre-ritual-hibrid-2.mp4` | clip | 0 |

El tope de 2 usos es del **recurso completo** (sumando imágenes y clips), como transición/quiebre suave.
