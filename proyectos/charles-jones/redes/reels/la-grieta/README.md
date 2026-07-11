---
reel: la-grieta
titulo: "La grieta"
arcos: [1, 2, 3]
origen: episodios/episodio-1 (precuela)
estado: pendiente
# Cut-list del intercut transversal — v2 2026-07-10: Charles narra en primera
# persona (ver cadena-narrativa.md). Cada entrada es un slot: clip fuente +
# duración recortada (s). Reordenamiento: la mano abre el crimen, la palanca
# (Charles y su amigo) sube antes de la separación, y el remate invierte a
# sueño → despertar → caos → realidad. Cierre con la verdad de la locación
# (Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia). Todas las
# madres de los tres arcos entran (desafío "hacerlas caber").
cutlist:
  # Beat 1 — El cuaderno
  - { clip: a3-a1,  dur: 2.5 } # se abre el cuaderno (hook)
  # Beat 2 — Yo estuve en esos tiempos
  - { clip: a2-a0,  dur: 1.5 } # Charles de espaldas, Reiniger (still a2-m01)
  - { clip: a3-a2,  dur: 2.5 } # Pangea: un solo continente (m05)
  # Beat 3 — Cuando la partieron
  - { clip: a1-a1,  dur: 2 }   # la mano con cadenita firma (muda) — abre el crimen
  - { clip: a3-a5,  dur: 2.5 } # el suelo se rasga, vira a rojo (FLF m05v1→m06)
  - { clip: a3-a5b, dur: 2 }   # caos Revenant (m14)
  - { clip: a2-a0c, dur: 1.5 } # Charles lo ve: golpe de la grieta, Revenant (still a2-m07)
  - { clip: a2-a0d, dur: 1.5 } # vuelta al cuento, Reiniger (still a2-m08) — cierra el switch
  - { clip: a3-a5c, dur: 2.5 } # dos mundos: donde hubo uno, ahora hay dos
  # Beat 4 — Un gran amigo
  - { clip: a2-a1,  dur: 1.5 } # la pisada (still a2-m02a)
  - { clip: a2-a1c, dur: 1.5 } # el nido vacío (still a2-m02b)
  - { clip: a2-a1b, dur: 2 }   # el huevo cruza (FLF a2-m02d→a2-m02c)
  - { clip: a2-a0b, dur: 1.5 } # levanta a la cría — así lo conocí (still a2-m03)
  # Beat 5 — Su familia se vio separada
  - { clip: a3-a3,  dur: 2.5 } # la madre en su ritual (m01)
  - { clip: a3-a4,  dur: 2 }   # el huevo (m04)
  - { clip: a3-a6a, dur: 1.5 } # la grieta se abre (still m19)
  - { clip: a3-a6b, dur: 1.5 } # el mar entra (still m21)
  - { clip: a3-a6c, dur: 1.5 } # de este lado: madre+cría (still m22)
  - { clip: a3-a6d, dur: 1.5 } # del otro: padre+huevo (still m23)
  - { clip: a3-a6e, dur: 2 }   # los cuatro, ya lejos (still m24)
  - { clip: a3-a6,  dur: 2 }   # la despedida (m01v1)
  # Beat 6 — Los de aquel lado fueron prósperos
  - { clip: a3-a5y, dur: 2.5 } # switch real→cuento próspero (FLF m15v1→m08)
  - { clip: a3-b1,  dur: 2 }   # el padre próspero (m03)
  - { clip: a3-b2,  dur: 2 }   # el joven explorando (m02)
  # Beat 7 — Los de este lado dejaron su huella
  - { clip: a3-b3,  dur: 2 }   # la madre débil, en declive (m01v2)
  - { clip: a3-b4,  dur: 2.5 } # la tierra se seca (FLF m09→m17)
  - { clip: a3-c1b, dur: 1.5 } # primero se fue el joven (still m18)
  - { clip: a3-c2,  dur: 2 }   # ella, la última: fosilización (FLF m10→m11)
  - { clip: a3-c3,  dur: 2 }   # switch a Revenant: el fósil, tal como quedó (m13)
  # Beat 8 — El sueño (coda)
  - { clip: a2-a2,  dur: 1.5 } # lugar blanco: susurro "…es en Rocas Coloradas…" (still a2-m04)
  - { clip: a2-a2d, dur: 1.5 } # lugar blanco c3 (still a2-m04-c3)
  - { clip: a3-c1,  dur: 2 }   # las coloradas del cuento (push-in m07)
  - { clip: a2-a2b, dur: 1.5 } # se abren los ojos (still a2-m05)
  - { clip: a2-a2c, dur: 1.5 } # despierta la selva: mate (still a2-m09)
  - { clip: a3-c5,  dur: 1.5 } # eco de caos Revenant: todo vuelve a romperse (montaje m14)
  - { clip: a3-c4,  dur: 4 }   # corte a lo real: foto + la verdad de la locación
---

# Reel — La grieta (transversal)

Salida transversal: intercala clips de los tres hilos (Mano Negra, Charles/palanca, Ornitorrincos) para contar las tres historias en una sola pieza vertical (IG/TikTok). No es la salida de un arco; los arcos son la **fuente**.

- **Arcos que cruza**: `arcos: [1, 2, 3]`. La `cutlist` del front-matter es el mapa de intercut de la **v2 2026-07-10** ([cadena-narrativa.md](cadena-narrativa.md)): Charles narra en primera persona ("yo estuve en esos tiempos"). Orden de la v2: la mano del Arco 1 (`a1-a1`) **abre** el crimen dentro de "cuando la partieron"; Charles ve el golpe (switch `a2-a0c`/`a2-a0d`); la palanca del Arco 2 (Charles y su amigo: `a2-a1` → `a2-a1c` → `a2-a1b` FLF → `a2-a0b`) **sube antes** de la separación de la familia (Arco 3, `a3-a6a`…`a3-a6e` + `a3-a6`); prosperidad vs. huella (`a3-b*`, `a3-c1b`, `a3-c2`, `a3-c3`); y el remate invierte a **sueño → despertar → caos → realidad** (`a2-a2`/`a2-a2d`/`a3-c1`/`a2-a2b`/`a2-a2c` → `a3-c5` eco de caos → `a3-c4`). Los sub-beats entran como stills de montaje (~1.5–2s); el animatic decide si alguno asciende a clip U2V o se recorta.
- **Cierre con la verdad**: el slot final `a3-c4` cierra con la **foto real** de la locación y el sobreimpreso verdadero — hoy es el **Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia** (locación real). El humor negro de la Fundación sale del reel; sigue como recurso del hilo en [../../arco-3-ornitorrincos.md](../../arco-3-ornitorrincos.md).
- **Mapa narrativo que gobierna**: [cadena-narrativa.md](cadena-narrativa.md) es la cadena de beats aprobada (gate previo a imágenes, Stage 2). La `cutlist` la **implementa**: cada slot responde a un beat de esa cadena, no al revés. Si la cadena cambia, la cutlist se re-deriva.
- **Cut-list vs. lista plana**: cada entrada es un slot (`clip` + `dur` recortada en segundos). Reemplaza a la vieja lista `clips:` (que era solo Arco 3). La lee la herramienta del animatic (`--reel`).
- **Origen**: metadata, no jerarquía. Es precuela canónica del episodio 1 (el fósil de Rocas Coloradas). Si la relación cambia (standalone, o semilla de un episodio futuro), se edita la línea `origen` del front-matter — no se mueve nada.
- **Fuente ejecutable**: [../../planos/arco-3.md](../../planos/arco-3.md) (y [arco-1.md](../../planos/arco-1.md) / [arco-2.md](../../planos/arco-2.md), parciales).
- **Clips fuente**: `../../assets/arco-N/clips/` (por arco).
- **Off documental**: [arco-3-off.md](../../planos/arco-3-off.md), [arco-1-off.md](../../planos/arco-1-off.md), [arco-2-off.md](../../planos/arco-2-off.md).

**Gate — animatic transversal:** antes de generar video/audio, `npm run animatic -- --reel la-grieta` cae acá como `animatic-la-grieta.mp4` (cada slot de la cut-list = su madre fija por su `dur`, con el off ES quemado; los FLF muestran first→last). Es el gate de aprobación de ritmo/orden/subtítulos previo a la generación cara (el video es el mayor costo). El animatic por hilo (`--arco 3` → `animatic-arco-3.mp4`) sirve para aprobar la fuente y las destacadas de un arco. Detalle en [../../TECH.md](../../TECH.md) §Stage 6.

El montaje final (`montar_secuencia`) cae en esta carpeta.
