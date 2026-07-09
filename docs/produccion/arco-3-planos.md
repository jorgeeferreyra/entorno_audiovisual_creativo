# Arco 3 — Plano a plano listo para producir

> Bajada de producción del [Arco 3: Ornitorrincos](../redes/arco-3-ornitorrincos.md) a **fichas de ingesta directa** en wind-comic (campos 1:1 con la UI).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../biblia-serie.md), anclas de estilo y STYLE-BLOCK en [biblia-visual.md](biblia-visual.md), plantillas y convención de IDs/archivos en [pipeline-wind-comic.md](pipeline-wind-comic.md) §5–6, fichas de personaje en [personajes-studio.md](personajes-studio.md).
> Este archivo es la fuente de verdad de los **prompts finales de producción** del Arco 3.

Convenciones de este archivo:

- Prompts e inputs de modelo **en inglés**; títulos, audio y montaje en español.
- El STYLE-BLOCK de [biblia-visual.md](biblia-visual.md) §1 va embebido literal en cada prompt de imagen (duplicación aceptada para copiar-pegar).
- El movimiento de cámara va en el campo **cameraPreset** (12 presets operativos de `/dashboard/u2v`), nunca repetido en el motion prompt; si no hay preset equivalente, se describe en el prompt y el preset queda vacío (el motor agrega un push-in sutil por defecto, compatible).
- Registro del arco: **Attenborough sincero**, sin chistes verbales. El humor es estructural (solemnidad extrema aplicada a ornitorrincos… ahora en teatro de sombras).
- Estilo del arco: **siluetas recortadas estilo Lotte Reiniger sobre fondos tintados** (ref. *El príncipe Achmed*). Las siluetas siempre son negras; el color vive en el tinte del fondo según el guion de color de abajo.

## Guion de color (tinte de fondo por beat)

La emoción de cada plano la carga el **tinte del fondo**, no el animal. Cada prompt embebe su línea de tinte:

| Beat | Tinte (línea EN del prompt) |
|---|---|
| Reel A — Pangea feliz (a1–a4) | `warm amber and saturated green tinted background` |
| Reel A — La grieta (a5–a6) | vira a `dramatic deep red tinted background` |
| Reel B — Australia próspera (b1–b2) | `saturated lush green tinted background` |
| Reel B — Argentina en declive (b3–b4) | `cold desaturated grey tinted background` |
| Reel C — Rocas Coloradas (c1) | `deep red dusk tinted background` |
| Reel C — Fosilización (c2) | el tinte rojo se apaga hacia `stone grey` |
| Reel C — Salto a la realidad (c3–c4) | sin tinte: registro fotográfico real |

---

## Sección 1 — Imágenes madre (generar PRIMERO)

Generar cada una en wind-comic (Flux/Minimax ~¥0.3, o preview-shot en `/dashboard/create` con video apagado), elegir la mejor y guardarla con su **archivo destino** (convención en [pipeline-wind-comic.md](pipeline-wind-comic.md) §5). Ese archivo es lo que se sube como `firstFrame`/`lastFrame` en los clips de la Sección 2.

Campos fijos de todas las fichas (salvo indicación): `style: Woodcut Print` (preset más cercano de la galería: `bold black lines, high contrast, textured paper` — compatible con silueta; el look real lo carga el prompt) · `aspect: 9:16`.

### Personajes (una imagen madre por animal — lock de consistencia)

> La distinción entre animales es **por contorno** (tamaño, postura, muescas del recorte), no por pelaje: es lo único legible en silueta y lo más fácil de mantener consistente.

**a3-m01 — Madre ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`
- Prompt (EN):
```
Black paper cutout silhouette of a mother platypus in expressive side profile, rounded gentle contour, head slightly tilted, resting among silhouetted Pangea ferns, warm amber and saturated green tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m02 — Cría de ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m02-cria-ornitorrinco.png`
- Prompt (EN):
```
Black paper cutout silhouette of a small baby platypus in playful side profile, tiny rounded contour clearly smaller than an adult, tail curled upward mid-hop, silhouetted Pangea plants around, warm amber and saturated green tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m03 — Padre ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m03-padre-ornitorrinco.png`
- Prompt (EN):
```
Black paper cutout silhouette of an adult male platypus in side profile, larger and more angular contour than the mother, a distinctive notch cut into the outline of its brow, standing alert among silhouetted Pangea plants, warm amber and saturated green tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m04 — Huevo de ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m04-huevo.png`
- Prompt (EN):
```
Black paper cutout silhouette of a single egg resting in a small nest on a mossy log, close-up, delicate cut-out details in the nest twigs, warm amber tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Locaciones / ambientes

> Paisajes en **capas de recorte** (siluetas de foreground sobre fondo tintado), como los sets multiplano de Reiniger.

**a3-m05 — Paisaje Pangea (establishing, transversal)**
- Archivo destino: `assets/arco-3/madre/a3-m05-pangea.png`
- Prompt (EN):
```
Layered black paper cutout landscape of the supercontinent Pangea seen from a hill, silhouetted exuberant vegetation and hills in stacked cutout layers, warm amber and saturated green tinted background sky, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m06 — Paisaje Pangea partido (la grieta abierta)** — último frame del clip FLF `a3-a5`.
- Archivo destino: `assets/arco-3/madre/a3-m06-pangea-partida.png`
- Prompt (EN):
```
The same layered paper cutout Pangea landscape now torn apart by a deep widening rift, the black cutout land split in two like ripped paper, silhouetted water rising in the gap, dramatic deep red tinted background sky, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m07 — Rocas Coloradas (puente con la locación real, transversal)**
- Archivo destino: `assets/arco-3/madre/a3-m07-rocas-coloradas.png`
- Prompt (EN):
```
Layered black paper cutout landscape of Martian-like rock formations and lagoons, Patagonian badlands in stacked silhouette layers, deep red and orange tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m08 — Ambiente Australia próspera**
- Archivo destino: `assets/arco-3/madre/a3-m08-australia-prospera.png`
- Prompt (EN):
```
Layered black paper cutout landscape of a thriving wetland, silhouetted reeds, water plants and gentle ripples in delicate cut-out detail, saturated lush green tinted background, warm prosperous glow, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m09 — Ambiente Argentina en declive**
- Archivo destino: `assets/arco-3/madre/a3-m09-argentina-declive.png`
- Prompt (EN):
```
Layered black paper cutout landscape of an arid drying plain, silhouetted cracked earth lines and sparse withered plants, cold desaturated grey tinted background, fading light, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Par de fosilización (primer + último frame del clip FLF `a3-c2`)

**a3-m10 — Ornitorrinco recostado sobre roca colorada**
- Archivo destino: `assets/arco-3/madre/a3-m10-ornitorrinco-roca.png`
- Prompt (EN):
```
Black paper cutout silhouette of an old platypus lying down to rest on a silhouetted red rock formation, calm curled profile, deep red dusk tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a3-m11 — Fósil de piedra**
- Archivo destino: `assets/arco-3/madre/a3-m11-fosil-piedra.png`
- Prompt (EN):
```
The same platypus silhouette now frozen and filled with stone texture, a fossil relief embedded in the silhouetted red rock, fine cut-out bone detail inside the contour, the red tint of the background fading to stone grey, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

### Recurso de marco (transversal)

**a3-m12 — Página de cuaderno**
- Archivo destino: `assets/arco-3/madre/a3-m12-pagina-cuaderno.png`
- Prompt (EN):
```
An old diary page with handwritten annotations, crossed-out notes, a hand-drawn map, small black paper cutout silhouettes of animals pinned among the notes, sepia tones, aged paper texture, vertical 9:16
```

### Salto a la realidad (rompe la estética silueta A PROPÓSITO)

**a3-m13 — Fósil en el yacimiento actual**
- `style: Photographic documentary` (sin STYLE-BLOCK: debe leerse como registro real, no silueta)
- Archivo destino: `assets/arco-3/madre/a3-m13-fosil-yacimiento.png`
- Prompt (EN):
```
A platypus fossil embedded in reddish rock at a present-day paleontological site in the Patagonian badlands, photographic documentary realism, natural daylight, fine mineral detail, realistic stone textures, no illustration, no silhouette, no paper texture, vertical 9:16
```

### Material de origen real (NO se genera)

- **rocas-coloradas-real** — foto real de la locación: `assets/fuentes/rocas-coloradas-real.jpg` (16:9 apaisada). Remate del Reel C (clip `a3-c4`); reencuadrar a 9:16 en montaje.
- **m-mano (reutilizada del Arco 1)** — imagen madre "mano con cadenita" de [biblia-visual.md](biblia-visual.md) §Arco 1. NO se genera nueva; se insertan 1–2 frames en montaje de `a3-a5`.

---

## Sección 2 — Desglose plano a plano (fichas U2V / U2V-FLF)

Regla del [pipeline](pipeline-wind-comic.md): **un personaje por clip**, cruces por corte. Herramienta: `/dashboard/u2v` (U2V con 5/6s va por Minimax I2V ~¥0.1/s; U2V-FLF va por Kling ~¥0.2/s y **solo acepta 5 o 10s**). Audio por defecto de todo el arco: **off documental (Attenborough) grabado propio** + música suave sin percusión.

### Reel A — "La grieta" (~35s)

**Clip a3-a1 — Apertura: página de cuaderno**
- Herramienta: U2V
- firstFrame: a3-m12 (`assets/arco-3/madre/a3-m12-pagina-cuaderno.png`)
- cameraPreset: `push-in`
- duration: 5
- Motion prompt (EN):
```
An old diary page, handwritten annotations and a hand-drawn map slowly coming into focus, small pinned paper silhouettes trembling slightly, subtle paper grain movement, sepia tones.
```
- Vision-Audit (EN): sceneDescription: `close-up of an aged diary page with handwritten notes, a hand-drawn map and small pinned paper silhouettes` · action: `annotations and map gradually come into focus` · mood: `intimate, mysterious`
- Audio: off documental (intro) + música tenue
- Montaje: abre el reel; corta a a3-a2 con fade suave

**Clip a3-a2 — Establishing Pangea**
- Herramienta: U2V
- firstFrame: a3-m05 (`assets/arco-3/madre/a3-m05-pangea.png`)
- cameraPreset: — (el drift aéreo no tiene preset; va en el prompt)
- duration: 5
- Motion prompt (EN):
```
Gentle drift across the layered paper cutout Pangea landscape, silhouetted vegetation swaying like paper in a breeze, cutout layers sliding in parallax, flat 2D silhouette animation, amber and green tinted background.
```
- Vision-Audit (EN): sceneDescription: `wide layered silhouette view of the Pangea supercontinent on a tinted background` · action: `slow glide across the cutout landscape, paper vegetation swaying, layers in parallax` · mood: `majestic, serene`
- Audio: off documental + música tenue
- Montaje: viene de a3-a1; corta a a3-a3

**Clip a3-a3 — La madre en su ritual cotidiano**
- Herramienta: U2V
- firstFrame: a3-m01 (`assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`)
- cameraPreset: `locked-tripod`
- duration: 5
- Motion prompt (EN):
```
The mother platypus silhouette calmly grooming by a silhouetted stream, head tilting gently in profile, hinged paper puppet movement, flat 2D silhouette animation, tender everyday ritual, warm amber and green tinted background.
```
- Vision-Audit (EN): sceneDescription: `silhouetted stream in Pangea on a warm tinted background` · action: `the mother platypus silhouette grooms and moves calmly in profile` · mood: `tender, serene`
- Audio: off documental (presenta la familia)
- Montaje: intercut con a3-a4 para dar "familia unida" sin generarlos juntos

**Clip a3-a4 — La cría jugando**
- Herramienta: U2V
- firstFrame: a3-m02 (`assets/arco-3/madre/a3-m02-cria-ornitorrinco.png`)
- cameraPreset: `locked-tripod`
- duration: 5
- Motion prompt (EN):
```
The baby platypus silhouette hopping and playing near the silhouetted water, tail bouncing, small paper splashes, hinged paper puppet movement, flat 2D silhouette animation, warm amber and green tinted background.
```
- Vision-Audit (EN): sceneDescription: `silhouetted water's edge on a warm tinted background` · action: `the baby platypus silhouette hops and plays, paper splashes` · mood: `joyful, curious`
- Audio: off documental (continúa)
- Montaje: intercut con a3-a3; cierra el bloque "unidad" y corta a a3-a5

**Clip a3-a5 — La grieta (transición-gancho)**
- Herramienta: U2V-FLF
- firstFrame: a3-m05 (`assets/arco-3/madre/a3-m05-pangea.png`)
- lastFrame: a3-m06 (`assets/arco-3/madre/a3-m06-pangea-partida.png`)
- cameraPreset: — (el teatro de sombras es plano: el temblor va descripto en el prompt, no como cámara en mano)
- duration: 5 (FLF no acepta 6s)
- Motion prompt (EN):
```
The layered cutout Pangea landscape trembles like shaken paper, the black cutout land tears apart as if ripped in two, silhouetted water floods the widening chasm, the background tint shifting from warm amber to deep red, flat 2D silhouette animation, dramatic and sincere.
```
- Vision-Audit (EN): sceneDescription: `the layered cutout Pangea landscape breaking apart, tint shifting to red` · action: `the cutout ground trembles and rips in two, water floods the chasm` · mood: `dramatic, ominous`
- Audio: off documental (el quiebre) + rumble grave
- Montaje: insertar 1–2 frames subliminales de m-mano (mano con cadenita, Arco 1) en el pico del temblor; corta a a3-a6

**Clip a3-a6 — La separación**
- Herramienta: U2V
- firstFrame: a3-m01 (`assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`)
- cameraPreset: `push-in`
- duration: 5
- Motion prompt (EN):
```
The mother platypus silhouette stands at the edge of the cutout chasm in profile, head slowly lowering as she looks across to the far side, silhouetted plants trembling in the wind, grief held in stillness, hinged paper puppet movement, flat 2D silhouette animation, deep red tinted background.
```
- Vision-Audit (EN): sceneDescription: `the edge of the cutout chasm on a deep red tinted background, far shore in the distance` · action: `the mother platypus silhouette stands still in profile, head slowly lowering` · mood: `grief, restrained sorrow`
- Audio: off documental (la despedida)
- Montaje: corta contra el padre con el huevo (a3-m03 + a3-m04) al otro lado de la grieta; cierra el Reel A

### Reel B — "Vidas paralelas" (~30s, pantalla partida por montaje)

> La pantalla partida = dos clips independientes montados (mitad superior/inferior del 9:16). No se generan personajes juntos. El contraste próspero/árido lo aporta el **tinte de fondo** (verde saturado vs. gris frío, ver guion de color); si el fondo no acompaña, cutaways con a3-m08/a3-m09.

**Clip a3-b1 — Padre próspero en Australia**
- Herramienta: U2V
- firstFrame: a3-m03 (`assets/arco-3/madre/a3-m03-padre-ornitorrinco.png`)
- cameraPreset: `tracking`
- duration: 5
- Motion prompt (EN):
```
The male platypus silhouette gliding actively through silhouetted reeds and water, energetic confident movement, hinged paper puppet movement, flat 2D silhouette animation, saturated lush green tinted background, warm prosperous glow.
```
- Vision-Audit (EN): sceneDescription: `silhouetted Australian wetland on a saturated green tinted background` · action: `the male platypus silhouette swims and moves actively, healthy` · mood: `warm, prosperous`
- Audio: off documental (adaptación)
- Montaje: mitad de pantalla partida con a3-b3 (Australia arriba)

**Clip a3-b2 — La cría eclosionada, creciendo**
- Herramienta: U2V
- firstFrame: a3-m02 (`assets/arco-3/madre/a3-m02-cria-ornitorrinco.png`; el prompt la describe crecida)
- cameraPreset: `tracking`
- duration: 5
- Motion prompt (EN):
```
The young platypus silhouette exploring confidently among silhouetted wetland plants, taller and steadier than before, hinged paper puppet movement, flat 2D silhouette animation, saturated lush green tinted background.
```
- Vision-Audit (EN): sceneDescription: `silhouetted wetland on a saturated green tinted background` · action: `the young platypus silhouette explores confidently, growing stronger` · mood: `hopeful, thriving`
- Audio: off documental (la línea que prospera)
- Montaje: intercut dentro del lado próspero

**Clip a3-b3 — La madre en declive**
- Herramienta: U2V
- firstFrame: a3-m01 (`assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`)
- cameraPreset: `locked-tripod` (quietud = declive, contra el movimiento del lado próspero)
- duration: 5
- Motion prompt (EN):
```
The mother platypus silhouette moving slowly across a silhouetted cracked plain, head low, weakened halting steps, hinged paper puppet movement, flat 2D silhouette animation, cold desaturated grey tinted background, sincere and mournful.
```
- Vision-Audit (EN): sceneDescription: `silhouetted cracked Patagonian plain on a cold grey tinted background` · action: `the mother platypus silhouette moves slowly, weakened, head low` · mood: `mournful, sincere`
- Audio: off documental (la pérdida)
- Montaje: mitad de pantalla partida con a3-b1 (Argentina abajo)

**Clip a3-b4 — El ambiente argentino secándose**
- Herramienta: U2V
- firstFrame: a3-m09 (`assets/arco-3/madre/a3-m09-argentina-declive.png`)
- cameraPreset: `pull-out`
- duration: 5
- Motion prompt (EN):
```
Silhouetted crack lines spreading across the cutout plain, paper plants slowly wilting and folding down, time-lapse feel, flat 2D silhouette animation, the grey tinted background growing colder and dimmer.
```
- Vision-Audit (EN): sceneDescription: `arid cutout Patagonian plain on a cold grey tinted background` · action: `crack lines spread and paper vegetation wilts, time-lapse feel` · mood: `cold, desolate`
- Audio: off documental (el ecosistema cambia)
- Montaje: transición hacia el Reel C; corta a a3-c1

### Reel C — "El último" (PIEZA ESTRELLA, ~30s)

**Clip a3-c1 — El último llega a las rocas coloradas**
- Herramienta: U2V
- firstFrame: a3-m10 (`assets/arco-3/madre/a3-m10-ornitorrinco-roca.png`; establishing opcional con a3-m07 si se abre con locación)
- cameraPreset: `tracking`
- duration: 5
- Motion prompt (EN):
```
The last old platypus silhouette slowly walks in profile across silhouetted red rock formations and curls down to rest, deliberate weary steps, hinged paper puppet movement, flat 2D silhouette animation, deep red dusk tinted background, calm acceptance.
```
- Vision-Audit (EN): sceneDescription: `silhouetted rock formations on a deep red dusk tinted background` · action: `the old platypus silhouette walks slowly and lies down to rest` · mood: `calm acceptance, solemn`
- Audio: off documental (el final del linaje argentino)
- Montaje: viene de a3-b4; corta a a3-c2

**Clip a3-c2 — La fosilización (transición-gancho)**
- Herramienta: U2V-FLF
- firstFrame: a3-m10 (`assets/arco-3/madre/a3-m10-ornitorrinco-roca.png`)
- lastFrame: a3-m11 (`assets/arco-3/madre/a3-m11-fosil-piedra.png`)
- cameraPreset: `locked-tripod` (la transformación pone todo el movimiento)
- duration: 5 (FLF no acepta 6s)
- Motion prompt (EN):
```
The resting platypus silhouette slowly freezes and fills with stone texture, its black cutout becoming a fossil relief embedded in the silhouetted rock, fine bone detail emerging inside the contour, the red background tint fading to stone grey, flat 2D silhouette animation, solemn and beautiful.
```
- Vision-Audit (EN): sceneDescription: `silhouetted red rock at dusk, the resting platypus silhouette` · action: `the silhouette freezes and fills with stone texture, becoming a fossil, the tint fades to grey` · mood: `solemn, beautiful, final`
- Audio: off documental (se apaga) + silencio final
- Montaje: corta DURO a a3-c3

**Clip a3-c3 — El fósil hoy (salto a la realidad)**
- Herramienta: U2V
- firstFrame: a3-m13 (`assets/arco-3/madre/a3-m13-fosil-yacimiento.png`)
- cameraPreset: `pull-out` (el zoom-out que abre el plano y prepara el corte a la foto real)
- duration: 5
- Motion prompt (EN):
```
A platypus fossil embedded in red rock at a present-day excavation site, motionless, ambient daylight shifting subtly, faint dust drifting in the air, photographic documentary realism.
```
- Vision-Audit (EN): sceneDescription: `present-day paleontological site in red rock badlands` · action: `the fossil rests motionless as the view widens` · mood: `real, quiet, revelatory`
- Audio: off documental (remate: la tumba del protagonista de la trilogía)
- Montaje: viene de a3-c2 con corte duro (silueta → foto); el pull-out termina abriendo el plano y corta a a3-c4

**Clip a3-c4 — Foto real de Rocas Coloradas (remate final)**
- Herramienta: ninguna (montaje; NO se genera)
- Fuente: `assets/fuentes/rocas-coloradas-real.jpg` (16:9; reencuadrar a 9:16)
- duration: 3–4s
- Sobreimpreso (opcional): "La Fundación protege hoy este yacimiento" — humor negro (el criminal custodiando la escena del crimen)
- Audio: silencio u off breve
- Montaje: cierra el "salto a la realidad" a3-c2 → a3-c3 → a3-c4; es el pago emocional del arco

---

## Sección 3 — Stories S1–S5 (derivadas por montaje, sin generación)

Las stories del [calendario](../redes/calendario-publicacion.md) (Semana 1) se arman **recortando/reencuadrando** los clips ya generados a 15s. Cero generación extra.

| Story | Beat | Fuente (clips) | Nota de montaje |
|---|---|---|---|
| S1 | La familia feliz | a3-a3 + a3-a4 | Recorte a 15s; abrir con a3-m12 si se quiere marco |
| S2 | La grieta | a3-a5 | 15s; sticker/encuesta según calendario |
| S3 | La despedida | a3-a6 | 15s; texto sobrio |
| S4 | El declive | a3-b3 | 15s; puede sumar a3-b4 de cierre |
| S5 | El fósil | a3-c2 + a3-c3 + a3-c4 | 15s; remate con la foto real de la locación |

---

## Costo estimado del arco

| Etapa | Cálculo | Total aprox. |
|---|---|---|
| Imágenes madre | 13 generadas × ¥0.3 | ~¥3.9 |
| Clips U2V (Minimax I2V, 5s) | 11 × ¥0.5 | ~¥5.5 |
| Clips U2V-FLF (Kling, 5s) | 2 × ~¥1 | ~¥2 |
| **Total** | | **~¥11.4** |

Dentro del presupuesto del [pipeline](pipeline-wind-comic.md) §3. Kling (FLF) se reserva a las dos transiciones-gancho; el resto va por Minimax.

---

## Guardas de canon aplicadas

- Registro Attenborough **sincero**, sin chistes verbales (tesis del arco).
- La **mano negra** aparece solo como frame subliminal en a3-a5, reutilizando su imagen madre del Arco 1 (no se genera nada nuevo). En el lenguaje de teatro de sombras, la mano negra es **nativa del estilo**: una silueta más dentro del mundo, no un elemento ajeno.
- El **fósil final ES el del Ep.1** (canon), pero NO existe plano de archivo del rodaje: el remate se resuelve con a3-m13 (fósil en registro fotográfico) + la foto real de la locación (`assets/fuentes/rocas-coloradas-real.jpg`). El corte silueta → foto es el "salto a la realidad".
- **CFJ no aparece** en este arco, pero el estilo silueta deja alineado el Arco 2: "CFJ nunca de frente" se cumple por diseño (Charles ES una silueta).
- Anacronismos: no se fuerzan en este arco por su registro emocional; quedan disponibles como recurso si hiciera falta.
