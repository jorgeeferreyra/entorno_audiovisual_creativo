---
reel: la-grieta
titulo: "La grieta"
arcos: [1, 2, 3]
origen: episodios/episodio-1 (precuela)
estado: pendiente
# Cut-list del intercut transversal (mapa de la auditoría §A). Cada entrada es
# un slot: clip fuente + duración recortada (s). Espina A3 + reveal A1 + palanca
# A2. Los a1-*/a2-* se omiten en el animatic hasta que sus arcos bajen a planos.
cutlist:
  - { clip: a3-a1,  dur: 3 }   # cuaderno (hook)
  - { clip: a3-a2,  dur: 2 }   # Pangea
  - { clip: a3-a3,  dur: 2 }   # madre ritual
  - { clip: a3-a4,  dur: 2 }   # huevo (regen)
  - { clip: a3-a5,  dur: 2 }   # la grieta (FLF)
  - { clip: a3-a5b, dur: 2 }   # caos Revenant
  - { clip: a1-a1,  dur: 3 }   # A1 REVEAL: la mano firma (gap)
  - { clip: a3-a5c, dur: 2 }   # respiro poético
  - { clip: a3-a6,  dur: 3 }   # separación
  - { clip: a3-b1,  dur: 2 }   # Australia próspera (pantalla partida)
  - { clip: a3-b3,  dur: 2 }   # Argentina declive (pantalla partida)
  - { clip: a2-a1,  dur: 4 }   # A2 CONTRAPUNTO: la palanca (gap)
  - { clip: a3-b4,  dur: 2 }   # Argentina seca (FLF)
  - { clip: a3-c1,  dur: 2 }   # el último / rocas (regen)
  - { clip: a3-c2,  dur: 3 }   # fosilización (FLF)
  - { clip: a3-c3,  dur: 2 }   # el fósil hoy (gen)
  - { clip: a3-c4,  dur: 3 }   # foto real + Fundación
  # - { clip: a2-a2, dur: 2 }  # A2 CODA opcional ("es en Rocas Coloradas") — diferida
---

# Reel — La grieta (transversal)

Salida transversal: intercala clips de los tres hilos (Mano Negra, Charles/palanca, Ornitorrincos) para contar las tres historias en una sola pieza vertical (IG/TikTok). No es la salida de un arco; los arcos son la **fuente**.

- **Arcos que cruza**: `arcos: [1, 2, 3]`. La `cutlist` del front-matter es el mapa de intercut (~43s) de la [auditoría §A](../../auditoria-modelo-transversal.md): espina emocional del Arco 3, reveal del Arco 1 (`a1-a1`, la mano firma) tras la grieta, contrapunto del Arco 2 (`a2-a1`, la palanca) en vidas paralelas. Los `a1-*`/`a2-*` se omiten en el animatic hasta que esos hilos bajen a [../../planos/](../../planos/).
- **Cut-list vs. lista plana**: cada entrada es un slot (`clip` + `dur` recortada en segundos). Reemplaza a la vieja lista `clips:` (que era solo Arco 3). La lee la herramienta del animatic (`--reel`).
- **Origen**: metadata, no jerarquía. Es precuela canónica del episodio 1 (el fósil de Rocas Coloradas). Si la relación cambia (standalone, o semilla de un episodio futuro), se edita la línea `origen` del front-matter — no se mueve nada.
- **Fuente ejecutable**: [../../planos/arco-3.md](../../planos/arco-3.md) (y [arco-1.md](../../planos/arco-1.md) / [arco-2.md](../../planos/arco-2.md), parciales).
- **Clips fuente**: `../../assets/arco-N/clips/` (por arco).
- **Off documental**: [arco-3-off.md](../../planos/arco-3-off.md), [arco-1-off.md](../../planos/arco-1-off.md), [arco-2-off.md](../../planos/arco-2-off.md).

**Gate — animatic transversal:** antes de generar video/audio, `npm run animatic -- --reel la-grieta` cae acá como `animatic-la-grieta.mp4` (cada slot de la cut-list = su madre fija por su `dur`, con el off ES quemado; los FLF muestran first→last). Es el gate de aprobación de ritmo/orden/subtítulos previo a la generación cara (~¥11.5 de ~¥16). El animatic por hilo (`--arco 3` → `animatic-arco-3.mp4`) sirve para aprobar la fuente y las destacadas de un arco. Detalle en [../../TECH.md](../../TECH.md) §Stage 2.5.

El montaje final (`montar_secuencia`) cae en esta carpeta.
