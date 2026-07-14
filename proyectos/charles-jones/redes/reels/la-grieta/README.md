---
reel: la-grieta
titulo: "La grieta"
arcos: [1, 2, 3]
origen: episodios/episodio-1 (precuela)
estado: pendiente
# Cut-list del intercut transversal — v4.1 2026-07-14: testigo abre → crimen
# → culpa → víctimas → destinos+huella → CTA poético (ver cadena-narrativa.md).
# Cada entrada es un slot: clip fuente + duración recortada (s).
cutlist:
  # Beat 1 — Yo estuve ahí (HOOK)
  - { clip: a2-a0c, dur: 1.5 } # grieta Revenant (m07): "Yo estuve ahí…"
  - { clip: a2-a0d, dur: 1 }   # transición Reiniger (m08)
  # Beat 2 — El crimen
  - { clip: a1-a1,  dur: 1.5 } # mano con cadenita: "hicieron dos"
  - { clip: a3-a5,  dur: 2 }   # Pangea → partida (FLF m05→m06)
  # Beat 3 — La culpa
  - { clip: a2-a0,  dur: 1 }   # Charles de espaldas: "Estaba todo muy inestable"
  - { clip: a2-a1,  dur: 1 }   # la pisada: "Por mi descuido…"
  - { clip: a2-a1c, dur: 1 }   # el nido vacío (still a2-m02b)
  - { clip: a2-a1b, dur: 1.5 } # el huevo cruza: "Una vida cruzó el planeta"
  - { clip: a2-a0b, dur: 1.5 } # levanta la cría: "Otra vida quedó de este lado"
  # Beat 4 — La separación
  - { clip: a3-a6c, dur: 1.5 } # "Familias separadas por la grieta" (still m22)
  - { clip: a3-a6d, dur: 1 }   # transición: padre+huevo (still m23)
  - { clip: a3-a6e, dur: 1.5 } # transición: los cuatro lejos (still m24)
  # Beat 5 — Dos destinos + huella
  - { clip: a3-b0,  dur: 1.5 } # "De aquel lado tuvieron prosperidad" (still m08)
  - { clip: a3-b1,  dur: 1.5 } # transición: el padre (m03)
  - { clip: a3-b3,  dur: 1.5 } # "De este lado, envejecieron solos" (m01)
  - { clip: a3-c1b, dur: 1.5 } # transición: el joven sobre la roca (still m18)
  - { clip: a3-c2,  dur: 2 }   # "El tiempo los volvió piedra" (FLF m10→m11)
  - { clip: a3-c3,  dur: 1.5 } # transición: fósil real (m13, silencio)
  # Beat 6 — El sueño (coda / remate)
  - { clip: a2-a2,  dur: 1.5 } # lugar blanco: susurro "…es en Rocas Coloradas…"
  - { clip: a3-c1,  dur: 1.5 } # transición: las coloradas del cuento
  - { clip: a2-a2b, dur: 1 }   # se abren los ojos
  - { clip: a3-c5,  dur: 1 }   # eco de caos: reprise a2-m07
  - { clip: a3-c4,  dur: 4 }   # foto real + "En Rocas Coloradas quedó la huella de lo que fue"
---

# Reel — La grieta (transversal)

Salida transversal: intercala clips de los tres hilos (Mano Negra, Charles/palanca, Ornitorrincos) para contar las tres historias en una sola pieza vertical (IG/TikTok). No es la salida de un arco; los arcos son la **fuente**.

- **Arcos que cruza**: `arcos: [1, 2, 3]`. La `cutlist` del front-matter implementa la **v4.1 2026-07-14** ([cadena-narrativa.md](cadena-narrativa.md)): Charles narra en primera persona; hook = **testigo en la grieta** (`a2-a0c` → `a2-a0d`). Orden: testigo → crimen (`a1-a1`, `a3-a5`) → culpa (`a2-a0` → `a2-a1` → `a2-a1c` → `a2-a1b` → `a2-a0b`) → víctimas (`a3-a6c`/`a3-a6d`/`a3-a6e`) → destinos+huella (`a3-b0`, `a3-b1`, `a3-b3`, `a3-c1b`, `a3-c2`, `a3-c3`) → sueño y remate poético (`a2-a2`, `a3-c1`, `a2-a2b`, `a3-c5`, `a3-c4`).
- **Cierre poético**: el slot final `a3-c4` cierra con la **foto real** y la línea **"En Rocas Coloradas quedó la huella de lo que fue"** + sobreimpreso — **Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia**. El humor negro de la Fundación y la amistad de Charles con el joven salen del reel; siguen como recurso del hilo en [../../arco-3-ornitorrincos.md](../../arco-3-ornitorrincos.md) / [../../arco-2-charles-palanca.md](../../arco-2-charles-palanca.md).
- **Mapa narrativo que gobierna**: [cadena-narrativa.md](cadena-narrativa.md) es la cadena de beats aprobada (gate previo a imágenes, Stage 2). La `cutlist` la **implementa**: cada slot responde a un beat de esa cadena, no al revés. Si la cadena cambia, la cutlist se re-deriva.
- **Assets desplazados**: la v4.1 no borra ni mueve nada. Sale del reel: `a3-b4` (sequía m09→m17). De v4 ya estaban fuera: `a3-a5b`, `a3-a6`, `a3-a5y`. De v3: `a3-m12`, `a3-m04`, `a3-m19`, `a3-m21`, `a3-m02`, `a2-m04-c3`, `a2-m09`, `a3-m15`. `a3-m01` cubre `a3-b3` hasta que exista `a3-m01v2`.
- **Fuente ejecutable**: [../../planos/arco-3.md](../../planos/arco-3.md) (y [arco-1.md](../../planos/arco-1.md) / [arco-2.md](../../planos/arco-2.md), parciales).
- **Clips fuente**: `../../assets/arco-N/clips/` (por arco).
- **Off documental**: [arco-3-off.md](../../planos/arco-3-off.md), [arco-1-off.md](../../planos/arco-1-off.md), [arco-2-off.md](../../planos/arco-2-off.md).

**Gate — animatic transversal:** antes de generar video/audio, `npm run animatic -- --reel la-grieta` cae acá como `animatic-la-grieta.mp4`. Detalle en [../../TECH.md](../../TECH.md) §Stage 7.

**Gate — uniformidad de universo:** [mapa-uniformidad.md](mapa-uniformidad.md) + `npm run uniformar -- --reel la-grieta` → `_madres-uniformes/`. Detalle en [../../TECH.md](../../TECH.md) §Stage 4.

El montaje final (`montar_secuencia`) cae en esta carpeta.
