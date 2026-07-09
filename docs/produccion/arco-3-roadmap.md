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

### Próxima acción

**Las 15 madres están aprobadas** (paths canónicos en `assets/arco-3/madre/`). **Reel A:** a3-a1…a3-a3 aprobados; **siguiente = a3-a4** (U2V con firstFrame `a3-m02` recién reaprobada). **Gate Kling resuelto** (FLF real vía gateway qingyuntop, ver abajo): a3-a5 y a3-c2 pueden usar el morph primer→último frame.

```bash
cd wind-comic && PLAN_GATE_DISABLED=1 npm run dev
# Luego: /dashboard/u2v → ficha a3-a4 (firstFrame: a3-m02-cria-ornitorrinco.png)
```

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
| a3-m01 | Madre ornitorrinco | aprobado | ~¥0.3 | Lock de consistencia ✓ |
| a3-m02 | Cría de ornitorrinco | aprobado | ~¥1.2 | Regenerada (STYLE-BLOCK fix); pick c2 — dormida sola en nido, pico/cola/nutria ✓ |
| a3-m03 | Padre ornitorrinco | aprobado | ~¥0.3 | Más angular, muesca en ceja ✓ |
| a3-m04 | Huevo | aprobado | ~¥0.3 | Close-up nido en tronco ✓ |
| a3-m05 | Paisaje Pangea | aprobado | ~¥0.3 | |
| a3-m06 | Pangea partida | aprobado | ~¥0.3 | Grieta roja, agua en el gap ✓ |
| a3-m07 | Rocas Coloradas | aprobado | ~¥0.6 | Retry ×1; capas recorte rojo/naranja ✓ |
| a3-m08 | Australia próspera | aprobado | ~¥0.3 | Verde saturado, humedal ✓ |
| a3-m09 | Argentina en declive | aprobado | ~¥0.3 | Gris frío, tierra agrietada ✓ |
| a3-m10 | Ornitorrinco sobre roca | aprobado | ~¥0.3 | Recostado, rojo atardecer ✓ |
| a3-m11 | Fósil de piedra | aprobado | ~¥0.3 | Relieve fósil, gris piedra ✓ |
| a3-m12 | Apertura cuaderno Charles | aprobado | ~¥0.3 | Intro transversal POV; tapa con pelos ✓ |
| a3-m13 | Fósil en yacimiento | aprobado | ~¥0.3 | Salto realidad clínico ✓ |
| a3-m14 | Grieta Revenant | aprobado | ~¥0.3 | REALITY-BLOCK-CHAOS ✓ |
| a3-m15 | Zoom-out poético | aprobado | ~¥0.6 | Retry ×1; aéreo poético atardecer ✓ |

## Checklist — Clips (13 U2V ≈ ¥6.5 + 2 FLF ≈ ¥2)

| ID | Reel | Herramienta | Estado | Costo real | Nota |
|---|---|---|---|---|---|
| a3-a1 | A | U2V | aprobado | ~¥0.5 | Intro transversal; manos abren cuaderno ✓ |
| a3-a2 | A | U2V | aprobado | ~¥0.5 | Establishing Pangea ✓ |
| a3-a3 | A | U2V | aprobado | ~¥0.5 | Ritual madre; el clip híbrido previo NO cuenta |
| a3-a4 | A | U2V | pendiente | — | Regenerar con m02 nueva (archivo viejo obsoleto) |
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

## Continuidad y QC (vision-audit por clip)

Formaliza el QC que ya se hace informalmente (carpetas `_candidates`/`_audit`). Cada clip aprobado registra acá su chequeo contra los criterios de la etapa Clips (arranca 1:1 de la madre, movimiento títere plano, tinte estable, duración correcta).

**Character Studio (`/dashboard/characters`):** fichas listas en [personajes-studio.md](personajes-studio.md); madres a3-m01/m02/m03 aprobadas. Pendiente: subir los 3 archivos y pegar `imageUrls` (habilita retakes consistentes y reutilización cross-arco).

| Clip | Vision-audit (scene/action/mood) | Contorno OK | Tinte estable | Estado |
|---|---|---|---|---|
| a3-a1 | — | ✓ | ✓ | aprobado |
| a3-a2 | — | ✓ | ✓ | aprobado |
| a3-a3 | — | ✓ | ✓ | aprobado |
| a3-a4…a3-c4 | — | — | — | pendiente |

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
| Madres (15 × ¥0.3) | ~¥4.5 | ~¥6.0 |
| Clips U2V (13 × ¥0.5) | ~¥6.5 | ~¥1.5 |
| Clips FLF (2 × ~¥1) | ~¥2 | ¥0 |
| **Total** | **~¥13** | **~¥7.5** |

Los retries de madres rechazadas suman ~¥0.3 c/u: por eso el gate de aprobación de a3-m01 antes de generar en lote.

---

## Gate Kling — RESUELTO

`KELING_API_KEY` está configurada y `KELING_BASE_URL` apunta al **gateway qingyuntop** (`https://api.qingyuntop.top/kling`), que expone los endpoints Kling con key simple `Bearer` — exactamente la vía recomendada en [inventario-api-keys.md](inventario-api-keys.md) §Caveats (evita el contrato enterprise de Kling oficial). La misma key sirve para `QINGYUNTOP_API_KEY`. Por lo tanto **FLF real está disponible** para las dos transiciones-gancho (a3-a5 grieta, a3-c2 fosilización), donde el morph primer→último frame es el efecto clave.

- Si la llamada a Kling falla, el fallback a Minimax I2V ya es automático en `generateFlfViaKling()` ([`wind-mcp/src/lib/video.ts`](../../wind-mcp/src/lib/video.ts)) — degrada a solo primer frame con warning.
- Validación pendiente: el FLF de Kling nunca se corrió con key real (ver caveat del inventario). Aprobar a3-a5 mirando que el morph efectivamente ocurra; si el gateway no lo soporta, se acepta el I2V degradado o se evalúa otro motor.

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
