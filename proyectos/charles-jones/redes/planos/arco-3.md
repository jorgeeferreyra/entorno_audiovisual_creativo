# Arco 3 — Plano a plano listo para producir

> Bajada de producción del [Arco 3: Ornitorrincos](../arco-3-ornitorrincos.md) a **fichas de ingesta directa** en wind-comic (campos 1:1 con la UI). Es **fuente por hilo** (spec ejecutable), no un entregable.
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../../biblia-serie.md), anclas de estilo y STYLE-BLOCK en [biblia-visual.md](../../biblia-visual.md), plantillas y convención de IDs/archivos en [pipeline-wind-comic.md](../../../../metodo/pipeline.md) §5–6, fichas de personaje en [personajes-studio.md](../../personajes-studio.md).
> Este archivo es la fuente de verdad de los **prompts finales de producción** del Arco 3.

Convenciones de este archivo:

- Prompts e inputs de modelo **en inglés**; títulos, audio y montaje en español.
- El STYLE-BLOCK de [biblia-visual.md](../../biblia-visual.md) §1 va embebido literal en cada prompt de imagen (duplicación aceptada para copiar-pegar).
- El movimiento de cámara va en el campo **cameraPreset** (12 presets operativos de `/dashboard/u2v`), nunca repetido en el motion prompt; si no hay preset equivalente, se describe en el prompt y el preset queda vacío (el motor agrega un push-in sutil por defecto, compatible). Qué preset se permite según el registro (silueta plana vs. quiebre fotorrealista): [paleta de cámara](../../biblia-visual.md) §1.
- Registro del arco: **Attenborough sincero**, sin chistes verbales. El humor es estructural (solemnidad extrema aplicada a ornitorrincos… ahora en teatro de sombras).
- Estilo del arco: **siluetas recortadas estilo Lotte Reiniger sobre fondos tintados** (ref. *El príncipe Achmed*). Las siluetas siempre son negras; el color vive en el tinte del fondo según el guion de color de abajo.

## Guion de color (tinte de fondo por beat)

La emoción de cada plano la carga el **tinte del fondo**, no el animal. Cada prompt embebe su línea de tinte:

| Beat | Tinte (línea EN del prompt) |
|---|---|
| Bloque A — Pangea feliz (a1–a4) | `warm amber and saturated green tinted background` |
| Bloque A — La grieta (a5–a6) | vira a `dramatic deep red tinted background` |
| Bloque B — Australia próspera (b1–b2) | `saturated lush green tinted background` |
| Bloque B — Argentina en declive (b3–b4) | `cold desaturated grey tinted background` |
| Bloque C — Rocas Coloradas (c1) | `deep red dusk tinted background` |
| Bloque C — Fosilización (c2) | el tinte rojo se apaga hacia `stone grey` |
| Bloque C — Salto a la realidad (c3–c4) | sin tinte: registro fotográfico real |

---

## Sección 1 — Imágenes madre (generar PRIMERO)

Generar cada una en wind-comic (Flux/Minimax, o preview-shot en `/dashboard/create` con video apagado), elegir la mejor y guardarla con su **archivo destino** (convención en [pipeline-wind-comic.md](../../../../metodo/pipeline.md) §5). Ese archivo es lo que se sube como `firstFrame`/`lastFrame` en los clips de la Sección 2.

Campos fijos de todas las fichas (salvo indicación): `style: Woodcut Print` (preset más cercano de la galería: `bold black lines, high contrast, textured paper` — compatible con silueta; el look real lo carga el prompt) · `aspect: 9:16`.

### Personajes (una imagen madre por animal — lock de consistencia)

> La distinción entre animales es **por contorno** (tamaño, postura, muescas del recorte), no por pelaje: es lo único legible en silueta y lo más fácil de mantener consistente.

**a3-m01 — Madre ornitorrinco**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m01-madre-ornitorrinco.png
```

Prompt (EN):
```
Black paper cutout silhouette of a mother platypus in expressive side profile, rounded gentle contour, head slightly tilted, resting among silhouetted Pangea ferns, warm amber and saturated green tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m02 — Ornitorrinco joven**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m02-ornitorrinco-joven.png
ref: a3-m01
anatomyRefs:
  - assets/fuentes/ornitorrincos/ornitorrinco.png
  - assets/fuentes/ornitorrincos/ornitorrincos-dibujo.png
provider: openrouter
```

Nota: reemplaza el concepto "cría bebé" (eliminado). Nano Banana: fidelidad 100% al estilo de m01. Escala **mucho más chica** en el frame + pose **panza arriba** (belly-up / on its back).

Prompt (EN):
```
The first reference image is the master character: reproduce this exact platypus silhouette with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. The other reference images show real platypus anatomy — use them only to keep the anatomy true (flat duck bill with nostrils, no ears, webbed feet, beaver tail), never to change the art style. Younger version of the same character, much smaller in the frame (occupies roughly one-third of the height, not filling the center), lying belly-up on its back among silhouetted Pangea ferns and fiddleheads — belly facing the sky, back against the ground, paddle tail and webbed feet visible in the belly-up pose, playful resting attitude, every feature readable inside the black silhouette through fine gold etched lines like a woodcut print — never a plain solid blob: (1) wide flat duck bill clearly separated from the head by an etched line, (2) two small etched nostril dots on top of the bill near the tip, (3) one almond-shaped eye outlined in thin light etched line, (4) broad flat beaver-like paddle tail with cross-hatched fur texture and short fur strokes etched along the body, (5) webbed duck-like feet with etched toe lines claws and clear webbing, flat 2D paper cutout not felt not 3D not plush not photorealistic, warm amber and saturated green tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m03 — Padre ornitorrinco**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m03-padre-ornitorrinco.png
ref: a3-m01
anatomyRefs:
  - assets/fuentes/ornitorrincos/ornitorrinco.png
  - assets/fuentes/ornitorrincos/ornitorrincos-dibujo.png
provider: openrouter
```

Nota: regenerar — fidelidad 100% a m01; más fornido; **en 4 patas** a la orilla de un lago.

Prompt (EN):
```
The first reference image is the master character: reproduce this exact platypus silhouette with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. The other reference images show real platypus anatomy and posture — use them for a true quadruped stance on all four legs and lake-shore habitat, never to change the art style. Adult male version of the same character, bulkier and more muscular (thicker neck, broader chest and shoulders, heavier body), distinctive notch cut into the brow outline, standing on all four short legs in side profile facing left at the edge of a silhouetted lake — water and reeds in cutout layers at the shore, every feature readable inside the black silhouette through fine gold etched lines like a woodcut print — never a plain solid blob, never upright or sitting on hind legs: (1) wide flat duck bill clearly separated from the head by an etched line, (2) two small etched nostril dots on top of the bill near the tip, (3) one almond-shaped eye outlined in thin light etched line high on the head near the bill base, (4) broad flat beaver-like paddle tail with cross-hatched fur texture and short fur strokes etched along the back and chest, (5) all four webbed duck-like feet planted on the ground with etched toe lines claws and clear webbing, flat 2D paper cutout not felt not 3D not plush not photorealistic, warm amber and saturated green tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m04 — Huevo de ornitorrinco**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m04-huevo.png
```

Prompt (EN):
```
Black paper cutout silhouette of a single egg resting in a small nest on a mossy log, close-up, delicate cut-out details in the nest twigs, warm amber tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Locaciones / ambientes

> Paisajes en **capas de recorte** (siluetas de foreground sobre fondo tintado), como los sets multiplano de Reiniger.

**a3-m05 — Paisaje Pangea (establishing, transversal)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m05-pangea.png
```

Prompt (EN):
```
Layered black paper cutout landscape of the supercontinent Pangea seen from a hill, silhouetted exuberant vegetation and hills in stacked cutout layers, warm amber and saturated green tinted background sky, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m06 — Paisaje Pangea partido (la grieta abierta)** — último frame del clip FLF `a3-a5`.

```yaml
kind: image
dest: assets/arco-3/madre/a3-m06-pangea-partida.png
ref: a3-m05
```

Prompt (EN):
```
The same layered paper cutout Pangea landscape now torn apart by a deep widening rift, the black cutout land split in two like ripped paper, silhouetted water rising in the gap, dramatic deep red tinted background sky, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m07 — Rocas Coloradas (puente con la locación real, transversal)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m07-rocas-coloradas.png
```

Prompt (EN):
```
Layered black paper cutout landscape of Martian-like rock formations and lagoons, Patagonian badlands in stacked silhouette layers, deep red and orange tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m08 — Ambiente Australia próspera**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m08-australia-prospera.png
```

Prompt (EN):
```
Layered black paper cutout landscape of a thriving wetland, silhouetted reeds, water plants and gentle ripples in delicate cut-out detail, saturated lush green tinted background, warm prosperous glow, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m09 — Ambiente Argentina en declive**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m09-argentina-declive.png
```

Prompt (EN):
```
Layered black paper cutout landscape of an arid drying plain, silhouetted cracked earth lines and sparse withered plants, cold desaturated grey tinted background, fading light, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Par de fosilización (primer + último frame del clip FLF `a3-c2`)

> Dirección de referencia invertida: **m11 (aprobada) es la madre padre**; m10 se regenera heredando su encuadre. Así el FLF a3-c2 queda garantizado sin tocar m11.

**a3-m10 — Ornitorrinco recostado sobre roca colorada**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m10-ornitorrinco-roca.png
ref: a3-m01
anatomyRefs:
  - assets/arco-3/madre/a3-m07-rocas-coloradas.png
  - assets/fuentes/ornitorrincos/ornitorrinco.png
provider: openrouter
```

Nota: aprobada — pick c3 (madre moribunda sobre roca junto al agua). El c1 del mismo lote pasó a ser el encuadre de a3-m18 (joven moribundo).

Prompt (EN):
```
The first reference image is the master character — the mother platypus: reproduce this exact silhouette with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. The second reference image is the world: layered flat paper cutout red rock formations of the Coloradas badlands — reproduce that exact flat 2D cutout landscape style, stacked silhouette layers on a tinted paper background. The third reference shows real platypus anatomy — use only to keep anatomy true, never the style. The mother platypus utterly exhausted, sprawled flat on the ground on top of a silhouetted red rock, body slumped and spread out, head resting low, limbs splayed loosely, drained of strength, every feature readable inside the black silhouette through fine gold etched lines like a woodcut print — never a plain solid blob: (1) wide flat duck bill clearly separated from the head by an etched line, (2) two small etched nostril dots on top of the bill near the tip, (3) one almond-shaped eye outlined in thin light etched line, half closed with fatigue, (4) broad flat beaver-like paddle tail with cross-hatched fur texture lying flat and limp, short fur strokes etched along the back, (5) webbed duck-like feet with etched toe lines splayed loosely, ABSOLUTELY NO photographic textures, no real stone, no 3D relief, no photograph elements anywhere — the entire image is flat 2D paper cutout layers only, deep red dusk tinted background of the Coloradas rock world, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m11 — Fósil de piedra**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m11-fosil-piedra.png
```

Nota: aprobada y querida — NO regenerar. Es la madre padre del par; m10 hereda su encuadre vía Ref.

Prompt (EN):
```
The same platypus silhouette now frozen and filled with stone texture, a fossil relief embedded in the silhouetted red rock, fine cut-out bone detail inside the contour, the red tint of the background fading to stone grey, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Recurso de marco (transversal — intro de TODOS los reels)

**a3-m12 — Apertura: cuaderno de Charles**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m12-pagina-cuaderno.png
styleBlock: false
```

Prompt (EN):
```
First-person subjective POV looking down, weathered explorer hands gripping and beginning to open a rugged hardbound field journal, cover made of worn animal hide with bristly hair-like texture, embossed title clearly reading Charles Francis Jones, warm sepia expedition light, aged yellowed pages barely visible inside, intimate mysterious mood, vertical 9:16
```

### Salto a la realidad (rompe la estética silueta A PROPÓSITO)

**a3-m13 — Fósil en el yacimiento actual**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m13-fosil-yacimiento.png
styleBlock: false # Photographic documentary: registro real, no silueta
```

Prompt (EN):
```
A platypus fossil embedded in reddish rock at a present-day paleontological site in the Patagonian badlands, photographic documentary realism, natural daylight, fine mineral detail, realistic stone textures, no illustration, no silhouette, no paper texture, vertical 9:16
```

### Quiebre de realidad — la grieta (rompe la estética silueta A PROPÓSITO)

> Par caos→respiro del recurso "quiebres de realidad" ([biblia-visual.md](../../biblia-visual.md) §1). Guardas anti-error aplicadas: sin personas ni animales en cuadro, el motion blur y el polvo como escudo de artefactos.

**a3-m14 — Grieta Revenant caótica**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m14-grieta-revenant.png
styleBlock: false # Photographic documentary: embebe el REALITY-BLOCK-CHAOS
```

Prompt (EN):
```
Real earth tearing apart into a massive widening rift seen from ground level, cracked ground collapsing, rocks falling into the chasm, no people, no animals, handheld unstable camera, violent motion, heavy motion blur, dust and debris in the air, natural overcast light, cold muted earth tones, photorealistic, gritty documentary realism inspired by The Revenant, no illustration, no silhouette, no paper texture, vertical 9:16
```

**a3-m15 — Zoom-out aéreo poético (continentes separados)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m15-zoomout-poetico.png
styleBlock: false # Photographic documentary: embebe el REALITY-BLOCK-POETIC
```

Prompt (EN):
```
Two vast green landmasses already separated by a calm sea channel seen from very high above, lush vegetation fading into haze, wide aerial establishing shot, golden dusk light, immense scale, stillness, photorealistic documentary realism, natural atmospheric haze, no illustration, no silhouette, no paper texture, vertical 9:16
```

### Pares de keyframes agregados (regla de secuencia multi-madre, [biblia-visual.md](../../biblia-visual.md) §3)

> Cada madre nueva forma **par** con una existente (mismo encuadre y composición, solo cambia el estado) para dar al clip FLF sus dos keyframes aprobados.
> `a3-m16` (caminata hacia la roca) **eliminada**: con m10 reencuadrada al fósil, un plano de caminata no comparte encuadre; a3-c1 pasa a U2V simple sobre m07.

**a3-m17 — Argentina seca (estado final)** — último frame del clip FLF `a3-b4`; par con a3-m09 (primer frame).

```yaml
kind: image
dest: assets/arco-3/madre/a3-m17-argentina-seca.png
ref: a3-m09
```

Nota: misma composición y capas que a3-m09; el mismo paisaje totalmente seco, más agrietado y oscuro. Pendiente — generar para el FLF a3-b4.

Prompt (EN):
```
The same layered paper cutout arid plain now fully parched, dense deep crack lines spread across the cutout ground, the paper plants wilted and folded down, the cold desaturated grey tinted background darker and dimmer, almost lightless, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m18 — Ornitorrinco joven muriendo sobre roca colorada** — escena hermana de m10 (candidato c1 del lote de m10, con el personaje joven).

```yaml
kind: image
dest: assets/arco-3/madre/a3-m18-joven-roca.png
ref: a3-m02
anatomyRefs:
  - assets/arco-3/madre/a3-m07-rocas-coloradas.png
  - assets/fuentes/ornitorrincos/ornitorrinco.png
provider: openrouter
```

Nota: aprobada — pick c2 (joven pequeño en la cornisa, cabeza colgando). Escena hermana de m10-c1 descrita en el prompt; NO pasar m10-c1 como ref (el modelo copia el adulto tal cual).

Prompt (EN):
```
The first reference image is the master character — the YOUNG platypus: reproduce this exact silhouette style with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. The second reference image is the world: layered flat paper cutout red rock formations of the Coloradas badlands — reproduce that exact flat 2D cutout landscape style, stacked silhouette layers on a tinted paper background. The third reference shows real platypus anatomy — use only to keep anatomy true, never the style. Scene: a flat paper cutout red rock ledge juts out over a deep canyon with a river far below, a large pale yellow sun hangs in the red dusk sky above; the YOUNG platypus is dying of exhaustion on that ledge — a SMALL fragile figure, its body covering only about half the ledge with bare red rock visible around it, slim body, sleek fur, sprawled flat and limp, head drooping low over the edge of the rock, limbs splayed loosely, every feature readable inside the black silhouette through fine gold etched lines like a woodcut print — never a plain solid blob: (1) wide flat duck bill clearly separated from the head by an etched line, (2) two small etched nostril dots on top of the bill near the tip, (3) one almond-shaped eye outlined in thin light etched line, half closed and fading, (4) broad flat beaver-like paddle tail with cross-hatched fur texture lying limp, (5) webbed duck-like feet with etched toe lines splayed loosely, ABSOLUTELY NO photographic textures, no real stone, no 3D relief — the entire image is flat 2D paper cutout layers only, deep red dusk tinted background of the Coloradas rock world, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Beat 8 — La separación (quién quedó de cada lado)

> Zoom-in del beat 8 de la [cadena narrativa](../reels/la-grieta/cadena-narrativa.md): el slot único `a3-a6` no leía "unos de un lado, otros del otro". Se bajan dos madres nuevas que se montan como stills (fichas `a3-a6a`/`a3-a6b` en la Sección 2) antes del `a3-a6` (la despedida). Tinte del bloque a5–a6: `dramatic deep red tinted background`.

**a3-m19 — Plano ancho de la separación (8.1)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m19-separacion-ancha.png
ref: a3-m06
```

Nota: hereda el mundo partido de m06 (grieta roja, agua en el gap). Plano ancho a nivel de suelo: las dos orillas ya separadas, sin personajes legibles todavía (los pone m20).

Prompt (EN):
```
The reference image is the world: the same split Pangea landscape with a red glowing fracture and water filling the gap — reproduce that exact flat 2D paper cutout landscape style, stacked silhouette layers on a tinted paper background. Wide ground-level establishing shot of the two shores now fully separated by a widening sea channel, the near shore in the foreground and the far shore across the water, layered cutout cliffs and silhouetted Pangea ferns on both edges, empty of characters, the scale of the divide readable, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m20 — Plano de lectura: la familia repartida (8.2)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m20-familia-repartida.png
ref: a3-m01
anatomyRefs:
  - assets/fuentes/ornitorrincos/ornitorrincos-dibujo.png
provider: openrouter
```

Nota: multi-ref (Nano Banana, mismo patrón que m02/m03/m10). Lectura clara "unos de un lado, otros del otro": madre + cría en la orilla cercana (lado que será Argentina), padre + huevo en la orilla lejana (lado que será Australia). Distinción por contorno: madre redondeada, cría más chica, padre fornido con la muesca de la ceja. La lámina ilustrada mantiene la anatomía sin arrastrar a fotorrealismo.

Prompt (EN):
```
The first reference image is the master character — the mother platypus: reproduce this exact platypus silhouette style with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. The other reference image is an illustrated plate of several platypuses — use it only to keep the anatomy true (flat duck bill, no ears, webbed feet, beaver tail) and to vary the poses, never to change the art style. Reading shot of a family of platypuses split across a widening rift: on the near shore, an adult mother platypus with a rounded gentle contour beside a much smaller slender young platypus; across the water on the far shore, a bulkier male platypus with a distinctive notch cut into the brow outline standing next to a single platypus egg in a nest of twigs; the red glowing sea channel separating the two shores clearly in the middle of the frame, each figure readable by its silhouette contour, every feature readable inside the black silhouettes through fine gold etched lines like a woodcut print — never plain solid blobs, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Variaciones (unicidad por escena — madres variations)

> Instancia del paso 1.5 del [pipeline](../../../../metodo/pipeline.md) §2 y de la regla 7 de [biblia-visual.md](../../biblia-visual.md) §3. **Toda reutilización de una madre en pantalla dispara una variación**: la primera aparición usa la base, cada aparición siguiente usa una variación derivada (`ref:` a la base + Nano Banana, `provider: openrouter`) que cambia solo pose/encuadre/estado y el tinte del beat destino, con fidelidad 100% al estilo. **Exentas** (la repetición ES el mecanismo): el keyframe compartido de una cadena FLF (`a3-m14` en a5x→a5b, `a3-m07` en c0→c1) y el eco deliberado (`a3-m09` en `a3-c3e`).

| Variación | Madre base | Reemplaza en | Delta |
|---|---|---|---|
| `a3-m01v1` | `a3-m01` | `a3-a6` (la despedida) | Madre al borde de la grieta, tinte rojo profundo |
| `a3-m01v2` | `a3-m01` | `a3-b3` (la madre en declive) | Madre debilitada en llanura agrietada, tinte gris frío |
| `a3-m05v1` | `a3-m05` | `a3-a5` (firstFrame del FLF) | Pangea un beat antes del quiebre; **mismo encuadre que m05/m06** (integridad del par FLF), delta de estado |
| `a3-m14v1` | `a3-m14` | `a3-c0` (firstFrame del FLF) | Grieta real con el polvo asentándose; encuadre compatible con el morph a m07 |
| `a3-m15v1` | `a3-m15` | `a3-a5y` (firstFrame del FLF) | Aéreo con encuadre que baja hacia el humedal; compatible con el morph a m08 |

**a3-m01v1 — Madre al borde de la grieta (variación para a3-a6)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m01v1-madre-borde-grieta.png
ref: a3-m01
anatomyRefs:
  - assets/fuentes/ornitorrincos/ornitorrinco.png
provider: openrouter
```

Prompt (EN):
```
The first reference image is the master character — the mother platypus: reproduce this exact silhouette with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. The other reference image shows real platypus anatomy — use it only to keep the anatomy true, never to change the art style. The same mother platypus standing at the very edge of a layered cutout chasm in side profile, head lowered, looking across a red glowing sea channel to the far shore, silhouetted ferns trembling around her, grief held in stillness, every feature readable inside the black silhouette through fine gold etched lines like a woodcut print — never a plain solid blob, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m01v2 — Madre debilitada en la llanura seca (variación para a3-b3)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m01v2-madre-llanura-seca.png
ref: a3-m01
anatomyRefs:
  - assets/fuentes/ornitorrincos/ornitorrinco.png
provider: openrouter
```

Prompt (EN):
```
The first reference image is the master character — the mother platypus: reproduce this exact silhouette with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. The other reference image shows real platypus anatomy — use it only to keep the anatomy true, never to change the art style. The same mother platypus weakened and moving slowly across a silhouetted cracked drying plain in side profile, head hanging low, halting exhausted posture, silhouetted withered plants and spreading crack lines around her, every feature readable inside the black silhouette through fine gold etched lines like a woodcut print — never a plain solid blob, cold desaturated grey tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m05v1 — Pangea antes del quiebre (variación para a3-a5)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m05v1-pangea-pre-quiebre.png
ref: a3-m05
provider: openrouter
```

Nota: firstFrame del clip FLF `a3-a5` (→ m06). **Mismo encuadre exacto que m05/m06** para que el morph a m06 quede garantizado; el delta es de estado (la calma tensa previa al quiebre), no de encuadre.

Prompt (EN):
```
The reference image is the world: the same layered paper cutout Pangea landscape seen from a hill — reproduce that exact flat 2D cutout landscape style and identical framing, stacked silhouette layers on a tinted paper background. Hold the same composition as the base but a beat before the catastrophe: the silhouetted vegetation stilled, an ominous tension in the air, the light beginning to dim, the warm amber and saturated green tinted background just starting to bruise toward red at the edges, no rift yet, flat 2D silhouette animation, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m14v1 — Grieta real, polvo asentándose (variación para a3-c0)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m14v1-grieta-polvo.png
ref: a3-m14
provider: openrouter
styleBlock: false # Photographic documentary: hereda el REALITY-BLOCK-CHAOS de m14
```

Nota: firstFrame del clip FLF `a3-c0` (→ m07). Encuadre de la grieta compatible con el morph al cuento rojo de m07.

Prompt (EN):
```
The reference image is the world: the same real earth rift seen from ground level — reproduce that exact photorealistic gritty documentary look and framing. The same massive chasm in a held, settling moment: falling debris coming to rest, dust hanging and thinning in the air, the collapse stilled just before it freezes over, no people, no animals, natural overcast light, cold muted earth tones, photorealistic, gritty documentary realism inspired by The Revenant, no illustration, no silhouette, no paper texture, vertical 9:16
```

**a3-m15v1 — Aéreo hacia el humedal (variación para a3-a5y)**

```yaml
kind: image
dest: assets/arco-3/madre/a3-m15v1-aereo-humedal.png
ref: a3-m15
provider: openrouter
styleBlock: false # Photographic documentary: hereda el REALITY-BLOCK-POETIC de m15
```

Nota: firstFrame del clip FLF `a3-a5y` (→ m08). Encuadre aéreo que enmarca la orilla cercana para que el morph asiente en el humedal de m08.

Prompt (EN):
```
The reference image is the world: the same high aerial view of two vast green landmasses separated by a calm sea channel — reproduce that exact photorealistic documentary look and framing. Hold the same wide aerial composition but frame the near landmass to fill more of the lower frame so it can settle into a wetland, golden dusk light softening, atmospheric haze thickening slightly, immense stillness, photorealistic documentary realism, natural atmospheric haze, no illustration, no silhouette, no paper texture, vertical 9:16
```

### Material de origen real (NO se genera)

- **ornitorrincos/** — referencias de anatomía (composite panel derecho para m02/m03/m10):
  - `ornitorrincos/ornitorrinco.png` — **PRIMARIA** (perfil bajo, fondo blanco; AnatomyRef canónica)
  - `ornitorrincos/ornitorrinco_parado.png` — secundaria (pose más erguida)
  - `ornitorrincos/ornitorrincos-dibujo.png` — lámina ilustrada de perfil (alternativa si foto arrastra a fotorrealismo; **AnatomyRef de a3-m20**, familia repartida)
  - `ornitorrincos/cria-ornitorrinco.jpg` — madre + puggles (NO target; puggles rosados eliminados del concepto m02)
  - `ornitorrincos/ornitorrinco_crias.jpeg` — mano humana sosteniendo una cría; **ref de pose** de `a2-m03` (Charles levanta la cría, beat 9.3) — solo el gesto y la anatomía, la cría se dibuja como la silueta joven, no un puggle rosado
- **charles/** — `charles-jones-referencia.jpeg`, `charles-jones-pintura.jpg`
- **rocas-coloradas-real** — `assets/fuentes/rocas-coloradas-real.jpg` (16:9; reencuadrar a 9:16 en montaje para a3-c4)
- **m-mano (reutilizada del Arco 1)** — imagen madre "mano con cadenita" de [biblia-visual.md](../../biblia-visual.md) §Arco 1. NO se genera nueva; se insertan 1–2 frames en montaje de `a3-a5`.

---

## Sección 2 — Desglose plano a plano (fichas U2V / U2V-FLF)

Regla del [pipeline](../../../../metodo/pipeline.md): **un personaje por clip**, cruces por corte. Herramienta: `/dashboard/u2v` (U2V con 5/6s va por Minimax I2V; U2V-FLF va por Kling y **solo acepta 5 o 10s**). Audio por defecto de todo el arco: **off documental (Attenborough) grabado propio** + música suave sin percusión. El texto literal del off por clip vive en [arco-3-off.md](arco-3-off.md) (fuente única de la locución).

### Bloque A — "La grieta" (~45s)

**Clip a3-a1 — Apertura: página de cuaderno (intro transversal)**

```yaml
kind: video-i2v
firstFrame: a3-m12
cameraPreset: push-in
duration: 5
```

Motion prompt (EN):
```
Weathered explorer hands open the rugged hairy hardbound journal titled Charles Francis Jones, camera pushes in tight onto the aged yellowed pages inside, a brilliant golden-white light floods the paper growing brighter and brighter until the frame washes out to pure white for a transition.
```
- Vision-Audit (EN): sceneDescription: `subjective POV opening a rugged field journal then pushing into its aged pages` · action: `hands open the cover, camera zooms into pages, blinding light overexposes to white` · mood: `intimate, mysterious, luminous transition`
- Audio: off documental (intro) + música tenue
- Montaje: intro transversal — abre TODOS los reels; el white-out final enmascara el corte al primer plano del reel (sin fade extra)

**Clip a3-a2 — Establishing Pangea**

```yaml
kind: video-i2v
firstFrame: a3-m05
duration: 5
```

cameraPreset: — (el drift aéreo no tiene preset; va en el prompt)

Motion prompt (EN):
```
Gentle drift across the layered paper cutout Pangea landscape, silhouetted vegetation swaying like paper in a breeze, cutout layers sliding in parallax, flat 2D silhouette animation, amber and green tinted background.
```
- Vision-Audit (EN): sceneDescription: `wide layered silhouette view of the Pangea supercontinent on a tinted background` · action: `slow glide across the cutout landscape, paper vegetation swaying, layers in parallax` · mood: `majestic, serene`
- Audio: off documental + música tenue
- Montaje: viene de a3-a1; corta a a3-a3

**Clip a3-a3 — La madre en su ritual cotidiano**

```yaml
kind: video-i2v
firstFrame: a3-m01
cameraPreset: locked-tripod
duration: 5
```

Motion prompt (EN):
```
The mother platypus silhouette calmly grooming by a silhouetted stream, head tilting gently in profile, hinged paper puppet movement, flat 2D silhouette animation, tender everyday ritual, warm amber and green tinted background.
```
- Vision-Audit (EN): sceneDescription: `silhouetted stream in Pangea on a warm tinted background` · action: `the mother platypus silhouette grooms and moves calmly in profile` · mood: `tender, serene`
- Audio: off documental (presenta la familia)
- Montaje: intercut con a3-a4 para dar "familia unida" sin generarlos juntos

**Clip a3-a4 — El huevo (beat familiar)**

```yaml
kind: video-i2v
firstFrame: a3-m04
cameraPreset: locked-tripod
duration: 5
```

Motion prompt (EN):
```
The single egg silhouette rests in the small nest on the mossy log, soft breathing of the nest twigs, faint warm light shift across the cutout, hinged paper puppet stillness, flat 2D silhouette animation, warm amber and green tinted background.
```
- Vision-Audit (EN): sceneDescription: `egg silhouette resting in a twig nest on a warm tinted background` · action: `the nest breathes softly, light shifts gently` · mood: `warm, expectant, peaceful`
- Audio: off documental (continúa)
- Montaje: intercut con a3-a3; cierra el bloque "unidad" (madre + huevo) y corta a a3-a5. El concepto cría bebé quedó eliminado; el joven aparece en el Bloque B.

**Clip a3-a5 — La grieta (transición-gancho)**

```yaml
kind: video-flf
firstFrame: a3-m05v1
lastFrame: a3-m06
duration: 5
```

cameraPreset: — (el teatro de sombras es plano: el temblor va descripto en el prompt, no como cámara en mano). FLF no acepta 6s.

Motion prompt (EN):
```
The layered cutout Pangea landscape trembles like shaken paper, the black cutout land tears apart as if ripped in two, silhouetted water floods the widening chasm, the background tint shifting from warm amber to deep red, flat 2D silhouette animation, dramatic and sincere.
```
- Vision-Audit (EN): sceneDescription: `the layered cutout Pangea landscape breaking apart, tint shifting to red` · action: `the cutout ground trembles and rips in two, water floods the chasm` · mood: `dramatic, ominous`
- Audio: off documental (el quiebre) + rumble grave
- Montaje: insertar 1–2 frames subliminales de m-mano (mano con cadenita, Arco 1) en el pico del temblor; corte DURO a a3-a5b (switch cuento→real). **Regen pendiente:** hoy aprobado como I2V degradado; regenerar como FLF real (m05→m06).

**Clip a3-a5b — Switch cuento→real: el caos (Revenant)**

```yaml
kind: video-i2v
firstFrame: a3-m14
cameraPreset: handheld
duration: 5
```

cameraPreset handheld: la cámara en mano ES parte del REALITY-BLOCK-CHAOS; el temblor va acá, no duplicado en el prompt.

Motion prompt (EN):
```
Real earth ripping apart violently, rocks and soil collapsing into the widening chasm, dust bursting into the air, heavy motion blur, no people, no animals, photorealistic gritty documentary realism.
```
- Vision-Audit (EN): sceneDescription: `real cracked earth splitting into a massive rift, dust and falling rocks` · action: `the ground tears apart violently, debris collapses into the chasm` · mood: `chaotic, violent, overwhelming`
- Audio: SIN off (el caos habla solo); rumble fuerte, crujidos de tierra
- Montaje: viene de a3-a5 con corte duro (silueta → real); corta a a3-a5c

**Clip a3-a5c — Switch real (respiro): zoom-out poético**

```yaml
kind: video-i2v
firstFrame: a3-m15
cameraPreset: crane-up
duration: 5
```

cameraPreset crane-up: grúa ascendente = el respiro se eleva sobre la catástrofe; preset expresivo habilitado por ser quiebre fotorrealista, ver paleta de cámara en biblia-visual.md §1.

Motion prompt (EN):
```
Slow aerial drift high above two vast landmasses separated by a calm sea channel, golden dusk light, atmospheric haze, immense stillness after the catastrophe, photorealistic documentary realism.
```
- Vision-Audit (EN): sceneDescription: `aerial view of two landmasses separated by a sea channel at golden dusk` · action: `slow wide drift revealing the water between the lands` · mood: `elegiac, serene, immense`
- Audio: off documental (la escala de lo ocurrido) + música mínima
- Montaje: el respiro después del caos; corta a a3-a5x (puente FLF experimental m06→m14) o, si el gate experimental falla, corte duro a a3-a6

**Clip a3-a5x — Puente FLF experimental: cuento→real (m06→m14)**

```yaml
kind: video-flf
firstFrame: a3-m06
lastFrame: a3-m14
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: ambas grietas comparten composición; el morph pone el movimiento. FLF no acepta 6s.

Motion prompt (EN):
```
The torn paper-cutout Pangea rift morphs into a real earth chasm, silhouette layers dissolving into photoreal cracked ground and falling rocks, tinted aged paper giving way to cold muted earth tones, dust rising, no people, no animals, the same rift composition held steady.
```
- Vision-Audit (EN): sceneDescription: `cutout Pangea rift becoming a real earth chasm, same composition` · action: `silhouette world morphs into photoreal Revenant rift` · mood: `violent, uncanny, transitional`
- Audio: rumble continuo (puente a5→a5b)
- Montaje: **gate de la estrategia de morphs cruzados** — si el morph salta feo, descartar y mantener el corte duro a5→a5b actual. Si aprueba, insertar entre a5 y a5b (o sustituir el corte duro).

**Clip a3-a5y — Puente FLF: real próspero → cuento próspero (m15→m08)**

```yaml
kind: video-flf
firstFrame: a3-m15v1
lastFrame: a3-m08
cameraPreset: locked-tripod
duration: 5
```

FLF no acepta 6s.

Motion prompt (EN):
```
The wide aerial view of two separated landmasses softens into layered black paper cutout wetland, photoreal haze becoming tinted aged paper, saturated lush green tint emerging, reeds and water plants resolving as delicate cut-out silhouette layers, flat 2D silhouette animation.
```
- Vision-Audit (EN): sceneDescription: `aerial real continents morphing into cutout Australian wetland` · action: `photoreal world settles into silhouette prosperity` · mood: `hopeful, bridging`
- Audio: off documental (la línea que sobrevive) + música tenue
- Montaje: cierra el Bloque A / abre el Bloque B; cubre el hueco de m08 (hoy sin clip). Tras el morph, corta a a3-a6 o entra directo a b1 según montaje final.

**Clip a3-a6a — Plano ancho de la separación (montaje, sin generación)**

```yaml
kind: montaje
fuente: a3-m19
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: off documental (beat 8.1: dos orillas)
- Montaje: abre el zoom del beat 8 tras el respiro `a3-a5c`; still de m19 (dos orillas ya separadas); corta a `a3-a6b`. El animatic decide si asciende a clip U2V.

**Clip a3-a6b — Plano de lectura: la familia repartida (montaje, sin generación)**

```yaml
kind: montaje
fuente: a3-m20
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: off documental (beat 8.2: unos de un lado, otros del otro)
- Montaje: still de m20 (madre+cría / padre+huevo); es el plano de lectura del beat 8; corta a `a3-a6` (la despedida).

**Clip a3-a6 — La separación (la despedida, beat 8.3)**

```yaml
kind: video-i2v
firstFrame: a3-m01v1
cameraPreset: push-in
duration: 5
```

Motion prompt (EN):
```
The mother platypus silhouette stands at the edge of the cutout chasm in profile, head slowly lowering as she looks across to the far side, silhouetted plants trembling in the wind, grief held in stillness, hinged paper puppet movement, flat 2D silhouette animation, deep red tinted background.
```
- Vision-Audit (EN): sceneDescription: `the edge of the cutout chasm on a deep red tinted background, far shore in the distance` · action: `the mother platypus silhouette stands still in profile, head slowly lowering` · mood: `grief, restrained sorrow`
- Audio: off documental (la despedida)
- Montaje: vuelve a silueta tras los switches; corta contra el padre con el huevo (a3-m03 + a3-m04) al otro lado de la grieta; cierra el Bloque A

### Bloque B — "Vidas paralelas" (~30s, pantalla partida por montaje)

> La pantalla partida = dos clips independientes montados (mitad superior/inferior del 9:16). No se generan personajes juntos. El contraste próspero/árido lo aporta el **tinte de fondo** (verde saturado vs. gris frío, ver guion de color); si el fondo no acompaña, cutaways con a3-m08/a3-m09.

**Clip a3-b1 — Padre próspero en Australia**

```yaml
kind: video-i2v
firstFrame: a3-m03
cameraPreset: tracking
duration: 5
```

Motion prompt (EN):
```
The male platypus silhouette gliding actively through silhouetted reeds and water, energetic confident movement, hinged paper puppet movement, flat 2D silhouette animation, saturated lush green tinted background, warm prosperous glow.
```
- Vision-Audit (EN): sceneDescription: `silhouetted Australian wetland on a saturated green tinted background` · action: `the male platypus silhouette swims and moves actively, healthy` · mood: `warm, prosperous`
- Audio: off documental (adaptación)
- Montaje: mitad de pantalla partida con a3-b3 (Australia arriba)

**Clip a3-b2 — El joven explorando (línea próspera)**

```yaml
kind: video-i2v
firstFrame: a3-m02
cameraPreset: tracking
duration: 5
```

Motion prompt (EN):
```
The young platypus silhouette exploring confidently among silhouetted wetland plants, slender lighter body matching the mother contour scaled down, hinged paper puppet movement, flat 2D silhouette animation, saturated lush green tinted background.
```
- Vision-Audit (EN): sceneDescription: `silhouetted wetland on a saturated green tinted background` · action: `the young platypus silhouette explores confidently, growing stronger` · mood: `hopeful, thriving`
- Audio: off documental (la línea que prospera)
- Montaje: intercut dentro del lado próspero

**Clip a3-b3 — La madre en declive**

```yaml
kind: video-i2v
firstFrame: a3-m01v2
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: quietud = declive, contra el movimiento del lado próspero.

Motion prompt (EN):
```
The mother platypus silhouette moving slowly across a silhouetted cracked plain, head low, weakened halting steps, hinged paper puppet movement, flat 2D silhouette animation, cold desaturated grey tinted background, sincere and mournful.
```
- Vision-Audit (EN): sceneDescription: `silhouetted cracked Patagonian plain on a cold grey tinted background` · action: `the mother platypus silhouette moves slowly, weakened, head low` · mood: `mournful, sincere`
- Audio: off documental (la pérdida)
- Montaje: mitad de pantalla partida con a3-b1 (Argentina abajo)

**Clip a3-b4 — El ambiente argentino secándose**

```yaml
kind: video-flf
firstFrame: a3-m09
lastFrame: a3-m17
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: el frame final debe calzar 1:1 con a3-m17 (sin movimiento de cámara que cambie el encuadre; la transformación pone todo el movimiento). FLF no acepta 6s.

Motion prompt (EN):
```
Silhouetted crack lines spreading across the cutout plain, paper plants slowly wilting and folding down until fully parched, time-lapse feel, flat 2D silhouette animation, the grey tinted background growing colder and dimmer.
```
- Vision-Audit (EN): sceneDescription: `arid cutout Patagonian plain on a cold grey tinted background` · action: `crack lines spread and paper vegetation wilts, time-lapse feel` · mood: `cold, desolate`
- Audio: off documental (el ecosistema cambia)
- Montaje: transición hacia el Bloque C; corta a a3-c1

### Bloque C — "El último" (REMATE DEL HILO, ~30s)

**Clip a3-c0 — Puente FLF: grieta real → cuento rojo (m14→m07)**

```yaml
kind: video-flf
firstFrame: a3-m14v1
lastFrame: a3-m07
cameraPreset: locked-tripod
duration: 5
```

FLF no acepta 6s.

Motion prompt (EN):
```
The real earth rift freezes and resolves into layered black paper cutout Martian rock formations, photoreal dust settling into tinted aged paper, deep red and orange dusk tint locking in, flat 2D silhouette animation, the chasm becoming the Coloradas badlands.
```
- Vision-Audit (EN): sceneDescription: `real rift morphing into cutout Coloradas rock landscape` · action: `photoreal chasm freezes into silhouette red world` · mood: `solemn, locking into fate`
- Audio: rumble que se apaga + off documental breve
- Montaje: abre el Bloque C — la grieta real se congela en el cuento rojo; corta a a3-c1

**Clip a3-c1 — Establishing Rocas Coloradas (push-in hacia la roca)**

```yaml
kind: video-i2v
firstFrame: a3-m07
cameraPreset: push-in
duration: 5
```

Motion prompt (EN):
```
Slow push-in across the layered paper cutout Coloradas rock formations and lagoons, cutout layers sliding in gentle parallax, settling toward a silhouetted red rock where the last platypus will rest, flat 2D silhouette animation, deep red dusk tinted background.
```
- Vision-Audit (EN): sceneDescription: `layered cutout Coloradas badlands on a deep red dusk tinted background` · action: `slow push-in toward the resting rock` · mood: `calm acceptance, solemn`
- Audio: off documental (el final del linaje argentino)
- Montaje: viene de a3-c0 (o de a3-b4 si se salta el puente); **NO es FLF** — m07 y m10' no comparten encuadre; corte a a3-c2 (m10' ya en pose de reposo)

**Clip a3-c2 — La fosilización (transición-gancho)**

```yaml
kind: video-flf
firstFrame: a3-m10
lastFrame: a3-m11
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: la transformación pone todo el movimiento. FLF no acepta 6s.

Motion prompt (EN):
```
The resting platypus silhouette slowly freezes and fills with stone texture, its black cutout becoming a fossil relief embedded in the silhouetted rock, fine bone detail emerging inside the contour, the red background tint fading to stone grey, flat 2D silhouette animation, solemn and beautiful.
```
- Vision-Audit (EN): sceneDescription: `silhouetted red rock at dusk, the resting platypus silhouette` · action: `the silhouette freezes and fills with stone texture, becoming a fossil, the tint fades to grey` · mood: `solemn, beautiful, final`
- Audio: off documental (se apaga) + silencio final
- Montaje: corta DURO a a3-c3

**Clip a3-c3 — El fósil hoy (salto a la realidad)**

```yaml
kind: video-i2v
firstFrame: a3-m13
cameraPreset: pull-out
duration: 5
```

cameraPreset pull-out: el zoom-out que abre el plano y prepara el eco de m09 y el corte a la foto real.

Motion prompt (EN):
```
A platypus fossil embedded in red rock at a present-day excavation site, motionless, ambient daylight shifting subtly, faint dust drifting in the air, photographic documentary realism.
```
- Vision-Audit (EN): sceneDescription: `present-day paleontological site in red rock badlands` · action: `the fossil rests motionless as the view widens` · mood: `real, quiet, revelatory`
- Audio: off documental (remate: la tumba del protagonista de la trilogía)
- Montaje: viene de a3-c2 con corte duro (silueta → foto); tras el pull-out, **eco breve (1–2s) de a3-m09** (Argentina en declive, solo montaje, sin generación) y corta a a3-c4

**Clip a3-c3e — Eco m09 (montaje, sin generación)**

```yaml
kind: montaje
fuente: a3-m09
duration: 2
```

duration (montaje): 1–2s
- Audio: silencio o cola del off de c3
- Montaje: eco breve tras el pull-out de a3-c3, antes de la foto real c4 — puente emocional declive→yacimiento; SOLO montaje

**Clip a3-c4 — Foto real de Rocas Coloradas (remate final)**

```yaml
kind: montaje
fuente: assets/fuentes/rocas-coloradas-real.jpg
duration: 4
```

duration (montaje): 3–4s (16:9; reencuadrar a 9:16)
- Sobreimpreso (opcional): "La Fundación protege hoy este yacimiento" — humor negro (el criminal custodiando la escena del crimen)
- Audio: silencio u off breve
- Montaje: cierra el "salto a la realidad" a3-c2 → a3-c3 → eco m09 → a3-c4; es el pago emocional del arco

---

## Sección 3 — Destacadas del arco (S1–S5, derivadas por montaje, sin generación)

Las destacadas del [calendario](../calendario-publicacion.md) (Semana 1) se arman **recortando/reencuadrando** los clips ya generados a 15s. Cero generación extra.

| Story | Beat | Fuente (clips) | Nota de montaje |
|---|---|---|---|
| S1 | La familia feliz | a3-a3 + a3-a4 | Recorte a 15s (madre + huevo); abrir con a3-m12 si se quiere marco |
| S2 | La grieta | a3-a5 | 15s; sticker/encuesta según calendario |
| S3 | La despedida | a3-a6 | 15s; texto sobrio |
| S4 | El declive | a3-b3 | 15s; puede sumar a3-b4 de cierre |
| S5 | El fósil | a3-c2 + a3-c3 + eco m09 + a3-c4 | 15s; remate con la foto real de la locación |

---

## Motores por etapa

Kling (FLF) se reserva a la cadena de transiciones (a3-a5, a3-a5x experimental, a3-a5y, a3-b4, a3-c0, a3-c2); el resto va por Minimax. a3-c1 es U2V simple (push-in sobre m07), no FLF. La estimación de costo del arco no se documenta acá: se calcula on-demand con la calculadora, a partir de la doc de costos ([../../../../metodo/providers.md](../../../../metodo/providers.md)).

---

## Cadena de transiciones (sub-clips FLF de 5s, límite duro 2 keyframes por eslabón)

> Columna **Keyframes**: cuántas madres pide cada escena (taxonomía 1/2/N del [pipeline](../../../../metodo/pipeline.md) §2 paso 1). Hoy ninguna escena del arco supera 2 keyframes; una eventual cadena N>2 se declararía como eslabones FLF consecutivos que comparten el keyframe intermedio (`a3-mNN`→`a3-mNNa`→…).

| Eslabón | Clip | Tipo | Keyframes | Nota |
|---|---|---|---|---|
| m05v1→m06 | a3-a5 | FLF | 2 (par) | firstFrame variado (unicidad, §Variaciones); regenerar (hoy I2V degradado) |
| m06→m14 | a3-a5x | FLF experimental | 2 (par) | Gate morphs cruzados cuento→real; si salta feo → corte duro |
| m15v1→m08 | a3-a5y | FLF | 2 (par) | firstFrame variado (unicidad); cierra Bloque A / abre Bloque B; cubre hueco de m08 |
| m14v1→m07 | a3-c0 | FLF | 2 (par) | firstFrame variado (unicidad); abre Bloque C: grieta real se congela en cuento rojo |
| m07→m10' | a3-c1 | U2V + corte | 1 | Push-in; NO FLF (no comparten encuadre) |
| m13→m09 | a3-c3e | Solo montaje | — | Eco 1–2s de m09 tras pull-out de m13, antes de c4 (eco deliberado, exento de variación) |

---

## Guardas de canon aplicadas

- Registro Attenborough **sincero**, sin chistes verbales (tesis del arco).
- La **mano negra** aparece solo como frame subliminal en a3-a5, reutilizando su imagen madre del Arco 1 (no se genera nada nuevo). En el lenguaje de teatro de sombras, la mano negra es **nativa del estilo**: una silueta más dentro del mundo, no un elemento ajeno.
- El **fósil final ES el del Ep.1** (canon), pero NO existe plano de archivo del rodaje: el remate se resuelve con a3-m13 (fósil en registro fotográfico) + eco breve de m09 (montaje) + la foto real de la locación (`assets/fuentes/rocas-coloradas-real.jpg`). El corte silueta → foto es el "salto a la realidad".
- **CFJ no aparece** en este arco, pero el estilo silueta deja alineado el Arco 2: "CFJ nunca de frente" se cumple por diseño (Charles ES una silueta).
- Anacronismos: no se fuerzan en este arco por su registro emocional; quedan disponibles como recurso si hiciera falta.
- **Switches cuento/real** (a3-a5b/a5c, puentes a5x/a5y/c0, salto c3/c4): recurso **estructural** del arco — ver dosificación en [biblia-visual.md](../../biblia-visual.md) §1. Guardas anti-error respetadas en quiebres fotorrealistas: sin personas ni animales en cuadro, motion blur y polvo como escudo de artefactos.
