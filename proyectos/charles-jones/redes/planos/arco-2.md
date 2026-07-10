# Arco 2 — Plano a plano (PARCIAL: solo el aporte al reel transversal)

> Bajada de producción del [Arco 2: Charles y la palanca](../arco-2-charles-palanca.md) a **fichas de ingesta** en wind-comic. Es **fuente por hilo** (spec ejecutable), no un entregable.
> **PARCIAL a propósito**: por ahora se bajan los beats que el reel transversal "La Grieta" necesita: la palanca (contrapunto esperanzador, beat 9) y la coda del lugar blanco (beat 13.2–13.3, "es en Rocas Coloradas"). El resto del hilo (intervenciones menores, la meditación previa al lugar blanco) se baja cuando le toque el turno de producción (orden 3 → 1 → 2).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../../biblia-serie.md), STYLE-BLOCK y anclas de estilo en [biblia-visual.md](../../biblia-visual.md), ficha de CFJ en [personajes-studio.md](../../personajes-studio.md), convención de IDs/archivos en [pipeline.md](../../../../metodo/pipeline.md) §5–6.

Convenciones (idénticas a [arco-3.md](arco-3.md)): prompts en inglés con el STYLE-BLOCK embebido literal; títulos/off/montaje en español; el movimiento de cámara va en `cameraPreset`.

Registro del Arco 2: esperanzador, el contrapeso del Arco 1. En el reel entra como **contrapunto** durante "vidas paralelas": la palanca de Charles explica por qué la línea australiana sobrevivió. Se produce mayormente en **silueta** Lotte Reiniger. **Guarda de cara:** en registro **Revenant / photoreal** Charles nunca de frente (de espaldas, OTS, manos); en registro **Reiniger** la cara **puede verse** en perfil/tres cuartos recortado (ver [personajes-studio.md](../../personajes-studio.md)). **Excepciones Revenant (decisión de dirección):** (1) el golpe de la grieta (`a2-m07`, `styleBlock: false`) — switch cuento→real, hermano de `a3-m14`; (2) la coda del lugar blanco (`a2-m04`) en void blanco puro. El master de silueta (`a2-m01`) se conserva para `a2-m05` y el resto del hilo en cuento; el despertar selvático post-sueño es `a2-m09` (Reiniger, cara visible).

## Guion de color (tinte de fondo por beat)

| Beat | Tinte (línea EN del prompt) |
|---|---|
| La palanca (a2-m01, a2-m02, a2-m02a, a2-m02b, a2-m02c, a2-m03, a2-a1, a2-a1c, a2-a1b, a2-a0b) — en el momento de la grieta | `dramatic deep red tinted background` |
| La grieta Revenant (a2-m07) — golpe del quiebre en el reel (A/B vs m08) | REALITY-BLOCK Revenant, `deep blood-red overcast dusk light` (`styleBlock: false`; desvío rojo del bloque canónico) |
| La grieta Reiniger (a2-m08) — exploración A/B del mismo encuadre | `dramatic deep red tinted background` |
| Manos + cría Revenant (a2-m06) — **reserva destacada**, no reel | REALITY-BLOCK (fotográfico; `styleBlock: false`) |
| El mensaje / lugar blanco (a2-m04, a2-a2) | REALITY-BLOCK Revenant, void blanco puro (`styleBlock: false`; sin tinte de papel) |
| El despertar Coloradas (a2-m05, a2-a2b) | `deep red dusk tinted background` (empalma con el Bloque C del Arco 3) |
| El despertar selvático (a2-m09) — post lugar blanco; mate a la salida de la carpa | `dramatic deep red dusk tinted background` (Reiniger; cara visible) |

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

Nota: Pick canónico: `a2-m01-c1` → `a2-m01-charles-espaldas.png`. **silueta master** del arco — lock de identidad/vestuario (sombrero, abrigo, morral) que `a2-m04`/`a2-m05` heredan. Aspecto y vestuario canónicos en la ficha CFJ de [personajes-studio.md](../../personajes-studio.md). Regla dura: **nunca de frente** — silueta de cuerpo entero de espaldas. **Lotte Reiniger de verdad** (no ilustración vectorial plana): recorte de papel con filigrana fina de tijera, encaje de detalle interior, ref. *Die Abenteuer des Prinzen Achmed*. Registro esperanzador-en-quiebre: hábitat frondoso y vivo que recién empieza a rajarse (helechos, pastos, juncos, árboles en silueta), no páramo muerto. El golpe visceral de la grieta NO vive acá: es el Revenant `a2-m07`. Las refs (Nano Banana multi-ref) solo aportan identidad/vestuario; la cara NUNCA se muestra y el estilo NO cambia.

Prompt (EN):
```
The reference images show an elderly bearded explorer — use them ONLY for identity and wardrobe (wide-brimmed fedora, long expedition coat, satchel, general build), NEVER show his face, NEVER change the art style. Black paper cutout silhouette of the elderly explorer seen strictly from behind, full standing figure, at the edge of a lush thriving habitat — silhouetted ferns, tall grasses, reeds and leafy trees — where a single fresh rift is only just beginning to split the green ground, the world still verdant and alive, NOT a barren wasteland, no dead cracked desert. Fine intricate lace-like hand-cut paper detail in the coat, hat brim and foliage — delicate filigree cut-outs, NOT flat vector shapes, in the manner of Lotte Reiniger's Die Abenteuer des Prinzen Achmed, flat 2D layered paper theater. dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m02 — La pisada (beat 9.4) — un sujeto**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m02-pisada.png
ref: a2-m03
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
provider: openrouter
```

Nota: **un sujeto por plano** (pipeline §1: cruces por corte). Solo la **bota de Charles de la rodilla para abajo** apoyando sobre el extremo de un tronco — sinécdoque del descuido ("Charles pasa"). Sin nido, sin huevo, sin grieta. Still de montaje (`a2-a1`, ~1.5s). Nano Banana: `ref: a2-m03` (mundo rojo + estilo); foto Charles = identidad de bota/pantalón (nunca cara, nunca figura entera). La causalidad se monta por corte: `a2-a1` → `a2-a1c` (nido) → `a2-a1b` (huevo).

Prompt (EN):
```
The first reference is the approved prior beat — inherit ONLY its world and style: dramatic deep red tinted paper, torn-paper mood, silhouetted ferns, woodcut cutout look; do NOT copy the cupped hands or the young platypus. The second reference shows an elderly explorer — use it ONLY for the identity of a worn expedition boot and trouser leg below the knee, NEVER show a face, NEVER show a full body. Single-subject black paper cutout silhouette: ONLY the explorer's leg from the knee down (boot + lower trouser) entering from the frame edge, mid-stride, lightly pressing one end of a fallen log — human scale, accidental walking step, synecdoche of carelessness. NOTHING else in the frame: NO nest, NO egg, NO rift, NO full figure, NOTHING above the knee, NEVER a giant centered boot, NEVER a hovering foot, NEVER a deliberate stomp. Dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m02a — El huevo de este lado (keyframe inicial FLF, beat 9.4) — diferido a keyframes**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m02a-huevo-este-lado.png
ref: a2-m02
anatomyRefs:
  - assets/arco-3/madre/a3-m04-huevo.png
provider: openrouter
```

Nota: **un sujeto** — el huevo sobre el tronco, aún de este lado. Keyframe inicial del par FLF `a2-m02a` → `a2-m02b` (clip `a2-a1b`). Sin bota, sin nido, sin grieta. `ref: a2-m02` hereda mundo/tronco; `a3-m04` = master del huevo. Se genera tras promover `a2-m02`; `a2-m02b` espera al canónico de esta ficha.

Prompt (EN):
```
The first reference is the approved prior beat — inherit ONLY its world and style and the fallen log: dramatic deep red tinted paper, woodcut cutout look; do NOT copy the boot or leg. The second reference is the platypus egg master — reproduce that exact egg silhouette with 100% fidelity. Single-subject black paper cutout silhouette: a fallen log across the frame, a single platypus egg resting on the near end of the log — still, not yet rolling. NOTHING else: NO nest, NO boot, NO leg, NO rift, NO other characters. Dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m02b — El huevo del otro lado (keyframe final FLF, beat 9.4) — diferido a keyframes**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m02b-huevo-otro-lado.png
anatomyRefs:
  - assets/arco-3/madre/a3-m04-huevo.png
  - assets/arco-3/madre/a3-m08-australia-prospera.png
provider: openrouter
```

Nota: **keyframe final** del par FLF con `a2-m02a` — **ya no es el mismo encuadre** (aterrizaje, no balancín). El huevo quedó **del lado Australia**, claramente de un solo lado: **acostado de costado**, en ángulo desparejo, como tumbado por el envión (no acomodado). **Sin tronco, sin grieta, sin portal rojo en V.** Suelo/orilla próspera con helechos verdes (eco de `a3-m08`); tinte rojo del beat se mantiene en el fondo. `a3-m04` = master del huevo; `a3-m08` = solo mood de vegetación viva, no copiar el canal de agua ni el pájaro. Sin bota, sin nido. **Solo ficha** — se genera en el gate de madres keyframes.

Prompt (EN):
```
The first reference is the platypus egg master — reproduce that exact egg silhouette with 100% fidelity. The second reference is a lush thriving wetland — inherit ONLY its living green vegetation mood (ferns, reeds, grasses); do NOT copy the water channel, the bird, the centered sun, or the split composition. Single-subject paper cutout: a speckled platypus egg lying on its side on solid ground on ONE side of the frame — tumbled, imperfect, unbalanced angle, as if momentum knocked it over, NOT upright, NOT neatly placed. Around it, silhouetted green ferns and grasses of a prosperous bank. The egg sits clearly on that one bank — NOT straddling a divide, NOT centered in a chasm. NOTHING else: NO fallen log, NO trunk, NO seesaw, NO rift, NO crack, NO V-shaped glowing portal, NO canyon, NO nest, NO boot, NO leg, NO bird. Dramatic deep red tinted background with living green vegetation accents only, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m02c — El nido vacío (beat 9.4) — un sujeto**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m02c-nido-vacio.png
ref: a2-m02
anatomyRefs:
  - assets/arco-3/madre/a3-m04-huevo.png
provider: openrouter
```

Nota: **un sujeto** — solo el nido vacío sobre el tronco (eco: él se llevó a la cría; el huevo queda aparte). Still de montaje (`a2-a1c`, ~1.5s) entre la pisada y el FLF del huevo. `a3-m04` aporta la forma del nido (sin el huevo). Se genera tras promover `a2-m02`.

Prompt (EN):
```
The first reference is the approved prior beat — inherit ONLY its world and style and the fallen log: dramatic deep red tinted paper, woodcut cutout look; do NOT copy the boot or leg. The second reference is the platypus egg-and-nest master — use it ONLY for the nest-of-twigs silhouette, NEVER include the egg. Single-subject black paper cutout silhouette: a fallen log across the frame, an EMPTY nest of twigs on the near end — no egg inside. NOTHING else: NO egg, NO boot, NO leg, NO rift, NO other characters. Dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a2-m03 — Las manos de Charles levantan a la cría (beat 9.2–9.3)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m03-manos-levantan-cria.png
ref: assets/arco-2/madre/_pre-gate/a2-m03-gesto-c1.png
anatomyRefs:
  - assets/arco-3/madre/a3-m19-separacion-ancha.png
  - assets/arco-3/madre/a3-m02-ornitorrinco-joven.png
  - assets/fuentes/charles/charles-jones-referencia.jpeg
provider: openrouter
```

Nota: multi-ref (Nano Banana). Beat 9.3: gesto de ternura — Charles se agacha y alza a una **cría perdida** en el rompimiento que ya viene del beat 8. **Ref 1** (`_pre-gate/a2-m03-gesto-c1`): composición aprobada de manos + cría (fidelidad alta). **Ref 2** (`a3-m19`): mundo — grieta **temprana** (paredes casi tocándose), helechos, tinte rojo. **Ref 3** (`a3-m02`): master de la cría. **Ref 4** (foto Charles): solo identidad de manos/mangas, nunca la cara. El fondo es el hábitat que se raja (rompimiento emergiendo); **no** el tronco-balancín ni el huevo (eso es el beat 9.4 por montaje). Cierre del zoom 9 por montaje: `a2-a0` → `a2-a1` → `a2-a1c` → `a2-a1b` → `a2-a0b` (alzada al final). La versión realista vive en `a2-m06` (reserva destacada).

Prompt (EN):
```
The first reference is the APPROVED gesture composition — keep it with near-100% fidelity: the same two cupped hands of ONE man entering from the same lower corner in worn coat cuffs, the same small young platypus resting in direct physical contact inside the palms, same woodcut etched line style, NEVER two people, NEVER a hand-off, NEVER floating. The second reference is the WORLD — the early emerging rift: jagged cliff walls almost touching with a narrow glowing red gap, silhouetted ferns at the base, layered paper-cutout landscape; use it ONLY for the background environment under and behind the hands — a lush habitat just beginning to split, NOT a barren wasteland, NOT the full distant panorama as the subject. The third reference is the young platypus master — reproduce that exact slender silhouette with 100% fidelity (bill, etched eye, fur strokes, paddle tail, webbed feet). The fourth reference shows an elderly explorer — use it ONLY for aged rugged hands and worn expedition coat cuffs, NEVER show a face. Black paper cutout silhouette scene: the approved hands-and-cria gesture in the foreground, set on a silhouetted ground of ferns and torn earth where a fresh narrow red rift is only just opening behind/below them — emerging break, not the seesaw action. NO fallen log seesaw, NO egg, NO nest tipping, NO full explorer body or face. The young platypus readable through fine gold etched lines like a woodcut print — never a plain solid blob, never pink, never photographic, tender minimal almost accidental gesture, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
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

**a2-m04 — El lugar blanco (beat 13.2, Revenant)**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m04-lugar-blanco.png
anatomyRefs:
  - assets/fuentes/charles/charles-jones-referencia.jpeg
provider: openrouter
styleBlock: false # REALITY-BLOCK Revenant: fotográfico en void blanco (no silueta)
```

Nota: cruce con el Ep.1 (el "lugar blanco" del sueño, biblia §4). Pick canónico: `a2-m04-revenant-c2` → `a2-m04-lugar-blanco.png`. Segunda aprobada: `a2-m04-revenant-c3` → `a2-m04-lugar-blanco-c3.png` (mismo patrón dual que `a2-m07`). Registro **Revenant** en void blanco puro (ni cuento tintado ni salto a las Coloradas). Solo ref foto `charles/` para vestuario; guarda dura: **nunca de frente**. Las palomas **no están**: el maíz cae y no hay nada que lo coma (esa ausencia ES la imagen del episodio). Los candidatos de silueta (`a2-m04-c1..c3`) quedan como exploración descartada del registro anterior (*cuento sin tinte*).

Prompt (EN):
```
The reference image shows an elderly bearded explorer — use it ONLY for the identity and wardrobe of a man seen from behind (wide-brimmed fedora, long worn expedition coat, satchel), NEVER show his face. Photorealistic documentary full figure: the elderly explorer seated on a small low wooden stool, seen strictly from behind, one weathered hand tossing a scatter of corn kernels that fall through the air to the empty ground, absolutely no pigeons, no birds, no animals anywhere in the frame — only the falling seeds and bare empty ground, face never visible. Surrounded by an emptied dreamlike pure white void — featureless white space with no scenery and no walls, soft overexposed white light, sparse soft shadow under the stool, coarse film grain, handheld documentary framing, gritty realism inspired by The Revenant, no illustration, no silhouette, no paper texture, vertical 9:16
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

**a2-m09 — El despertar en la selva (Reiniger, cara visible) — beat 13.3 post-sueño**

```yaml
kind: image
dest: assets/arco-2/madre/a2-m09-despertar-selva.png
ref: assets/arco-2/madre/_pre-gate/a2-m09-base-c1.png
anatomyRefs:
  - assets/fuentes/charles/charles-jones-pintura.jpg
provider: openrouter
```

Nota: Pick canónico: `a2-m09-c1` → `a2-m09-despertar-selva.png`. Viene **después** de `a2-m04` (lugar blanco Revenant) — Charles despierta del sueño en la selva. Madre **nueva** aparte de `a2-m05` (despertar Coloradas, que se conserva). Registro **Lotte Reiniger** con **cara visible** en perfil/tres cuartos recortado (excepción anotada en [personajes-studio.md](../../personajes-studio.md)): barba, ala del sombrero, rasgos en filigrana de tijera. **Ref 1** (`_pre-gate/a2-m09-base-c1`): composición/estilo de la tanda previa (fidelidad alta de figura, filigrana, tinte rojo, selva en capas). **Ref 2** (pintura Charles): identidad de rasgos/vestuario. Gesto aprobado: **tomando mate a la salida de la carpa** (mate + bombilla; carpa de campaña detrás). Tinte rojo dusk para empalmar con el Bloque C del Arco 3.

Prompt (EN):
```
The first reference is the APPROVED base composition and style — keep near-100% fidelity of the elderly explorer's silhouette: same seated three-quarter profile facing right, same wide-brimmed fedora, same long textured beard, same intricate lace-like filigree on the coat, same deep red dusk glow, same layered jungle foliage framing, same woodcut/paper-cutout look, same aged-paper border mood — ONLY change the action and add the tent. The second reference painting shows the elderly bearded explorer — use it for identity of face, beard, hat and expedition coat. Black paper cutout silhouette: the same explorer now sits at the mouth of a small expedition canvas tent (A-frame or pup tent as a stacked flat paper cutout layer behind/beside him, guy-ropes and flaps readable as delicate cut-out detail), holding a traditional mate gourd with a metal bombilla straw raised to his lips, sipping mate as if waking calmly from a dream at camp. Layered shadow-theater jungle still around the tent: silhouetted ferns, hanging vines, leafy trees and reeds as stacked flat paper cutout layers. Fine intricate cut-out inner details in the coat, hat, tent and foliage — NOT flat vector shapes, in the manner of Lotte Reiniger's Die Abenteuer des Prinzen Achmed. dramatic deep red dusk tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
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

Nota: Pick canónico: `a2-m07-c2` → `a2-m07-grieta-revenant.png`. Segunda aprobada: `a2-m07-c3` (OTS más pegado) en `a2-m07-grieta-revenant-c3.png`. **Iteración de dirección:** ambas aprobadas quedaron serenas (postal); el prompt se reescribió para describir el colapso **en acción** (bordes desmoronándose, agua que explota en spray, columnas de polvo, bandadas huyendo, dutch angle) — más realismo caótico. Pendiente re-pick sobre los nuevos candidatos. **quiebre fotorrealista Revenant con Charles presente** — el golpe visceral del beat de la palanca, hermano de `a3-m14` (grieta photoreal) pero con la figura en cuadro. Encuadre **OTS extremo**: cámara casi pegada a la nuca — ala del sombrero y hombro ocupan un tercio o más del cuadro, desenfocados por cercanía (foreground bokeh). Charles parado **elevado en una colina/pendiente, lejos** de la destrucción; la laguna que drena y la grieta quedan abajo en el valle, chicas en el cuadro pero de escala colosal (panorama, bruma, escombros lejanos). La enormidad se lee por perspectiva, no por proximidad. El caos es el escudo de las guardas (cara oculta, manos fuera de cuadro). **Desvío controlado del REALITY-BLOCK-CHAOS:** luz de atardecer rojo profundo en vez de `cold muted earth tones`, para sostener el mundo rojo del Arco 2. Solo ref de foto (`charles-jones-referencia.jpeg`) para vestuario, sin la pintura. Compite A/B con `a2-m08` (mismo encuadre en Reiniger). A futuro puede ascender a par FLF (laguna íntegra → drenada) en el gate de madres keyframes.

Prompt (EN):
```
The reference image shows an elderly bearded explorer — use it ONLY for the identity and wardrobe of a man seen from behind (wide-brimmed fedora, long expedition coat, satchel), NEVER show his face. Extreme close over-the-shoulder shot, the camera almost touching the back of his head — his fedora hat brim and shoulder fill a third of the frame as a soft out-of-focus dark foreground, seen strictly from behind, face never visible, hands lowered and out of frame. He stands high on a grassy hillside ridge as violent wind whips his coat and flattens the tall grass. Far below in the vast valley the catastrophe is happening mid-action, NOT a calm vista: a colossal rift actively tearing wider through the green thriving habitat, its cliff edges crumbling and calving off in huge slabs of earth that tumble into the dark, the draining lagoon exploding over the edge in ragged violent cascades that atomize into spray, towering columns of dust and mist punching upward, panicked flocks of birds scattering, uprooted trees sliding into the chasm — tiny in the frame yet immense in scale, overwhelming distance, deep panorama. Tilted unstable horizon, dutch angle, handheld camera shake, heavy directional motion blur, large chunks of debris and grit streaking past close to the lens, dirt and moisture on the lens, coarse film grain, deep blood-red overcast dusk light, photorealistic, gritty documentary realism inspired by The Revenant, no illustration, no silhouette, no paper texture, no serene postcard stillness, vertical 9:16
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
- Montaje: abre el zoom del beat 9 en el reel (durante "vidas paralelas"); still de m01 (silueta de espaldas); corta a `a2-a1` (Charles pasa). El animatic decide si asciende a clip U2V.

**Clip a2-a1 — La pisada / Charles pasa (montaje, sin generación) — beat 9.4**

```yaml
kind: montaje
fuente: a2-m02
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: *(silencio)* — respira; el off de la palanca vive en `a2-a1b`
- Montaje: still de m02 (solo la bota sobre el tronco); corta a `a2-a1c` (nido vacío).

**Clip a2-a1c — El nido vacío (montaje, sin generación) — beat 9.4**

```yaml
kind: montaje
fuente: a2-m02c
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: *(silencio)* — respiro entre la pisada y el FLF
- Montaje: still de m02c (solo el nido vacío sobre el tronco); corta a `a2-a1b` (el huevo cruza).

**Clip a2-a1b — El huevo cruza (beat 9.4)**

```yaml
kind: video-flf
firstFrame: a2-m02a
lastFrame: a2-m02b
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: el mundo de recortes es plano. **Composición diverge** entre frames (m02a = tronco/este lado; m02b = aterrizaje Australia, sin tronco ni grieta) — el FLF morphs el cruce; aprobar el par junto en el gate de madres keyframes (pipeline §2 paso 4) antes de pagar este clip. FLF no acepta 6s.

Motion prompt (EN):
```
The platypus egg tumbles from the fallen log and comes to rest lying on its side on the prosperous far bank among green ferns, hinged paper puppet movement, flat 2D silhouette animation, dramatic deep red tinted background, NO log in the final state, NO rift.
```
- Vision-Audit (EN): sceneDescription: `a speckled platypus egg lying on its side on a prosperous fern bank, deep red tinted background` · action: `the egg tumbles across and lands off-balance on the far side` · mood: `tender, accidental, hopeful`
- Audio: off documental (la palanca) + música tenue — ver [arco-2-off.md](arco-2-off.md)
- Montaje: tras el nido vacío; corta a `a2-a0b` (alzada de la cría, cierre del zoom). Orden del beat 9: `a2-a0` → `a2-a1` → `a2-a1c` → `a2-a1b` → `a2-a0b`, entre `a3-b3` y `a3-b4`. La consecuencia (beat 9.6) no tiene plano propio — la resuelve el corte a `a3-b4` (Argentina seca) + off.

**Clip a2-a0b — Las manos levantan a la cría (montaje, sin generación) — cierre del zoom 9**

```yaml
kind: montaje
fuente: a2-m03
duration: 1.5
```

duration (montaje): 1–1.5s
- Audio: off documental (beat 9.3: un gesto de ternura, casi accidental) — remate tierno tras el huevo
- Montaje: still de m03 (manos alzando la cría); cierra el zoom del beat 9. Corta a `a3-b4` (Argentina seca).

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
