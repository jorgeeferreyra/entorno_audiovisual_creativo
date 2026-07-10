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
  - { clip: a3-a1,  dur: 2 }   # cuaderno (hook)
  - { clip: a3-a2,  dur: 2 }   # Pangea
  - { clip: a3-a3,  dur: 2 }   # madre ritual
  - { clip: a3-a4,  dur: 2 }   # huevo (regen)
  - { clip: a3-a5,  dur: 2 }   # la grieta (FLF)
  - { clip: a3-a5b, dur: 2 }   # caos Revenant
  - { clip: a1-a1,  dur: 3 }   # A1 REVEAL: la mano firma (gap)
  - { clip: a3-a5c, dur: 2 }   # respiro poético
  - { clip: a3-a6a, dur: 1.5 } # beat 8.1a grieta abriéndose (still m19)
  - { clip: a3-a6b, dur: 1.5 } # beat 8.1b grieta ya abierta (still m21)
  - { clip: a3-a6c, dur: 1.5 } # beat 8.2a madre+cría orilla (still m22)
  - { clip: a3-a6d, dur: 1.5 } # beat 8.2b padre+huevo orilla (still m23)
  - { clip: a3-a6e, dur: 2 }   # beat 8.2c lejano los 4 + grieta (still m24)
  - { clip: a3-a6,  dur: 2 }   # beat 8.3 la despedida
  - { clip: a3-b1,  dur: 2 }   # Australia próspera (pantalla partida)
  - { clip: a3-b3,  dur: 2 }   # Argentina declive (pantalla partida)
  - { clip: a2-a0,  dur: 1.5 } # beat 9.1 Charles de espaldas (still a2-m01)
  - { clip: a2-a0b, dur: 1.5 } # beat 9.3 levanta la cría (still a2-m03)
  - { clip: a2-a1,  dur: 3 }   # beat 9.4 A2 CONTRAPUNTO: la palanca (gap)
  - { clip: a3-b4,  dur: 2 }   # Argentina seca (FLF) — cierra beat 9.6 (consecuencia)
  - { clip: a3-c1,  dur: 2 }   # el último / rocas (regen)
  - { clip: a3-c2,  dur: 2.5 } # fosilización (FLF)
  - { clip: a2-a2,  dur: 1.5 } # beat 13.2 lugar blanco: "es en Rocas Coloradas" (still a2-m04)
  - { clip: a2-a2b, dur: 1.5 } # beat 13.3 despertar (still a2-m05)
  - { clip: a3-c3,  dur: 2 }   # el fósil hoy (gen)
  - { clip: a3-c4,  dur: 2.5 } # foto real + Fundación
---

# Reel — La grieta (transversal)

Salida transversal: intercala clips de los tres hilos (Mano Negra, Charles/palanca, Ornitorrincos) para contar las tres historias en una sola pieza vertical (IG/TikTok). No es la salida de un arco; los arcos son la **fuente**.

- **Arcos que cruza**: `arcos: [1, 2, 3]`. La `cutlist` del front-matter es el mapa de intercut (~52s) de la [auditoría §A](../../auditoria-modelo-transversal.md): espina emocional del Arco 3, reveal del Arco 1 (`a1-a1`, la mano firma) tras la grieta, contrapunto del Arco 2 (`a2-a1`, la palanca) en vidas paralelas. Los zooms de los beats 8 (separación: `a3-a6a`…`a3-a6e` — progresión grieta + orillas + lejano), 9 (Charles/palanca: `a2-a0`/`a2-a0b`) y 13 (coda del lugar blanco: `a2-a2`/`a2-a2b`, entre `a3-c2` y `a3-c3`) entran como stills de montaje (~1.5–2s); el animatic decide si alguno asciende a clip U2V o se recorta. Los `a1-*`/`a2-*` se omiten en el animatic hasta que esos hilos bajen a [../../planos/](../../planos/).
- **Mapa narrativo que gobierna**: [cadena-narrativa.md](cadena-narrativa.md) es la cadena de beats aprobada (gate previo a imágenes, Stage 2). La `cutlist` la **implementa**: cada slot responde a un beat de esa cadena, no al revés. Si la cadena cambia, la cutlist se re-deriva.
- **Cut-list vs. lista plana**: cada entrada es un slot (`clip` + `dur` recortada en segundos). Reemplaza a la vieja lista `clips:` (que era solo Arco 3). La lee la herramienta del animatic (`--reel`).
- **Origen**: metadata, no jerarquía. Es precuela canónica del episodio 1 (el fósil de Rocas Coloradas). Si la relación cambia (standalone, o semilla de un episodio futuro), se edita la línea `origen` del front-matter — no se mueve nada.
- **Fuente ejecutable**: [../../planos/arco-3.md](../../planos/arco-3.md) (y [arco-1.md](../../planos/arco-1.md) / [arco-2.md](../../planos/arco-2.md), parciales).
- **Clips fuente**: `../../assets/arco-N/clips/` (por arco).
- **Off documental**: [arco-3-off.md](../../planos/arco-3-off.md), [arco-1-off.md](../../planos/arco-1-off.md), [arco-2-off.md](../../planos/arco-2-off.md).

**Gate — animatic transversal:** antes de generar video/audio, `npm run animatic -- --reel la-grieta` cae acá como `animatic-la-grieta.mp4` (cada slot de la cut-list = su madre fija por su `dur`, con el off ES quemado; los FLF muestran first→last). Es el gate de aprobación de ritmo/orden/subtítulos previo a la generación cara (el video es el mayor costo). El animatic por hilo (`--arco 3` → `animatic-arco-3.mp4`) sirve para aprobar la fuente y las destacadas de un arco. Detalle en [../../TECH.md](../../TECH.md) §Stage 6.

El montaje final (`montar_secuencia`) cae en esta carpeta.
