# Biblia visual — Imágenes madre y anclas de estilo

> Fuente de consistencia visual. Las imágenes madre se generan PRIMERO y son referencia/primer frame de todos los clips posteriores. Flujo técnico en [pipeline-wind-comic.md](pipeline-wind-comic.md). Canon en [../biblia-serie.md](../biblia-serie.md).

---

## 1. Anclas de estilo (aplican a TODO el contenido)

| Ancla | Valor | Motivo |
|---|---|---|
| **Formato** | 9:16 vertical | Stories/reels/feed móvil |
| **Registro visual** | "Teatro de sombras de los cuadernos de Charles": siluetas recortadas estilo Lotte Reiniger sobre papel envejecido tintado (ref. *El príncipe Achmed*) | Estilización dura = dirección de arte deliberada (evita el semi-realismo IA); justifica la estética (canon: diarios caóticos) y alinea con "CFJ nunca de frente" y la Mano Negra |
| **Paleta base** | Siluetas negras + **fondos tintados narrativos por beat** (ámbar/verde → rojo → gris; rojos de rocas coloradas en el cierre) | El tinte carga la emoción de cada plano y une Pangea con la locación real del Ep.1 |
| **Época** | Mesozoico/paleógeno estilizado, no fotorrealista estricto | Tolera inconsistencias, refuerza tono |
| **Anacronismos** | Permitidos y buscados (mandarina, reloj, cadenita) | Canon |
| **Rostro de CFJ** | NUNCA de frente | Regla dura del canon |

### STYLE-BLOCK (bloque de estilo canónico, en inglés)

Única definición del bloque que los prompts finales de producción embeben **literal** (duplicación aceptada para que cada prompt sea copiable tal cual; si este bloque cambia, propagarlo a los prompts finales de los arcos):

```
Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**Regla de tinte (color por plano):** la paleta NO vive en el STYLE-BLOCK. Cada prompt agrega su propia línea de tinte según el guion de color del arco (ej. `warm amber and green tinted background`). Referencia: los fondos tintados de *El príncipe Achmed* — el color del fondo carga la narrativa; las siluetas siempre son negras.

### Paleta de cámara (qué preset se permite según el registro)

Los 12 `cameraPreset` operativos de wind-comic ([pipeline-wind-comic.md](pipeline-wind-comic.md) §6) NO se usan todos por igual: el teatro de sombras es **plano por diseño** (títeres de papel 2D), así que el movimiento de cámara agresivo pelea contra la estética. Regla de asignación:

| Registro | Presets permitidos | Motivo |
|---|---|---|
| **Silueta Reiniger** (la mayoría del arco) | `locked-tripod`, `tracking`, `push-in`, `pull-out` | Movimientos planos/laterales compatibles con un mundo 2D de recortes; el `push-in` por defecto del motor también entra |
| **Quiebres de realidad** (fotorrealista: caos Revenant, respiro poético, clínico) e **intro POV** (`a3-a1`, que ya no es silueta pura) | `handheld`, `crash-zoom`, `crane-up`, `arc`, `dolly-zoom`, `whip-pan`, `orbit`, `tilt-down` | Acá el 3D/la inestabilidad SUMAN: el `handheld` es parte del REALITY-BLOCK-CHAOS, el `crane-up`/`arc` traducen el aéreo poético, el `dolly-zoom` sirve a la fosilización si se decide romper |

Los 8 presets "expresivos" estaban dormidos; su lugar natural es el quiebre fotorrealista, no la silueta. Subir el brillo de cámara = activarlos **ahí**, no meterlos en planos de silueta (donde rompen el registro).

### Quiebres de realidad (la realidad como recurso)

Recurso **transversal y escaso**: en momentos de ruptura o verdad, el registro cuaderno/silueta se rompe A PROPÓSITO y la pieza salta a registro fotorrealista. No está ligado a ningún personaje. Dosificación: si se usa seguido pierde impacto — máximo un quiebre (o un par caos→respiro) por reel.

Tres variantes del mismo recurso, cada una con su momento:

| Variante | Registro | Momento de uso | Ejemplo |
|---|---|---|---|
| **Clínico** | documental forense, quieto, revelador | la verdad/evidencia (cierres) | `a3-m13` fósil en el yacimiento actual |
| **Caótico (Revenant)** | cámara inestable, violencia física, visceral | rupturas del mundo | la grieta partiendo Pangea (`a3-m14`) |
| **Poético** | aéreo amplio, contemplativo, elegíaco | el respiro después del caos | zoom-out de los continentes separados (`a3-m15`) |

Estructura dramática canónica del par caos→respiro: **silueta → caos Revenant → zoom-out poético → vuelta a silueta**. El caos necesita el respiro posterior para significar algo; el respiro es la traducción "real" de la poética de las imágenes madre de paisaje (ref. `a3-m05`).

#### REALITY-BLOCK-CHAOS (bloque canónico, en inglés)

Se embebe **literal** en los prompts de quiebre caótico (misma regla de propagación que el STYLE-BLOCK):

```
handheld unstable camera, violent motion, heavy motion blur, dust and debris in the air, natural overcast light, cold muted earth tones, photorealistic, gritty documentary realism inspired by The Revenant, no illustration, no silhouette, no paper texture, vertical 9:16
```

#### REALITY-BLOCK-POETIC (bloque canónico, en inglés)

Se embebe **literal** en los prompts de quiebre poético:

```
wide aerial establishing shot, golden dusk light, immense scale, stillness, photorealistic documentary realism, natural atmospheric haze, no illustration, no silhouette, no paper texture, vertical 9:16
```

### Recurso híbrido cuaderno-naturalista (catalogado, NO canon)

Del primer e2e real quedó un híbrido "cuaderno naturalista semi-realista" (ni silueta Reiniger ni quiebre fotorrealista): imágenes `assets/arco-3/madre/a3-m01-madre-ornitorrinco-hibrid-N.png` y clips `assets/arco-3/clips/a3-a3-madre-ritual-hibrid-N.mp4`. Se conserva como **recurso de transición/quiebre suave**, con la misma lógica de dosificación que los quiebres de realidad:

- Máximo **1–2 apariciones en todo el arco**; nunca como lock de consistencia ni firstFrame de clips canónicos.
- Los archivos llevan sufijo `-hibrid-N`: jamás ocupan el path canónico de una imagen madre o clip (`a3-m01-madre-ornitorrinco.png` queda reservado a la silueta Reiniger).
- Contador de uso en el [roadmap del Arco 3](arco-3-roadmap.md).

#### Guardas anti-error de IA (obligatorias en todo quiebre)

El caos se diseña **alrededor** de las debilidades de los modelos, no a pesar de ellas:

| Guarda | Motivo |
|---|---|
| Sin manos en interacción ni dedos en primer plano en movimiento | Las manos son el punto más frágil de la generación de imagen/video |
| Charles solo de espaldas, lejos o parcial | Ya es canon ("nunca de frente"); además evita rostro y manos nítidas |
| Animales solo de lejos, integrados al paisaje | Evita detalle anatómico exigido (pico, patas) donde los modelos fallan |
| El propio caos como escudo: motion blur, grano, contraluz | Disimula artefactos que un plano fijo delataría |

---

## 2. Imágenes madre por arco

> Prompts base para pegar/adaptar en wind-comic. Generar cada una, elegir la mejor, y reutilizarla como referencia o primer frame.

### Transversales
- **Paisaje Pangea**: "paisaje de Pangea en capas de siluetas recortadas visto desde una colina, vegetación exuberante silueteada, fondo tintado ámbar/verde, teatro de sombras, 9:16".
- **Rocas Coloradas**: "formaciones de roca tipo marciano en capas de silueta recortada, lagunas silueteadas, Patagonia, fondo tintado rojo profundo, teatro de sombras, 9:16".
- **Apertura cuaderno (intro transversal)**: subjetiva POV, manos abriendo cuaderno de tapa dura áspera (piel/pelos), título "Charles Francis Jones" en la tapa, sepia, 9:16. Imagen madre `a3-m12`, clip `a3-a1`. Abre TODOS los reels.

### Arco 1 — Mano Negra
- **Mano con cadenita**: "primer plano de una mano masculina con una cadenita de oro en la muñeca, sobre un mapa antiguo, iluminación dramática, sombra, 9:16" (varias poses: trazando, firmando, apoyada).
- **Mapa de Pangea con la grieta**: "mapa antiguo de Pangea con una línea de fractura trazada a lapicera, anotaciones, 9:16".
- **Logo de la Fundación**: "emblema de una fundación conservacionista ficticia, aspecto institucional y siniestro, 9:16".

### Arco 2 — Charles y la palanca
- **Charles de espaldas con sombrero**: silueta del explorador de espaldas en un paisaje de Pangea, luz de atardecer, nunca se ve el rostro (varias poses: de pie, meditando, empujando). Aspecto y vestuario canónicos en la ficha CFJ de [personajes-studio.md](personajes-studio.md) (no se duplican acá).
- **El tronco con el huevo**: "un tronco flotando con un huevo de ornitorrinco encima, entre dos masas de tierra que se separan, agua en el medio, 9:16".
- **El lugar blanco**: "espacio completamente blanco, un banquito blanco, alguien de espaldas tirando maíz a palomas que no están, onírico, 9:16" (cruce con el Ep.1).

### Arco 3 — Ornitorrincos

> Prompts finales de producción (en inglés, plano a plano) en [arco-3-planos.md](arco-3-planos.md). Acá quedan solo los conceptos base.

- **Familia de ornitorrincos**: generar una imagen madre POR animal (madre, cría, padre) + el huevo, para lockear cada uno como primer frame de sus clips. "silueta negra recortada de ornitorrinco de perfil expresivo, teatro de sombras, fondo de papel tintado, 9:16". La distinción entre animales es por contorno (tamaño, postura, muescas del recorte), no por pelaje.
- **Pantalla partida Australia/Argentina**: dos ambientes contrastados por **tinte de fondo** (verde saturado próspero / gris frío desaturado) — se arma en montaje, pero conviene una imagen madre por ambiente.
- **Fosilización**: "silueta de ornitorrinco recostada sobre roca colorada que se congela y se rellena de textura de piedra, transición, 9:16".
- **Salto a la realidad (remate)**: no existe plano de archivo del fósil del Ep.1. El fósil en el yacimiento actual se genera en registro fotográfico (`a3-m13` en [arco-3-planos.md](arco-3-planos.md)) y el corte final es la foto real de la locación (`assets/fuentes/rocas-coloradas-real.jpg`).

---

## 3. Regla de reutilización (DRY visual)

1. Una imagen madre por elemento persistente (personaje/objeto/locación).
2. Todo clip parte de su imagen madre como **primer frame** (I2V) o **referencia de sujeto**.
3. Los cruces entre personajes NO se generan juntos: se resuelven en montaje (ver [pipeline](pipeline-wind-comic.md)).
