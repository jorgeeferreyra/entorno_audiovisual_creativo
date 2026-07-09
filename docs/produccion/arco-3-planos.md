# Arco 3 — Plano a plano listo para producir

> Bajada de producción del [Arco 3: Ornitorrincos](../redes/arco-3-ornitorrincos.md) a imágenes madre + clips con prompts finales.
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../biblia-serie.md), conceptos visuales en [biblia-visual.md](biblia-visual.md), motores/costos en [pipeline-wind-comic.md](pipeline-wind-comic.md).
> Este archivo es la fuente de verdad de los **prompts finales de producción** del Arco 3.

Convenciones de este archivo:

- Los prompts finales van **en inglés** (mejor respuesta de los motores); el título/contexto de cada uno va en español.
- Anclas de estilo aplicadas a TODO prompt (de [biblia-visual.md](biblia-visual.md) §1): estética de cuaderno reconstruido (papel, tinta, ilustración con movimiento), paleta de tierras rojas/naranjas + verdes prehistóricos + sepia, mesozoico/paleógeno estilizado (no fotorrealista estricto), **9:16 vertical**.
- Registro del arco: **Attenborough sincero**, sin chistes verbales. El humor es estructural (solemnidad extrema aplicada a ornitorrincos).

---

## Sección 1 — Imágenes madre (generar PRIMERO)

Generar cada una en wind-comic (Flux/Minimax, ~¥0.3 c/u, 9:16), elegir la mejor y reutilizarla como **primer frame** (I2V) o **referencia de sujeto** en los clips. Los IDs (M1, M2, …) se usan en la Sección 2.

### Personajes (una imagen madre por animal — lock de consistencia)

**M1 — Madre ornitorrinco**
```
A realistic yet endearing platypus, mother figure, resting on the ground of a lush Pangea landscape, illustrated documentary style, warm reconstructed-notebook aesthetic, aged paper texture with faint ink lines, earthy red and prehistoric green palette, sepia edges, soft natural light, vertical 9:16
```

**M2 — Cría de ornitorrinco**
```
A small baby platypus, playful, same illustrated documentary style as its mother, lush Pangea background, reconstructed-notebook aesthetic, aged paper texture, ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

**M3 — Padre ornitorrinco**
```
A realistic yet endearing adult male platypus, subtly distinct from the mother (slightly darker fur, a small scar over one eye), illustrated documentary style, lush Pangea background, reconstructed-notebook aesthetic, aged paper texture, ink lines, earthy red and prehistoric green palette, sepia edges, vertical 9:16
```

**M4 — Huevo de ornitorrinco**
```
A single platypus egg resting in a small nest on a mossy log, close-up, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture, ink lines, earthy green and sepia palette, soft light, vertical 9:16
```

### Locaciones / ambientes

**M5 — Paisaje Pangea (establishing, transversal)**
```
The supercontinent Pangea seen from a hill, prehistoric sky, exuberant vegetation, explorer's notebook illustration style, aged paper texture, ink lines, prehistoric green and earthy palette, sepia edges, vertical 9:16
```

**M6 — Paisaje Pangea partido (la grieta abierta)** — se usa como último frame del clip FLF de la grieta.
```
The same Pangea landscape now torn apart by a deep widening rift, a chasm splitting the land in two, water rising in the gap, dramatic prehistoric sky, explorer's notebook illustration style, aged paper texture, ink lines, earthy palette, sepia edges, vertical 9:16
```

**M7 — Rocas Coloradas (puente con la locación real, transversal)**
```
Martian-like reddish rock formations, orange lagoons, Patagonian badlands, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture, deep red and orange palette, sepia edges, vertical 9:16
```

**M8 — Ambiente Australia próspera**
```
A thriving green wetland environment, abundant water and vegetation, warm prosperous light, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture, lush green palette, sepia edges, vertical 9:16
```

**M9 — Ambiente Argentina en declive**
```
An increasingly arid, drying environment, cracked earth, sparse dry vegetation, cold fading light, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture, muted earthy red and grey palette, sepia edges, vertical 9:16
```

### Par de fosilización (primer + último frame del clip FLF)

**M10 — Ornitorrinco recostado sobre roca colorada**
```
An old platypus lying down to rest on red rock, calm and peaceful, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture, deep red and orange palette, sepia edges, soft dusk light, vertical 9:16
```

**M11 — Fósil de piedra**
```
The same platypus now turned entirely to stone, a fossil embedded in red rock, fine mineral detail, illustrated documentary style, reconstructed-notebook aesthetic, aged paper texture, deep red and orange palette, sepia edges, vertical 9:16
```

### Recurso de marco (transversal)

**M12 — Página de cuaderno**
```
An old diary page with handwritten annotations, crossed-out notes, a hand-drawn map, sepia tones, aged paper texture, vertical 9:16
```

### Material de archivo (NO se genera)

- **ARCH-FOSIL** — plano real del fósil del Ep.1 (Rocas Coloradas). Es material de rodaje; se usa tal cual en el corte final del Reel C. Canon: el ornitorrinco del Arco 3 ES este fósil.
- **M-MANO (reutilizada del Arco 1)** — imagen madre "mano con cadenita" de [biblia-visual.md](biblia-visual.md) §Arco 1. NO se genera nueva; se inserta 1–2 frames en montaje del Reel A.

---

## Sección 2 — Desglose plano a plano (clips 5–6s)

Regla del [pipeline](pipeline-wind-comic.md): **un personaje por clip**, cruces por corte. Motor por defecto: **Minimax Hailuo I2V (~¥0.1/s)**. **Kling FLF (~¥0.2/s)** solo en las dos transiciones-gancho (grieta y fosilización). Audio por defecto: **voz en off documental (Attenborough) grabada propia**; música de fondo suave y sin percusión.

### Reel A — "La grieta" (~35s)

```
Clip A1 — Apertura: página de cuaderno
- Duración: 5s
- Imagen madre / primer frame: M12
- Motor: minimax (I2V)
- Prompt: Slow push-in over an old diary page, handwritten annotations and a hand-drawn map slowly coming into focus, subtle paper grain movement, sepia tones, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (intro) + música tenue
- Montaje: abre el reel; corta a A2 con un fade suave
```

```
Clip A2 — Establishing Pangea
- Duración: 5s
- Imagen madre / primer frame: M5
- Motor: minimax (I2V)
- Prompt: Gentle aerial drift over the lush Pangea supercontinent under a prehistoric sky, exuberant vegetation swaying, notebook illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental + música tenue
- Montaje: viene de A1; corta a A3
```

```
Clip A3 — La madre en su ritual cotidiano
- Duración: 5s
- Imagen madre / primer frame: M1
- Motor: minimax (I2V)
- Prompt: The mother platypus calmly grooming and moving by a Pangea stream, tender everyday ritual, soft natural light, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (presenta la familia)
- Montaje: intercut con A4 para dar "familia unida" sin generarlos juntos
```

```
Clip A4 — La cría jugando
- Duración: 5s
- Imagen madre / primer frame: M2
- Motor: minimax (I2V)
- Prompt: The baby platypus playing and splashing near the water, curious and joyful, documentary illustration style, warm Pangea background, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (continúa)
- Montaje: intercut con A3; cierra el bloque "unidad" y corta a A5
```

```
Clip A5 — La grieta (transición-gancho)
- Duración: 6s
- Imagen madre / primer frame: M5 (primer frame) → M6 (último frame)
- Motor: kling (FLF)
- Prompt: The Pangea landscape trembles and a deep rift tears the land apart, the ground splits in two as water floods the widening chasm, dramatic and sincere, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (el quiebre) + rumble grave
- Montaje: insertar 1–2 frames subliminales de M-MANO (mano con cadenita, Arco 1) en el pico del temblor; corta a A6
```

```
Clip A6 — La separación
- Duración: 6s
- Imagen madre / primer frame: M1
- Motor: minimax (I2V)
- Prompt: The mother platypus stands at the edge of the chasm looking across to the far side, wind and distance, grief held in stillness, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (la despedida)
- Montaje: corta contra el padre con el huevo (M3 + M4) al otro lado de la grieta; cierra el Reel A
```

### Reel B — "Vidas paralelas" (~30s, pantalla partida por montaje)

> La pantalla partida = dos clips independientes montados (mitad superior/inferior del 9:16). No se generan personajes juntos.

```
Clip B1 — Padre próspero en Australia
- Duración: 5s
- Imagen madre / primer frame: M3 (sujeto) sobre ambiente M8
- Motor: minimax (I2V)
- Prompt: The adult male platypus thriving in a lush green wetland, abundant water, healthy and active, warm prosperous light, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (adaptación)
- Montaje: mitad de pantalla partida con B3 (Australia arriba)
```

```
Clip B2 — La cría eclosionada, creciendo
- Duración: 5s
- Imagen madre / primer frame: M2 (variante crecida) sobre ambiente M8
- Motor: minimax (I2V)
- Prompt: The hatched young platypus growing stronger in the green Australian wetland, exploring confidently, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (la línea que prospera)
- Montaje: intercut dentro del lado próspero
```

```
Clip B3 — La madre en declive
- Duración: 5s
- Imagen madre / primer frame: M1 sobre ambiente M9
- Motor: minimax (I2V)
- Prompt: The mother platypus struggling in a drying, cracked landscape, slower and weaker, cold fading light, sincere and mournful, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (la pérdida)
- Montaje: mitad de pantalla partida con B1 (Argentina abajo)
```

```
Clip B4 — El ambiente argentino secándose
- Duración: 5s
- Imagen madre / primer frame: M9
- Motor: minimax (I2V)
- Prompt: A drying Patagonian environment, cracked earth spreading, sparse vegetation withering under cold light, time-lapse feel, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (el ecosistema cambia)
- Montaje: transición hacia el Reel C; corta a C1
```

### Reel C — "El último" (PIEZA ESTRELLA, ~30s)

```
Clip C1 — El último llega a las rocas coloradas
- Duración: 6s
- Imagen madre / primer frame: M10 (primer frame; establishing con M7 si se abre con locación)
- Motor: minimax (I2V)
- Prompt: The last old platypus slowly walks across Martian-like red rock formations and lies down to rest, dusk light, calm acceptance, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (el final del linaje argentino)
- Montaje: viene de B4; corta a C2
```

```
Clip C2 — La fosilización (transición-gancho)
- Duración: 6s
- Imagen madre / primer frame: M10 (primer frame) → M11 (último frame)
- Motor: kling (FLF)
- Prompt: The resting platypus slowly turns to stone, animation dissolving into a fossil embedded in red rock, fine mineral detail emerging, solemn and beautiful, documentary illustration style, vertical 9:16
- Aspect ratio: 9:16
- Audio: off documental (se apaga) + silencio final
- Montaje: corta DURO a C3
```

```
Clip C3 — Corte al fósil real del Ep.1
- Duración: 4–5s
- Imagen madre / primer frame: ARCH-FOSIL (material de archivo, NO se genera)
- Motor: ninguno (metraje real)
- Prompt: —
- Aspect ratio: 9:16 (reencuadrar el metraje real)
- Audio: off documental (remate: la tumba del protagonista de la trilogía)
- Montaje: corte duro desde C2; es el pago emocional del arco
```

```
Clip C4 — (Opcional) sobreimpreso de la Fundación
- Duración: 3s
- Imagen madre / primer frame: sobre el último frame de C3
- Motor: ninguno (texto en montaje)
- Prompt: —
- Aspect ratio: 9:16
- Audio: silencio o off breve
- Montaje: sobreimpreso "La Fundación protege hoy este yacimiento" — humor negro (el criminal custodiando la escena del crimen)
```

---

## Sección 3 — Stories S1–S5 (derivadas por montaje, sin generación)

Las stories del [calendario](../redes/calendario-publicacion.md) (Semana 1) se arman **recortando/reencuadrando** los clips ya generados a 15s. Cero generación extra.

| Story | Beat | Fuente (clips) | Nota de montaje |
|---|---|---|---|
| S1 | La familia feliz | A3 + A4 | Recorte a 15s; abrir con M12 si se quiere marco |
| S2 | La grieta | A5 | 15s; sticker/encuesta según calendario |
| S3 | La despedida | A6 | 15s; texto sobrio |
| S4 | El declive | B3 | 15s; puede sumar B4 de cierre |
| S5 | El fósil | C2 + C3 | 15s; remate con el fósil real |

---

## Costo estimado del arco

| Etapa | Cálculo | Total aprox. |
|---|---|---|
| Imágenes madre | 11 generadas × ¥0.3 | ~¥3.3 |
| Clips Minimax (I2V, 5s) | ~11 × ¥0.5 | ~¥5.5 |
| Clips Kling FLF (6s) | 2 × ~¥1 | ~¥2 |
| **Total** | | **~¥11** |

Dentro del presupuesto del [pipeline](pipeline-wind-comic.md) §3. Kling se reserva a las dos transiciones-gancho; el resto va por Minimax.

---

## Guardas de canon aplicadas

- Registro Attenborough **sincero**, sin chistes verbales (tesis del arco).
- La **mano negra** aparece solo como frame subliminal en A5, reutilizando su imagen madre del Arco 1 (no se genera nada nuevo).
- El **fósil final ES el del Ep.1**: material de archivo (ARCH-FOSIL), nunca generado.
- **CFJ no aparece** en este arco (su regla de "nunca de frente" no aplica acá, pero queda anotado).
- Anacronismos: no se fuerzan en este arco por su registro emocional; quedan disponibles como recurso si hiciera falta.
