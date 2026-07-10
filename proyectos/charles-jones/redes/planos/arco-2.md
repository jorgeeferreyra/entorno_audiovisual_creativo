# Arco 2 — Plano a plano (PARCIAL: solo el aporte al reel transversal)

> Bajada de producción del [Arco 2: Charles y la palanca](../arco-2-charles-palanca.md) a **fichas de ingesta** en wind-comic. Es **fuente por hilo** (spec ejecutable), no un entregable.
> **PARCIAL a propósito**: por ahora solo se baja el beat que el reel transversal "La Grieta" necesita (la palanca como contrapunto esperanzador). El resto del hilo (intervenciones menores, el mensaje / lugar blanco → cruce con el Ep.1) se baja cuando le toque el turno de producción (orden 3 → 1 → 2). La coda "es en Rocas Coloradas" queda **diferida** (auditoría §B).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../../biblia-serie.md), STYLE-BLOCK y anclas de estilo en [biblia-visual.md](../../biblia-visual.md), ficha de CFJ en [personajes-studio.md](../../personajes-studio.md), convención de IDs/archivos en [pipeline.md](../../../../metodo/pipeline.md) §5–6.

Convenciones (idénticas a [arco-3.md](arco-3.md)): prompts en inglés con el STYLE-BLOCK embebido literal; títulos/off/montaje en español; el movimiento de cámara va en `cameraPreset`.

Registro del Arco 2: esperanzador, el contrapeso del Arco 1. En el reel entra como **contrapunto** durante "vidas paralelas": la palanca de Charles explica por qué la línea australiana sobrevivió. Se produce en **silueta** (Charles de espaldas): cumple "CFJ nunca de frente" por diseño y evita la guarda anti-manos del quiebre fotorrealista.

## Guion de color (tinte de fondo por beat)

| Beat | Tinte (línea EN del prompt) |
|---|---|
| La palanca (a2-m01, a2-m02, a2-m03, a2-a1) — en el momento de la grieta | `dramatic deep red tinted background` |

---

## Sección 1 — Imágenes madre (generar PRIMERO)

**a2-m01 — Charles de espaldas (silueta con sombrero)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m01-charles-espaldas.png
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
  - assets/fuentes/charles/charles-jones-pintura.jpg
provider: openrouter
```

Nota: aspecto y vestuario canónicos en la ficha CFJ de [personajes-studio.md](../../personajes-studio.md). Regla dura: **nunca de frente** — silueta de espaldas. Las refs (Nano Banana multi-ref) solo aportan identidad/vestuario (sombrero, abrigo, barba, morral); la cara NUNCA se muestra y el estilo NO cambia (silueta recortada).

Prompt (EN):
```
The reference images show an elderly bearded explorer — use them ONLY for identity and wardrobe (wide-brimmed fedora, long expedition coat, satchel, general build), NEVER show his face, NEVER change the art style. Black paper cutout silhouette of the elderly explorer seen strictly from behind, wide-brimmed fedora hat, long expedition coat and a satchel across the back, standing at the edge of a splitting Pangea landscape, face never visible, delicate cut-out inner details in the coat and hat brim, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m02 — El tronco-balancín con el huevo**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m02-tronco-balancin.png
```

Prompt (EN):
```
Black paper cutout silhouette of a fallen log balanced like a seesaw across a widening rift between two landmasses, a single platypus egg resting on one end of the log, silhouetted water in the gap below, delicate cut-out details in the bark and the nest twigs, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m03 — Las manos de Charles levantan a la cría (beat 9.2–9.3)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m03-manos-levantan-cria.png
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
  - assets/fuentes/ornitorrincos/ornitorrinco_crias.jpeg
  - assets/arco-3/madre/a3-m02-ornitorrinco-joven.png
provider: openrouter
```

Nota: multi-ref (Nano Banana). El gesto mínimo del beat 9.3: las manos en silueta de Charles alzan a la cría. Refs: la de Charles solo para identidad de manos/mangas (nunca la cara); `ornitorrinco_crias.jpeg` **solo para la pose** (mano humana sosteniendo una cría) — la cría se dibuja como la silueta del ornitorrinco joven (tercera ref, master), NO un puggle rosado. Silueta de espaldas por diseño: se ven manos y antebrazos, no el rostro.

Prompt (EN):
```
The first reference shows an elderly explorer — use it ONLY for the identity of the hands and coat sleeves (aged rugged hands, worn expedition coat cuffs), NEVER show a face. The second reference shows a human hand gently cupping a small platypus baby — use it ONLY for the pose and gesture of hands lifting a small creature, NEVER for its style or its pink fleshy look. The third reference is the master character — the young platypus: reproduce this exact silhouette style with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. Black paper cutout silhouette scene: two aged silhouetted hands in worn coat cuffs gently cup and lift a small young platypus silhouette just above a fallen log balanced over a rift, the explorer's body only implied at the frame edge from behind with no face visible, the young platypus readable as a small slender silhouette through fine gold etched lines like a woodcut print — never a plain solid blob, never pink, never photographic, tender minimal almost accidental gesture, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

---

## Sección 2 — Desglose plano a plano

**Clip a2-a0 — Charles aparece de espaldas (montaje, sin generación)**

```yaml
kind: montaje
fuente: a2-m01
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: off documental (beat 9.1: aparece Charles, no puede frenar la grieta)
- Montaje: abre el zoom del beat 9 en el reel (durante "vidas paralelas"); still de m01 (silueta de espaldas); corta a `a2-a0b`. El animatic decide si asciende a clip U2V.

**Clip a2-a0b — Las manos levantan a la cría (montaje, sin generación)**

```yaml
kind: montaje
fuente: a2-m03
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: off documental (beat 9.3: un gesto de ternura, casi accidental)
- Montaje: still de m03 (manos alzando la cría); corta a `a2-a1` (el balancín).

**Clip a2-a1 — La palanca: el gesto mínimo (beat 9.4)**

```yaml
kind: video-i2v
firstFrame: a2-m02
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: el mundo de recortes es plano; el movimiento lo pone el balancín, no la cámara.

Motion prompt (EN):
```
A silhouetted hand enters from the frame edge and gently nudges the balanced log, the log tips like a seesaw, the platypus egg rolls slowly to the far end and crosses to the other landmass, hinged paper puppet movement, flat 2D silhouette animation, dramatic deep red tinted background.
```
- Vision-Audit (EN): sceneDescription: `a log balanced like a seesaw over a rift on a deep red tinted background, a platypus egg on one end` · action: `a silhouetted hand tips the log, the egg rolls across to the far side` · mood: `tender, accidental, hopeful`
- Audio: off documental (la palanca) + música tenue
- Montaje: cierra el zoom del beat 9 (`a2-a0` → `a2-a0b` → `a2-a1`) durante "vidas paralelas", entre `a3-b3` y `a3-b4`: el gesto mínimo que mandó la vida al lado que prosperó. La consecuencia (beat 9.6) no tiene plano propio — la resuelve el corte a `a3-b4` (Argentina seca) + off. Off en [arco-2-off.md](arco-2-off.md).
