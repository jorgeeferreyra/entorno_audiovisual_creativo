---
reel: la-grieta
titulo: "La grieta"
arcos: [1, 2, 3]
origen: episodios/episodio-1 (precuela)
estado: pendiente
# Cut-list del intercut transversal — v3.1 2026-07-12: crimen firmado → testigo
# → culpa → víctimas → dos destinos → huella → verdad real (ver
# cadena-narrativa.md). Cada entrada es un slot: clip fuente + duración
# recortada (s). Objetivo short-form: 26 slots, ~39s de presupuesto antes
# del ajuste texto→audio→duración del animatic.
cutlist:
  # Beat 1 — El crimen (HOOK)
  - { clip: a1-a1,  dur: 1.5 } # mano con cadenita: el crimen firmado
  - { clip: a3-a5,  dur: 2 }   # Pangea se rasga (FLF m05→m06; sin establishing aparte)
  # Beat 2 — Yo estuve ahí
  - { clip: a2-a0,  dur: 1 }   # Charles de espaldas: testigo
  - { clip: a3-a5b, dur: 1.5 } # caos Revenant (m14)
  - { clip: a2-a0c, dur: 1 }   # Charles ve el golpe (a2-m07, re-pick pendiente)
  - { clip: a2-a0d, dur: 1 }   # vuelta al cuento (a2-m08) + "había dos"
  # Beat 3 — Un gran amigo (la culpa)
  - { clip: a2-a1,  dur: 1 }   # la pisada (still a2-m02a)
  - { clip: a2-a1c, dur: 1 }   # el nido vacío (still a2-m02b)
  - { clip: a2-a1b, dur: 1.5 } # el huevo cruza (FLF a2-m02d→a2-m02c)
  - { clip: a2-a0b, dur: 1.5 } # levanta a la cría — así lo conocí
  # Beat 4 — La separación (las víctimas)
  - { clip: a3-a6c, dur: 1 }   # de este lado: madre+cría (still m22)
  - { clip: a3-a6d, dur: 1 }   # del otro: padre+huevo (still m23)
  - { clip: a3-a6e, dur: 1.5 } # los cuatro, ya lejos (still m24)
  - { clip: a3-a6,  dur: 1.5 } # la despedida (m01v1)
  # Beat 5 — Dos destinos
  - { clip: a3-a5y, dur: 2 }   # switch real→cuento próspero (FLF m15v1→m08)
  - { clip: a3-b1,  dur: 1.5 } # el padre próspero (m03)
  - { clip: a3-b3,  dur: 1.5 } # la madre débil, en declive (m01v2)
  - { clip: a3-b4,  dur: 2 }   # la tierra se seca (FLF m09→m17)
  # Beat 6 — La huella
  - { clip: a3-c1b, dur: 1.5 } # primero se fue mi amigo (still m18)
  - { clip: a3-c2,  dur: 2 }   # ella, la última: fosilización (FLF m10→m11)
  - { clip: a3-c3,  dur: 1.5 } # switch a Revenant: el fósil, tal como quedó
  # Beat 7 — El sueño (coda / remate)
  - { clip: a2-a2,  dur: 1.5 } # lugar blanco: susurro "…es en Rocas Coloradas…"
  - { clip: a3-c1,  dur: 1.5 } # las coloradas del cuento
  - { clip: a2-a2b, dur: 1 }   # se abren los ojos
  - { clip: a3-c5,  dur: 1 }   # eco de caos Revenant
  - { clip: a3-c4,  dur: 4 }   # foto real + verdad de la locación
---

# Reel — La grieta (transversal)

Salida transversal: intercala clips de los tres hilos (Mano Negra, Charles/palanca, Ornitorrincos) para contar las tres historias en una sola pieza vertical (IG/TikTok). No es la salida de un arco; los arcos son la **fuente**.

- **Arcos que cruza**: `arcos: [1, 2, 3]`. La `cutlist` del front-matter implementa la **v3.1 2026-07-12** ([cadena-narrativa.md](cadena-narrativa.md)): Charles narra en primera persona; hook = **crimen firmado** (`a1-a1` → `a3-a5`). Orden: crimen → testigo (`a2-a0`, caos, switch `a2-a0c`/`a2-a0d` — una sola excursión a Revenant; `a3-a5c` sale) → culpa (`a2-a1` → `a2-a1c` → `a2-a1b` → `a2-a0b`) → víctimas (`a3-a6c`/`a3-a6d`/`a3-a6e`/`a3-a6`) → dos destinos (`a3-a5y`, `a3-b1`, `a3-b3`, `a3-b4`) → huella (`a3-c1b`, `a3-c2`, `a3-c3`) → sueño comprimido y verdad (`a2-a2`, `a3-c1`, `a2-a2b`, `a3-c5`, `a3-c4`).
- **Cierre con la verdad**: el slot final `a3-c4` cierra con la **foto real** de la locación y el sobreimpreso verdadero — hoy es el **Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia** (locación real). El humor negro de la Fundación sale del reel; sigue como recurso del hilo en [../../arco-3-ornitorrincos.md](../../arco-3-ornitorrincos.md).
- **Mapa narrativo que gobierna**: [cadena-narrativa.md](cadena-narrativa.md) es la cadena de beats aprobada (gate previo a imágenes, Stage 2). La `cutlist` la **implementa**: cada slot responde a un beat de esa cadena, no al revés. Si la cadena cambia, la cutlist se re-deriva.
- **Assets desplazados**: la v3 no borra ni mueve nada. `a3-m12`, `a3-m04`, `a3-m19`, `a3-m21`, `a3-m02`, `a2-m04-c3` y `a2-m09` quedan como referencias de estilo en [../../PROGRESS.md](../../PROGRESS.md). `a3-m01` queda como lock de cuento; `a3-m05` sigue como firstFrame de `a3-a5`.
- **Cut-list vs. lista plana**: cada entrada es un slot (`clip` + `dur` recortada en segundos). Reemplaza a la vieja lista `clips:` (que era solo Arco 3). La lee la herramienta del animatic (`--reel`).
- **Origen**: metadata, no jerarquía. Es precuela canónica del episodio 1 (el fósil de Rocas Coloradas). Si la relación cambia (standalone, o semilla de un episodio futuro), se edita la línea `origen` del front-matter — no se mueve nada.
- **Fuente ejecutable**: [../../planos/arco-3.md](../../planos/arco-3.md) (y [arco-1.md](../../planos/arco-1.md) / [arco-2.md](../../planos/arco-2.md), parciales).
- **Clips fuente**: `../../assets/arco-N/clips/` (por arco).
- **Off documental**: [arco-3-off.md](../../planos/arco-3-off.md), [arco-1-off.md](../../planos/arco-1-off.md), [arco-2-off.md](../../planos/arco-2-off.md).

**Gate — animatic transversal:** antes de generar video/audio, `npm run animatic -- --reel la-grieta` cae acá como `animatic-la-grieta.mp4` (cada slot de la cut-list = su madre fija por su `dur`, con el off ES quemado; los FLF muestran first→last). Es el gate de aprobación de ritmo/orden/subtítulos previo a la generación cara (el video es el mayor costo). El animatic por hilo (`--arco 3` → `animatic-arco-3.mp4`) sirve para aprobar la fuente y las destacadas de un arco. Detalle en [../../TECH.md](../../TECH.md) §Stage 7.

**Gate — uniformidad de universo:** [mapa-uniformidad.md](mapa-uniformidad.md) + `npm run uniformar -- --reel la-grieta` → `_madres-uniformes/` (capa 1 determinística: grade + crop 9:16; este gate absorbe el antiguo `_madres-916/`). Aprobar con `npm run animatic -- --reel la-grieta --uniformes` antes de `--promover`. Detalle en [../../TECH.md](../../TECH.md) §Stage 4.

El montaje final (`montar_secuencia`) cae en esta carpeta.
