# Arco 2 — Plano a plano (PARCIAL: solo el aporte al reel transversal)

> Bajada de producción del [Arco 2: Charles y la palanca](../arco-2-charles-palanca.md) a **fichas de ingesta** en wind-comic. Es **fuente por hilo** (spec ejecutable), no un entregable.
> **PARCIAL a propósito**: por ahora se bajan los beats que el reel transversal "La Grieta" necesita: la palanca (contrapunto esperanzador, beat 9) y la coda del lugar blanco (beat 13.2–13.3, "es en Rocas Coloradas"). El resto del hilo (intervenciones menores, la meditación previa al lugar blanco) se baja cuando le toque el turno de producción (orden 3 → 1 → 2).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../../biblia-serie.md), STYLE-BLOCK y anclas de estilo en [biblia-visual.md](../../biblia-visual.md), ficha de CFJ en [personajes-studio.md](../../personajes-studio.md), convención de IDs/archivos en [pipeline.md](../../../../metodo/pipeline.md) §5–6.

Convenciones (idénticas a [arco-3.md](arco-3.md)): prompts en inglés con el STYLE-BLOCK embebido literal; títulos/off/montaje en español; el movimiento de cámara va en `cameraPreset`.

Registro del Arco 2: esperanzador, el contrapeso del Arco 1. En el reel entra como **contrapunto** durante "vidas paralelas": la palanca de Charles explica por qué la línea australiana sobrevivió. Se produce mayormente en **silueta** (Charles de espaldas): cumple "CFJ nunca de frente" por diseño y esquiva la guarda anti-manos. **Excepción (decisión de dirección):** el golpe de la grieta asciende a un quiebre fotorrealista **Revenant** OTS (`a2-m07`, `styleBlock: false`) — switch cuento→real, hermano de `a3-m14` pero con Charles presente; de espaldas + el caos como escudo mantienen las guardas de cara/manos. El master de silueta (`a2-m01`) se conserva aparte para que `a2-m04`/`a2-m05` sigan heredando identidad/vestuario.

## Guion de color (tinte de fondo por beat)

| Beat | Tinte (línea EN del prompt) |
|---|---|
| La palanca (a2-m01, a2-m02, a2-m03, a2-a1) — en el momento de la grieta | `dramatic deep red tinted background` |
| La grieta Revenant (a2-m07) — golpe del quiebre en el reel (A/B vs m08) | REALITY-BLOCK Revenant, `deep blood-red overcast dusk light` (`styleBlock: false`; desvío rojo del bloque canónico) |
| La grieta Reiniger (a2-m08) — exploración A/B del mismo encuadre | `dramatic deep red tinted background` |
| Manos + cría Revenant (a2-m06) — **reserva destacada**, no reel | REALITY-BLOCK (fotográfico; `styleBlock: false`) |
| El mensaje / lugar blanco (a2-m04, a2-a2) | sin tinte: `pure white paper background` (registro nuevo: *cuento sin tinte*, ni sueño ni realidad) |
| El despertar (a2-m05, a2-a2b) | `deep red dusk tinted background` (empalma con el Bloque C del Arco 3) |

---

## Sección 1 — Imágenes madre (generar PRIMERO)

**a2-m01 — Charles de espaldas (silueta master)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m01-charles-espaldas.png
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
  - assets/fuentes/charles/charles-jones-pintura.jpg
provider: openrouter
```

Nota: **silueta master** del arco — lock de identidad/vestuario (sombrero, abrigo, morral) que `a2-m04`/`a2-m05` heredan. Aspecto y vestuario canónicos en la ficha CFJ de [personajes-studio.md](../../personajes-studio.md). Regla dura: **nunca de frente** — silueta de cuerpo entero de espaldas. **Lotte Reiniger de verdad** (no ilustración vectorial plana): recorte de papel con filigrana fina de tijera, encaje de detalle interior, ref. *Die Abenteuer des Prinzen Achmed*. Registro esperanzador-en-quiebre: hábitat frondoso y vivo que recién empieza a rajarse (helechos, pastos, juncos, árboles en silueta), no páramo muerto. El golpe visceral de la grieta NO vive acá: es el Revenant `a2-m07`. Las refs (Nano Banana multi-ref) solo aportan identidad/vestuario; la cara NUNCA se muestra y el estilo NO cambia.

Prompt (EN):
```
The reference images show an elderly bearded explorer — use them ONLY for identity and wardrobe (wide-brimmed fedora, long expedition coat, satchel, general build), NEVER show his face, NEVER change the art style. Black paper cutout silhouette of the elderly explorer seen strictly from behind, full standing figure, at the edge of a lush thriving habitat — silhouetted ferns, tall grasses, reeds and leafy trees — where a single fresh rift is only just beginning to split the green ground, the world still verdant and alive, NOT a barren wasteland, no dead cracked desert. Fine intricate lace-like hand-cut paper detail in the coat, hat brim and foliage — delicate filigree cut-outs, NOT flat vector shapes, in the manner of Lotte Reiniger's Die Abenteuer des Prinzen Achmed, flat 2D layered paper theater. dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
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

Nota: multi-ref (Nano Banana). El gesto mínimo del beat 9.3: las manos en silueta de Charles **alzan** a la cría (no entrega entre dos personas). Pick canónico: `a2-m03-c2`. Refs: Charles solo para identidad de manos/mangas (nunca la cara); `ornitorrinco_crias.jpeg` **solo para la pose**; la cría se dibuja como la silueta del joven (tercera ref, master), NO un puggle rosado. Silueta de espaldas por diseño. La versión realista vive en `a2-m06` (reserva destacada).

Prompt (EN):
```
The first reference shows an elderly explorer — use it ONLY for the identity of the hands and coat sleeves (aged rugged hands, worn expedition coat cuffs), NEVER show a face. The second reference shows a human hand gently cupping a small platypus baby — use it ONLY for the pose and gesture of hands lifting a small creature, NEVER for its style or its pink fleshy look. The third reference is the master character — the young platypus: reproduce this exact silhouette style with 100% fidelity — same bill shape, same etched eye, same fur strokes, same cross-hatched paddle tail, same webbed feet, same woodcut cutout style. Black paper cutout silhouette scene: two aged silhouetted hands in worn coat cuffs gently cup and lift a small young platypus silhouette just above a fallen log balanced over a rift, the explorer's body only implied at the frame edge from behind with no face visible, the young platypus readable as a small slender silhouette through fine gold etched lines like a woodcut print — never a plain solid blob, never pink, never photographic, tender minimal almost accidental gesture, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m06 — Manos levantan la cría (registro Revenant) — RESERVA destacada**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m06-manos-cria-revenant.png
anatomyRefs:
  - assets/fuentes/ornitorrincos/ornitorrinco_crias.jpeg
  - assets/fuentes/charles/charles-jones-referencia.jpeg
provider: openrouter
styleBlock: false # REALITY-BLOCK: fotográfico documental, no silueta
```

Nota: **reserva para la destacada del Arco 2** — NO entra al reel transversal ni toca la cadena de switches cuento↔real. Misma acción que `a2-m03` (manos alzan la cría) en registro Revenant realista, coincidente con `ornitorrinco_crias.jpeg` (anatomía/pose de la cría real; Charles solo manos/mangas, nunca la cara). Opcional a futuro: FLF `a2-m03` (cuento) → `a2-m06` (revenant) como switch de la destacada.

Prompt (EN):
```
The first reference shows real baby platypuses held in human hands — use it as the primary look for the young platypus: plump soft brown fur, matte dark bill, tiny claws, naturalistic proportions, NEVER a silhouette, NEVER a paper cutout. The second reference shows an elderly explorer — use it ONLY for the identity of aged rugged hands and worn expedition coat cuffs, NEVER show a face. Photorealistic documentary close-up: two weathered human hands in worn coat cuffs gently cup and lift a small living baby platypus just above a fallen log over a dark rift, natural overcast light, cold muted earth tones, gritty documentary realism inspired by The Revenant, no illustration, no silhouette, no paper texture, vertical 9:16
```

**a2-m04 — El lugar blanco (beat 13.2)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m04-lugar-blanco.png
ref: a2-m01
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
provider: openrouter
styleBlock: false # Cuento sin tinte: sigue siendo silueta recortada pero sobre blanco puro, sin tinte ni sepia (no valida STYLE-BLOCK/tinte)
```

Nota: cruce con el Ep.1 (el "lugar blanco" del sueño, biblia §4). Registro nuevo: **cuento sin tinte** — la silueta se mantiene pero el fondo es blanco puro (ni el papel tintado del cuento ni el fotorrealismo del salto a la realidad). `ref: a2-m01` hereda la silueta de Charles de espaldas con sombrero; la ref `charles/` solo aporta identidad/vestuario, nunca la cara. Guarda dura: **nunca de frente**. Las palomas **no están**: el maíz cae y no hay nada que lo coma (esa ausencia ES la imagen del episodio).

Prompt (EN):
```
The first reference image is the master character — reproduce this exact Charles silhouette with 100% fidelity: same wide-brimmed fedora, same long expedition coat, same seen-strictly-from-behind pose, same woodcut cutout style. The other reference shows an elderly bearded explorer — use it ONLY for identity and wardrobe, NEVER show his face, NEVER change the art style. Black paper cutout silhouette of the elderly explorer seen strictly from behind, full figure seated on a small low stool, one hand tossing a scatter of corn kernels that fall through the air to the ground, absolutely no pigeons, no birds, no animals anywhere in the frame — only the falling seeds and empty ground, face never visible, delicate cut-out inner details in the coat and hat brim, pure white paper background with no tint and no scenery, an emptied dreamlike void, flat 2D paper cutout, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouette with delicate cut-out inner details, dark fairy tale mood, subtle soft edges, vertical 9:16
```

**a2-m05 — El despertar (beat 13.3)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m05-despertar.png
ref: a2-m01
anatomyRefs:
  - assets/arco-3/madre/a3-m07-rocas-coloradas.png
provider: openrouter
```

Nota: empalma el lugar blanco de vuelta con el Bloque C del Arco 3 (el mundo rojo de las Coloradas) — el mensaje ya fue transmitido. `ref: a2-m01` mantiene la silueta de Charles de espaldas; la ref `a3-m07` aporta el mundo de recortes rojos (mismo patrón multi-ref que `a3-m10`). Gesto mínimo: alza la cabeza como quien vuelve de un sueño. Guarda dura: **nunca de frente**.

Prompt (EN):
```
The first reference image is the master character — reproduce this exact Charles silhouette with 100% fidelity: same wide-brimmed fedora, same long expedition coat, same seen-strictly-from-behind pose, same woodcut cutout style. The second reference image is the world: layered flat paper cutout red rock formations of the Coloradas badlands — reproduce that exact flat 2D cutout landscape style, stacked silhouette layers on a tinted paper background. Black paper cutout silhouette of the elderly explorer seen strictly from behind, full figure seated among the silhouetted red rock formations, slowly raising his head as if waking from a trance, face never visible, delicate cut-out inner details in the coat and hat brim, deep red dusk tinted background of the Coloradas rock world, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m07 — La grieta (Revenant photoreal, OTS extremo + colina lejana)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m07-grieta-revenant.png
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
provider: openrouter
styleBlock: false # REALITY-BLOCK Revenant: fotográfico, no silueta (switch cuento→real)
```

Nota: Pick canónico: `a2-m07-c2` → `a2-m07-grieta-revenant.png`. Segunda aprobada: `a2-m07-c3` (OTS más pegado) en `a2-m07-grieta-revenant-c3.png`. **quiebre fotorrealista Revenant con Charles presente** — el golpe visceral del beat de la palanca, hermano de `a3-m14` (grieta photoreal) pero con la figura en cuadro. Encuadre **OTS extremo**: cámara casi pegada a la nuca — ala del sombrero y hombro ocupan un tercio o más del cuadro, desenfocados por cercanía (foreground bokeh). Charles parado **elevado en una colina/pendiente, lejos** de la destrucción; la laguna que drena y la grieta quedan abajo en el valle, chicas en el cuadro pero de escala colosal (panorama, bruma, escombros lejanos). La enormidad se lee por perspectiva, no por proximidad. El caos es el escudo de las guardas (cara oculta, manos fuera de cuadro). **Desvío controlado del REALITY-BLOCK-CHAOS:** luz de atardecer rojo profundo en vez de `cold muted earth tones`, para sostener el mundo rojo del Arco 2. Solo ref de foto (`charles-jones-referencia.jpeg`) para vestuario, sin la pintura. Compite A/B con `a2-m08` (mismo encuadre en Reiniger). A futuro puede ascender a par FLF (laguna íntegra → drenada) en el gate de madres keyframes.

Prompt (EN):
```
The reference image shows an elderly bearded explorer — use it ONLY for the identity and wardrobe of a man seen from behind (wide-brimmed fedora, long expedition coat, satchel), NEVER show his face. Extreme close over-the-shoulder shot, the camera almost touching the back of his head — his fedora hat brim and shoulder fill a third of the frame as a soft out-of-focus dark foreground, seen strictly from behind, face never visible, hands lowered and out of frame. He stands high on a grassy hillside ridge, far away from the destruction. Far below in the vast valley, a colossal rift tears the green thriving habitat open and a lagoon drains into it as a distant waterfall, tiny in the frame yet immense in scale, haze and dust rising, debris like specks in the air, sense of overwhelming scale and distance, deep panorama, the habitat still green and alive. handheld unstable camera, violent motion, heavy motion blur, dust and debris in the air, deep blood-red overcast dusk light, photorealistic, gritty documentary realism inspired by The Revenant, no illustration, no silhouette, no paper texture, vertical 9:16
```

**a2-m08 — La grieta (Reiniger, mismo encuadre) — exploración A/B**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m08-grieta-reiniger.png
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
  - assets/fuentes/charles/charles-jones-pintura.jpg
provider: openrouter
```

Nota: Pick canónico: `a2-m08-c3` → `a2-m08-grieta-reiniger.png`. **exploración de dirección** — mismo encuadre que `a2-m07` (OTS extremo + Charles elevado en colina + grieta/laguna como panorama lejano) traducido a silueta Lotte Reiniger. Compite A/B con `a2-m07` por el slot del golpe de la grieta (ambos aprobados; la decisión de cuál entra al reel queda abierta). No toca la herencia de m04/m05 (siguen sobre `a2-m01`). Capas de teatro de sombras: hombro/ala del sombrero como capa negra grande en primerísimo plano (filigrana Reiniger, no vector plano), Charles en lo alto de una loma como capa media, valle verde con laguna drenando en la grieta como capas chicas al fondo. Guarda dura: **nunca de frente**.

Prompt (EN):
```
The reference images show an elderly bearded explorer — use them ONLY for identity and wardrobe (wide-brimmed fedora, long expedition coat, satchel, general build), NEVER show his face, NEVER change the art style. Extreme close over-the-shoulder paper-cutout shot: the explorer's black silhouette fills the near foreground as a large dark layer — the back of his fedora hat brim and his shoulder cropped huge at the frame edge, seen strictly from behind, face never visible, fine intricate lace-like hand-cut paper detail in the coat and hat brim. He stands high on a silhouetted hillside ridge, far from the destruction. Far below in the vast valley as smaller stacked cutout layers: a lush thriving habitat of ferns, reeds and leafy trees where a colossal rift tears the green ground open and a lagoon drains into it as a distant waterfall silhouette, tiny in the frame yet immense in scale, sense of overwhelming distance through layered shadow-theater depth. Flat 2D layered paper theater in the manner of Lotte Reiniger's Die Abenteuer des Prinzen Achmed — NOT flat vector shapes. dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
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

**Clip a2-a2 — El lugar blanco (montaje, sin generación) — beat 13.2**

```yaml
kind: montaje
fuente: a2-m04
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: susurro casi subliminal "…es en Rocas Coloradas…" bajo la música (no lectura documental); ver [arco-2-off.md](arco-2-off.md)
- Montaje: entra en el ZOOM 13 del reel, **entre `a3-c2` (fosilización) y `a3-c3` (el fósil hoy)**. El tinte gris piedra en el que cierra `a3-c2` se drena hasta el blanco puro de m04 (transición por color, sin corte duro); still de m04 (Charles de espaldas, maíz que cae, palomas ausentes); corta a `a2-a2b`. El animatic decide si asciende a clip U2V.

**Clip a2-a2b — El despertar (montaje, sin generación) — beat 13.3**

```yaml
kind: montaje
fuente: a2-m05
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: sin off (silencio; respira antes del salto a la realidad de `a3-c3`)
- Montaje: still de m05 (Charles alza la cabeza en el mundo rojo de las Coloradas); el tinte rojo empalma de vuelta con el Bloque C y el despertar prepara el corte a `a3-c3` (el fósil hoy, salto a la realidad). Cierra el ZOOM 13.
