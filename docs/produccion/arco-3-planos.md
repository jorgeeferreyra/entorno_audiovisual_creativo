# Arco 3 — Plano a plano listo para producir

> Bajada de producción del [Arco 3: Ornitorrincos](../redes/arco-3-ornitorrincos.md) a **fichas de ingesta directa** en wind-comic (campos 1:1 con la UI).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../biblia-serie.md), anclas de estilo y STYLE-BLOCK en [biblia-visual.md](biblia-visual.md), plantillas y convención de IDs/archivos en [pipeline-wind-comic.md](pipeline-wind-comic.md) §5–6, fichas de personaje en [personajes-studio.md](personajes-studio.md).
> Este archivo es la fuente de verdad de los **prompts finales de producción** del Arco 3.

Convenciones de este archivo:

- Prompts e inputs de modelo **en inglés**; títulos, audio y montaje en español.
- El STYLE-BLOCK de [biblia-visual.md](biblia-visual.md) §1 va embebido literal en cada prompt de imagen (duplicación aceptada para copiar-pegar).
- El movimiento de cámara va en el campo **cameraPreset** (12 presets operativos de `/dashboard/u2v`), nunca repetido en el motion prompt; si no hay preset equivalente, se describe en el prompt y el preset queda vacío (el motor agrega un push-in sutil por defecto, compatible).
- Registro del arco: **Attenborough sincero**, sin chistes verbales. El humor es estructural (solemnidad extrema aplicada a ornitorrincos).

---

## Sección 1 — Imágenes madre (generar PRIMERO)

Generar cada una en wind-comic (Flux/Minimax ~¥0.3, o preview-shot en `/dashboard/create` con video apagado), elegir la mejor y guardarla con su **archivo destino** (convención en [pipeline-wind-comic.md](pipeline-wind-comic.md) §5). Ese archivo es lo que se sube como `firstFrame`/`lastFrame` en los clips de la Sección 2.

Campos fijos de todas las fichas (salvo indicación): `style: Illustrated documentary` · `aspect: 9:16`.

### Personajes (una imagen madre por animal — lock de consistencia)

**a3-m01 — Madre ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`
- Prompt (EN):
```
A realistic yet endearing platypus, mother figure, resting on the ground of a lush Pangea landscape, soft natural light, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

**a3-m02 — Cría de ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m02-cria-ornitorrinco.png`
- Prompt (EN):
```
A small baby platypus, playful, lush Pangea background, same look as its mother, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

**a3-m03 — Padre ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m03-padre-ornitorrinco.png`
- Prompt (EN):
```
A realistic yet endearing adult male platypus, subtly distinct from the mother (slightly darker fur, a small scar over one eye), lush Pangea background, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

**a3-m04 — Huevo de ornitorrinco**
- Archivo destino: `assets/arco-3/madre/a3-m04-huevo.png`
- Prompt (EN):
```
A single platypus egg resting in a small nest on a mossy log, close-up, soft light, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

### Locaciones / ambientes

**a3-m05 — Paisaje Pangea (establishing, transversal)**
- Archivo destino: `assets/arco-3/madre/a3-m05-pangea.png`
- Prompt (EN):
```
The supercontinent Pangea seen from a hill, prehistoric sky, exuberant vegetation, explorer's notebook illustration, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

**a3-m06 — Paisaje Pangea partido (la grieta abierta)** — último frame del clip FLF `a3-a5`.
- Archivo destino: `assets/arco-3/madre/a3-m06-pangea-partida.png`
- Prompt (EN):
```
The same Pangea landscape now torn apart by a deep widening rift, a chasm splitting the land in two, water rising in the gap, dramatic prehistoric sky, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

**a3-m07 — Rocas Coloradas (puente con la locación real, transversal)**
- Archivo destino: `assets/arco-3/madre/a3-m07-rocas-coloradas.png`
- Prompt (EN):
```
Martian-like reddish rock formations, orange lagoons, Patagonian badlands, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, deep red and orange palette, sepia edges, vertical 9:16
```

**a3-m08 — Ambiente Australia próspera**
- Archivo destino: `assets/arco-3/madre/a3-m08-australia-prospera.png`
- Prompt (EN):
```
A thriving green wetland environment, abundant water and vegetation, warm prosperous light, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, lush green palette, sepia edges, vertical 9:16
```

**a3-m09 — Ambiente Argentina en declive**
- Archivo destino: `assets/arco-3/madre/a3-m09-argentina-declive.png`
- Prompt (EN):
```
An increasingly arid, drying environment, cracked earth, sparse dry vegetation, cold fading light, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, muted earthy red and grey palette, sepia edges, vertical 9:16
```

### Par de fosilización (primer + último frame del clip FLF `a3-c2`)

**a3-m10 — Ornitorrinco recostado sobre roca colorada**
- Archivo destino: `assets/arco-3/madre/a3-m10-ornitorrinco-roca.png`
- Prompt (EN):
```
An old platypus lying down to rest on red rock, calm and peaceful, soft dusk light, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, deep red and orange palette, sepia edges, vertical 9:16
```

**a3-m11 — Fósil de piedra**
- Archivo destino: `assets/arco-3/madre/a3-m11-fosil-piedra.png`
- Prompt (EN):
```
The same platypus now turned entirely to stone, a fossil embedded in red rock, fine mineral detail, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture with faint ink lines, deep red and orange palette, sepia edges, vertical 9:16
```

### Recurso de marco (transversal)

**a3-m12 — Página de cuaderno**
- Archivo destino: `assets/arco-3/madre/a3-m12-pagina-cuaderno.png`
- Prompt (EN):
```
An old diary page with handwritten annotations, crossed-out notes, a hand-drawn map, sepia tones, aged paper texture, vertical 9:16
```

### Salto a la realidad (rompe la estética cuaderno A PROPÓSITO)

**a3-m13 — Fósil en el yacimiento actual**
- `style: Photographic documentary` (sin STYLE-BLOCK: debe leerse como registro real, no ilustración)
- Archivo destino: `assets/arco-3/madre/a3-m13-fosil-yacimiento.png`
- Prompt (EN):
```
A platypus fossil embedded in reddish rock at a present-day paleontological site in the Patagonian badlands, photographic documentary realism, natural daylight, fine mineral detail, realistic stone textures, no illustration, no paper texture, vertical 9:16
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
An old diary page, handwritten annotations and a hand-drawn map slowly coming into focus, subtle paper grain movement, sepia tones.
```
- Vision-Audit (EN): sceneDescription: `close-up of an aged diary page with handwritten notes and a hand-drawn map` · action: `annotations and map gradually come into focus` · mood: `intimate, mysterious`
- Audio: off documental (intro) + música tenue
- Montaje: abre el reel; corta a a3-a2 con fade suave

**Clip a3-a2 — Establishing Pangea**
- Herramienta: U2V
- firstFrame: a3-m05 (`assets/arco-3/madre/a3-m05-pangea.png`)
- cameraPreset: — (el drift aéreo no tiene preset; va en el prompt)
- duration: 5
- Motion prompt (EN):
```
Gentle aerial drift over the lush Pangea supercontinent under a prehistoric sky, exuberant vegetation swaying, notebook illustration style.
```
- Vision-Audit (EN): sceneDescription: `wide aerial view of the Pangea supercontinent, prehistoric sky` · action: `slow aerial glide over the landscape, vegetation swaying` · mood: `majestic, serene`
- Audio: off documental + música tenue
- Montaje: viene de a3-a1; corta a a3-a3

**Clip a3-a3 — La madre en su ritual cotidiano**
- Herramienta: U2V
- firstFrame: a3-m01 (`assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`)
- cameraPreset: `locked-tripod`
- duration: 5
- Motion prompt (EN):
```
The mother platypus calmly grooming and moving by a Pangea stream, tender everyday ritual, soft natural light, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `a stream in lush Pangea, soft natural light` · action: `the mother platypus grooms and moves calmly by the water` · mood: `tender, serene`
- Audio: off documental (presenta la familia)
- Montaje: intercut con a3-a4 para dar "familia unida" sin generarlos juntos

**Clip a3-a4 — La cría jugando**
- Herramienta: U2V
- firstFrame: a3-m02 (`assets/arco-3/madre/a3-m02-cria-ornitorrinco.png`)
- cameraPreset: `locked-tripod`
- duration: 5
- Motion prompt (EN):
```
The baby platypus playing and splashing near the water, curious and joyful, warm Pangea background, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `water's edge in warm Pangea landscape` · action: `the baby platypus plays and splashes near the water` · mood: `joyful, curious`
- Audio: off documental (continúa)
- Montaje: intercut con a3-a3; cierra el bloque "unidad" y corta a a3-a5

**Clip a3-a5 — La grieta (transición-gancho)**
- Herramienta: U2V-FLF
- firstFrame: a3-m05 (`assets/arco-3/madre/a3-m05-pangea.png`)
- lastFrame: a3-m06 (`assets/arco-3/madre/a3-m06-pangea-partida.png`)
- cameraPreset: `handheld`
- duration: 5 (FLF no acepta 6s)
- Motion prompt (EN):
```
The Pangea landscape trembles and a deep rift tears the land apart, the ground splits in two as water floods the widening chasm, dramatic and sincere, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `the Pangea landscape breaking apart` · action: `the ground trembles and splits in two, water floods the widening chasm` · mood: `dramatic, ominous`
- Audio: off documental (el quiebre) + rumble grave
- Montaje: insertar 1–2 frames subliminales de m-mano (mano con cadenita, Arco 1) en el pico del temblor; corta a a3-a6

**Clip a3-a6 — La separación**
- Herramienta: U2V
- firstFrame: a3-m01 (`assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`)
- cameraPreset: `push-in`
- duration: 5
- Motion prompt (EN):
```
The mother platypus stands at the edge of the chasm looking across to the far side, wind and distance, grief held in stillness, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `the edge of the new chasm, wind, far shore in the distance` · action: `the mother platypus stands still, looking across the chasm` · mood: `grief, restrained sorrow`
- Audio: off documental (la despedida)
- Montaje: corta contra el padre con el huevo (a3-m03 + a3-m04) al otro lado de la grieta; cierra el Reel A

### Reel B — "Vidas paralelas" (~30s, pantalla partida por montaje)

> La pantalla partida = dos clips independientes montados (mitad superior/inferior del 9:16). No se generan personajes juntos. El contraste próspero/árido lo aportan los ambientes en el prompt; si el fondo no acompaña, cutaways con a3-m08/a3-m09.

**Clip a3-b1 — Padre próspero en Australia**
- Herramienta: U2V
- firstFrame: a3-m03 (`assets/arco-3/madre/a3-m03-padre-ornitorrinco.png`)
- cameraPreset: `tracking`
- duration: 5
- Motion prompt (EN):
```
The adult male platypus thriving in a lush green wetland, abundant water, healthy and active, warm prosperous light, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `lush green Australian wetland, abundant water` · action: `the male platypus swims and moves actively, healthy` · mood: `warm, prosperous`
- Audio: off documental (adaptación)
- Montaje: mitad de pantalla partida con a3-b3 (Australia arriba)

**Clip a3-b2 — La cría eclosionada, creciendo**
- Herramienta: U2V
- firstFrame: a3-m02 (`assets/arco-3/madre/a3-m02-cria-ornitorrinco.png`; el prompt la describe crecida)
- cameraPreset: `tracking`
- duration: 5
- Motion prompt (EN):
```
The hatched young platypus growing stronger in the green Australian wetland, exploring confidently, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `green Australian wetland` · action: `the young platypus explores confidently, growing stronger` · mood: `hopeful, thriving`
- Audio: off documental (la línea que prospera)
- Montaje: intercut dentro del lado próspero

**Clip a3-b3 — La madre en declive**
- Herramienta: U2V
- firstFrame: a3-m01 (`assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`)
- cameraPreset: `locked-tripod` (quietud = declive, contra el movimiento del lado próspero)
- duration: 5
- Motion prompt (EN):
```
The mother platypus struggling in a drying, cracked landscape, slower and weaker, cold fading light, sincere and mournful, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `drying, cracked Patagonian landscape, cold light` · action: `the mother platypus moves slowly, weakened` · mood: `mournful, sincere`
- Audio: off documental (la pérdida)
- Montaje: mitad de pantalla partida con a3-b1 (Argentina abajo)

**Clip a3-b4 — El ambiente argentino secándose**
- Herramienta: U2V
- firstFrame: a3-m09 (`assets/arco-3/madre/a3-m09-argentina-declive.png`)
- cameraPreset: `pull-out`
- duration: 5
- Motion prompt (EN):
```
A drying Patagonian environment, cracked earth spreading, sparse vegetation withering under cold light, time-lapse feel, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `arid Patagonian environment, cracked earth` · action: `the land dries and vegetation withers, time-lapse feel` · mood: `cold, desolate`
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
The last old platypus slowly walks across Martian-like red rock formations and lies down to rest, dusk light, calm acceptance, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `Martian-like red rock formations at dusk` · action: `the old platypus walks slowly and lies down to rest` · mood: `calm acceptance, solemn`
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
The resting platypus slowly turns to stone, animation dissolving into a fossil embedded in red rock, fine mineral detail emerging, solemn and beautiful, documentary illustration style.
```
- Vision-Audit (EN): sceneDescription: `red rock at dusk, the resting platypus` · action: `the platypus gradually turns to stone, becoming a fossil` · mood: `solemn, beautiful, final`
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
- Montaje: viene de a3-c2 con corte duro (ilustración → foto); el pull-out termina abriendo el plano y corta a a3-c4

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
- La **mano negra** aparece solo como frame subliminal en a3-a5, reutilizando su imagen madre del Arco 1 (no se genera nada nuevo).
- El **fósil final ES el del Ep.1** (canon), pero NO existe plano de archivo del rodaje: el remate se resuelve con a3-m13 (fósil en registro fotográfico) + la foto real de la locación (`assets/fuentes/rocas-coloradas-real.jpg`). El corte ilustración → foto es el "salto a la realidad".
- **CFJ no aparece** en este arco (su regla de "nunca de frente" no aplica acá, pero queda anotado).
- Anacronismos: no se fuerzan en este arco por su registro emocional; quedan disponibles como recurso si hiciera falta.
