# Arco 3 — Roadmap de producción

> Documento de **seguimiento** (estados, costos, gates). No duplica prompts ni fichas: la fuente de verdad de los prompts es [arco-3-planos.md](arco-3-planos.md); el STYLE-BLOCK y los quiebres de realidad viven en [biblia-visual.md](biblia-visual.md); la convención de IDs/archivos en [pipeline-wind-comic.md](pipeline-wind-comic.md) §5.
> Comandos: los scripts de `wind-mcp/` leen los prompts directamente de arco-3-planos.md (`wind-mcp/src/lib/planos.ts`) — nunca editar prompts fuera del doc fuente.

Estados: `pendiente` → `generado` (existe el archivo) → `aprobado` (pasó el criterio de su etapa). Se actualiza a mano al avanzar.

---

## Orden de ejecución

1. **Madres** — primero `a3-m01` sola (lock de consistencia), aprobar, y recién ahí las otras 14.
2. **Clips** — solo con madres aprobadas como firstFrame/lastFrame. Gate Kling antes de `a3-a5`.
3. **Montaje reels** — A, B, C (con inserts de montaje: m-mano en a3-a5, foto real en a3-c4).
4. **Stories** — S1–S5 derivadas por recorte, cero generación.

### Paso 1 del end-to-end (próxima acción)

Prerequisito: wind-comic arriba en modo real (`.env.local` ya tiene `MOCK_ENGINES=0` y `MINIMAX_API_KEY`; `PLAN_GATE_DISABLED` va explícito porque está comentado en `.env.local`):

```bash
cd wind-comic && PLAN_GATE_DISABLED=1 npm run dev
```

```bash
cd wind-mcp && npm run madres:a3 -- --id a3-m01
```

Nota: ya existe un candidato manual `a3-m01-madre-ornitorrinco-reiniger.png` (y `a3-m05-pangea-reiniger.png`). Si el candidato pasa el criterio de aprobación de madres, alcanza con renombrarlo al path canónico en lugar de regenerar; si no, se regenera con el comando de arriba.

---

## Criterios de aprobación por etapa

| Etapa | Criterio |
|---|---|
| Madres | Silueta 100% negra (sin pelaje/semi-realismo), fondo tintado del beat correcto (guion de color de [arco-3-planos.md](arco-3-planos.md)), STYLE-BLOCK respetado (salvo m12–m15 que rompen a propósito), 9:16. Personajes distinguibles por contorno. |
| Clips | Arranca 1:1 de su imagen madre, movimiento tipo títere de papel plano (no 3D), tinte estable durante el clip, duración correcta. |
| Reels | Continuidad de tinte entre clips, dosificación de quiebres respetada (ver abajo), audio off sincero sin chistes. |
| Stories | 15s, legibles sin audio, sin generación extra. |

**Dosificación de quiebres (no multiplicar):** el único quiebre de realidad del arco es el par caos→respiro `a3-a5b`/`a3-a5c` en el Reel A. El salto a la realidad del cierre (`a3-c3`/`a3-c4`) es canon propio del Reel C, no un quiebre adicional. El recurso híbrido (abajo) cuenta aparte con su propio tope.

---

## Checklist — Imágenes madre (15 × ~¥0.3 ≈ ¥4.5)

| ID | Título | Estado | Costo real | Nota |
|---|---|---|---|---|
| a3-m01 | Madre ornitorrinco | generado (candidato `-reiniger`, sin aprobar) | — | Lock de consistencia: aprobar PRIMERO |
| a3-m02 | Cría de ornitorrinco | pendiente | — | |
| a3-m03 | Padre ornitorrinco | pendiente | — | |
| a3-m04 | Huevo | pendiente | — | |
| a3-m05 | Paisaje Pangea | generado (candidato `-reiniger`, sin aprobar) | — | |
| a3-m06 | Pangea partida | pendiente | — | lastFrame de a3-a5 (FLF) |
| a3-m07 | Rocas Coloradas | pendiente | — | |
| a3-m08 | Australia próspera | pendiente | — | |
| a3-m09 | Argentina en declive | pendiente | — | |
| a3-m10 | Ornitorrinco sobre roca | pendiente | — | firstFrame de a3-c2 (FLF) |
| a3-m11 | Fósil de piedra | pendiente | — | lastFrame de a3-c2 (FLF) |
| a3-m12 | Página de cuaderno | pendiente | — | Sin STYLE-BLOCK (marco) |
| a3-m13 | Fósil en yacimiento | pendiente | — | Fotográfico (salto a la realidad) |
| a3-m14 | Grieta Revenant | pendiente | — | REALITY-BLOCK-CHAOS |
| a3-m15 | Zoom-out poético | pendiente | — | REALITY-BLOCK-POETIC |

## Checklist — Clips (13 U2V ≈ ¥6.5 + 2 FLF ≈ ¥2)

| ID | Reel | Herramienta | Estado | Costo real | Nota |
|---|---|---|---|---|---|
| a3-a1 | A | U2V | pendiente | — | |
| a3-a2 | A | U2V | pendiente | — | |
| a3-a3 | A | U2V | pendiente | — | El clip híbrido previo NO cuenta como a3-a3 |
| a3-a4 | A | U2V | pendiente | — | |
| a3-a5 | A | U2V-FLF | pendiente | — | **Gate Kling** (ver abajo) |
| a3-a5b | A | U2V | pendiente | — | Quiebre caos (único del reel) |
| a3-a5c | A | U2V | pendiente | — | Quiebre respiro |
| a3-a6 | A | U2V | pendiente | — | |
| a3-b1 | B | U2V | pendiente | — | Pantalla partida con a3-b3 |
| a3-b2 | B | U2V | pendiente | — | |
| a3-b3 | B | U2V | pendiente | — | |
| a3-b4 | B | U2V | pendiente | — | |
| a3-c1 | C | U2V | pendiente | — | |
| a3-c2 | C | U2V-FLF | pendiente | — | **Gate Kling** (ver abajo) |
| a3-c3 | C | U2V | pendiente | — | |
| a3-c4 | C | ninguna | pendiente | — | Solo montaje (foto real) |

## Checklist — Reels y stories (montaje, sin costo de generación)

| Pieza | Fuente | Estado |
|---|---|---|
| Reel A "La grieta" | a3-a1…a3-a6 (+1–2 frames m-mano en a3-a5) | pendiente |
| Reel B "Vidas paralelas" | a3-b1…a3-b4 (pantalla partida) | pendiente |
| Reel C "El último" | a3-c1…a3-c4 | pendiente |
| S1 La familia feliz | a3-a3 + a3-a4 | pendiente |
| S2 La grieta | a3-a5 | pendiente |
| S3 La despedida | a3-a6 | pendiente |
| S4 El declive | a3-b3 (+a3-b4) | pendiente |
| S5 El fósil | a3-c2 + a3-c3 + a3-c4 | pendiente |

---

## Presupuesto (tope ~¥13, tabla en [arco-3-planos.md](arco-3-planos.md) §Costo)

| Etapa | Estimado | Real acumulado |
|---|---|---|
| Madres (15 × ¥0.3) | ~¥4.5 | ¥0 |
| Clips U2V (13 × ¥0.5) | ~¥6.5 | ¥0 |
| Clips FLF (2 × ~¥1) | ~¥2 | ¥0 |
| **Total** | **~¥13** | **¥0** |

Los retries de madres rechazadas suman ~¥0.3 c/u: por eso el gate de aprobación de a3-m01 antes de generar en lote.

---

## Gate Kling (resolver ANTES de generar a3-a5)

`KELING_API_KEY` no está configurada. Decisión tomada: **fallback documentado, se decide al llegar acá** (no bloquea madres ni clips U2V).

- El fallback ya es automático en código (`generateFlfViaKling()` en `wind-mcp/src/lib/video.ts`): sin key, degrada a Minimax I2V con warning — se pierde el morph primer→último frame, que es el efecto clave de las dos transiciones-gancho (a3-a5 grieta, a3-c2 fosilización).
- Opciones al llegar al gate: (a) aceptar el clip degradado si el resultado I2V convence, o (b) conseguir `QINGYUNTOP_API_KEY` (gateway con endpoints Kling, key simple) — ver [inventario-api-keys.md](inventario-api-keys.md), que desaconseja Kling oficial.

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
