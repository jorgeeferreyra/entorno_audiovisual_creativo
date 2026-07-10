# Arco 1 — Plano a plano (PARCIAL: solo el aporte al reel transversal)

> Bajada de producción del [Arco 1: La Mano Negra](../arco-1-mano-negra.md) a **fichas de ingesta** en wind-comic. Es **fuente por hilo** (spec ejecutable), no un entregable.
> **PARCIAL a propósito**: por ahora solo se bajan los beats que el reel transversal "La Grieta" necesita (el reveal de la mano). El hilo completo del Arco 1 (montaje de eras, informe de rentabilidad, logo de la Fundación) se baja cuando le toque el turno de producción (orden 3 → 1 → 2).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../../biblia-serie.md), STYLE-BLOCK y anclas de estilo en [biblia-visual.md](../../biblia-visual.md), convención de IDs/archivos en [pipeline.md](../../../../metodo/pipeline.md) §5–6.

Convenciones (idénticas a [arco-3.md](arco-3.md)): prompts en inglés con el STYLE-BLOCK embebido literal; títulos/off/montaje en español; el movimiento de cámara va en `cameraPreset`.

Registro del Arco 1: conspirativo, humor Les Luthiers seco. En el reel entra como **reveal** justo después del caos de la grieta: la mano con cadenita **firma el informe** que aprueba la fractura (gag burocrático — no mapa cartográfico). En teatro de sombras la mano negra es **nativa del estilo** (una silueta más), así que se produce en silueta Lotte Reiniger, no como quiebre fotorrealista.

## Guion de color (tinte de fondo por beat)

| Beat | Tinte (línea EN del prompt) |
|---|---|
| El reveal (a1-a1) — sobre el caos rojo de la grieta | `dramatic deep red tinted background` |

---

## Sección 1 — Imágenes madre (generar PRIMERO)

**a1-m01 — Mano con cadenita firma el informe (gag burocrático)**

```yaml
kind: image
dest: assets/arco-1/madre/a1-m01-mano-cadenita.png
```

Nota: Pick canónico: `a1-m01-c3` → `a1-m01-mano-cadenita.png`. **decisión de dirección** — se abandona el mapa de Pangea (el modelo no lo dibuja bien ni coloca la grieta). Reveal = gag Les Luthiers: papel **limpio** con un solo titular legible — **"DOS CONTINENTES SE VENDEN MEJOR QUE UNO"** — y sello **"APROBADO"**; la mano con cadenita firma abajo. Sin grids, sin charts, sin pseudo-texto. La geografía de la grieta ya la cargan `a3-m05`/`a3-m06`/`a3-a5b`; acá solo el **quién** + la frase. Registro **Lotte Reiniger** estricto (recorte de papel, filigrana de tijera).

Prompt (EN):
```
Black paper cutout silhouette of a man's hand and forearm wearing a thick gold chain bracelet around the wrist, holding a fountain pen and signing the bottom of ONE clean single sheet of aged paper on a desk — the sheet is mostly empty white/cream space with ONLY two pieces of printed text in clear Spanish capital letters: the large headline "DOS CONTINENTES SE VENDEN MEJOR QUE UNO" centered near the top, and a circular rubber stamp mark reading "APROBADO" below it; NO other text, NO grids, NO charts, NO columns, NO pseudo-text, NO gibberish, NO world map, NO continents, NO geography; a small rubber stamp and inkwell as black silhouette props beside the sheet; the gold chain readable as fine gold etched filigree inside the black silhouette, fine intricate lace-like hand-cut paper detail — NOT flat vector shapes, in the manner of Lotte Reiniger's Die Abenteuer des Prinzen Achmed, flat 2D layered paper theater, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

---

## Sección 2 — Desglose plano a plano

**Clip a1-a1 — El reveal: la mano firma el informe**

```yaml
kind: video-i2v
firstFrame: a1-m01
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: el teatro de sombras es plano; el movimiento lo pone la lapicera firmando, no la cámara.

Motion prompt (EN):
```
The silhouetted hand with the gold chain slowly signs the bottom of the clean single sheet with the fountain pen, a deliberate dry stroke, the gold chain glinting, hinged paper puppet movement, flat 2D silhouette animation, dramatic deep red tinted background.
```
- Vision-Audit (EN): sceneDescription: `a silhouetted hand with a gold chain signing a clean sheet whose headline reads DOS CONTINENTES SE VENDEN MEJOR QUE UNO with an APROBADO stamp, on a deep red tinted background` · action: `the hand signs the report with a fountain pen` · mood: `sinister, bureaucratic, dryly comic, revelatory`
- Audio: off documental (el reveal) + rumble grave residual del caos
- Montaje: entra en el reel "La Grieta" justo después de `a3-a5b` (caos Revenant) como reveal — "no fue un accidente"; corta a `a3-a5c` (respiro). Off en [arco-1-off.md](arco-1-off.md).
