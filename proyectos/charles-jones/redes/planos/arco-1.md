# Arco 1 — Plano a plano (PARCIAL: solo el aporte al reel transversal)

> Bajada de producción del [Arco 1: La Mano Negra](../arco-1-mano-negra.md) a **fichas de ingesta** en wind-comic. Es **fuente por hilo** (spec ejecutable), no un entregable.
> **PARCIAL a propósito**: por ahora solo se bajan los beats que el reel transversal "La Grieta" necesita (el reveal de la mano). El hilo completo del Arco 1 (montaje de eras, informe de rentabilidad, logo de la Fundación) se baja cuando le toque el turno de producción (orden 3 → 1 → 2).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../../biblia-serie.md), STYLE-BLOCK y anclas de estilo en [biblia-visual.md](../../biblia-visual.md), convención de IDs/archivos en [pipeline.md](../../../../metodo/pipeline.md) §5–6.

Convenciones (idénticas a [arco-3.md](arco-3.md)): prompts en inglés con el STYLE-BLOCK embebido literal; títulos/off/montaje en español; el movimiento de cámara va en `cameraPreset`.

Registro del Arco 1: conspirativo, humor Les Luthiers seco. En el reel entra como **reveal** justo después del caos de la grieta: la mano con cadenita firmó la fractura de Pangea. En teatro de sombras la mano negra es **nativa del estilo** (una silueta más), así que se produce en silueta, no como quiebre fotorrealista.

## Guion de color (tinte de fondo por beat)

| Beat | Tinte (línea EN del prompt) |
|---|---|
| El reveal (a1-a1) — sobre el caos rojo de la grieta | `dramatic deep red tinted background` |

---

## Sección 1 — Imágenes madre (generar PRIMERO)

**a1-m01 — Mano con cadenita sobre el mapa de Pangea**

```yaml
kind: image
dest: assets/arco-1/madre/a1-m01-mano-cadenita.png
```

Prompt (EN):
```
Black paper cutout silhouette of a man's hand wearing a thick gold chain bracelet around the wrist, resting on an old map of the supercontinent Pangea, a fountain pen held in the fingers about to trace the fracture line across the continent, the gold chain readable as a fine gold etched detail inside the black silhouette, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

---

## Sección 2 — Desglose plano a plano

**Clip a1-a1 — El reveal: la mano firma la grieta**

```yaml
kind: video-i2v
firstFrame: a1-m01
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: el teatro de sombras es plano; el movimiento lo pone la lapicera trazando, no la cámara.

Motion prompt (EN):
```
The silhouetted hand with the gold chain draws the fracture line across the Pangea map with the fountain pen, a slow deliberate stroke splitting the continent in two, the gold chain glinting, hinged paper puppet movement, flat 2D silhouette animation, dramatic deep red tinted background.
```
- Vision-Audit (EN): sceneDescription: `a silhouetted hand with a gold chain over an old Pangea map on a deep red tinted background` · action: `the hand traces the fracture line with a pen, splitting the continent` · mood: `sinister, deliberate, revelatory`
- Audio: off documental (el reveal) + rumble grave residual del caos
- Montaje: entra en el reel "La Grieta" justo después de `a3-a5b` (caos Revenant) como reveal — "no fue un accidente"; corta a `a3-a5c` (respiro). Off en [arco-1-off.md](arco-1-off.md).
