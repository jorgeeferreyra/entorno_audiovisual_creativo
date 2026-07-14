---
reel: la-grieta
titulo: "La grieta"
arcos: [1, 2, 3]
origen: episodios/episodio-1 (precuela)
estado: pendiente
# Cut-list — v4.1: testigo abre → crimen → culpa → víctimas → destinos+huella
# → coda (lugar blanco → cara → Coloradas Reiniger). Sin foto real / CTA.
cutlist:
  # Beat 1 — Yo estuve ahí (HOOK)
  - { clip: a2-a0c, dur: 2.3 } # grieta Revenant (m07): "Yo estuve ahí…"
  - { clip: a2-a0d, dur: 1 }   # transición Reiniger (m08)
  # Beat 2 — El crimen
  - { clip: a1-a1,  dur: 3.5 } # mano con cadenita: "Donde había un mundo, hicieron dos."
  - { clip: a3-a5,  dur: 2 }   # Pangea → partida (FLF m05→m06)
  # Beat 3 — La culpa
  - { clip: a2-a0,  dur: 3.0 } # Charles de espaldas: "Estaba todo muy inestable."
  - { clip: a2-a1,  dur: 2.4 } # la pisada: "Por mi descuido…"
  - { clip: a2-a1c, dur: 1 }   # el nido vacío (still a2-m02b)
  - { clip: a2-a1b, dur: 3.0 } # el huevo cruza: "Una vida cruzó el planeta."
  - { clip: a2-a0b, dur: 3.0 } # levanta la cría: "Otra vida quedó de este lado."
  # Beat 4 — La separación
  - { clip: a3-a6c, dur: 3.2 } # "Familias separadas por la grieta." (still m22)
  - { clip: a3-a6d, dur: 1 }   # transición: padre+huevo (still m23)
  - { clip: a3-a6e, dur: 1.5 } # transición: los cuatro lejos (still m24)
  # Beat 5 — Dos destinos + huella
  - { clip: a3-b0,  dur: 3.2 } # "De aquel lado tuvieron prosperidad." (still m08)
  - { clip: a3-b1,  dur: 1.5 } # transición: el padre (m03)
  - { clip: a3-b3,  dur: 3.7 } # "De este lado, envejecieron solos." (m01v2)
  - { clip: a3-c1b, dur: 1.5 } # transición: el joven sobre la roca (still m18)
  - { clip: a3-c2,  dur: 3.0 } # "El tiempo los volvió piedra." (FLF m10→m11)
  - { clip: a3-c3,  dur: 1.5 } # transición: fósil real (m13, silencio)
  # Beat 6 — El sueño (coda / remate)
  - { clip: a2-a2,  dur: 3.0 } # lugar blanco: "…es en Rocas Coloradas…"
  - { clip: a2-a2b, dur: 1 }   # cara de Charles
  - { clip: a3-c1,  dur: 1.5 } # remate: Coloradas Reiniger (sin cara)
---

# Reel — La grieta (transversal)

Salida transversal: intercala clips de los tres hilos (Mano Negra, Charles/palanca, Ornitorrincos) para contar las tres historias en una sola pieza vertical (IG/TikTok). No es la salida de un arco; los arcos son la **fuente**.

- **Arcos que cruza**: `arcos: [1, 2, 3]`. Cutlist **v4.1** ([cadena-narrativa.md](cadena-narrativa.md)): hook = testigo en la grieta. Coda: lugar blanco (`a2-a2`) → cara (`a2-a2b`) → Coloradas Reiniger (`a3-c1`).
- **Cierre**: el reel termina en el cuento — Rocas Coloradas en Lotte Reiniger. Salen del cierre: eco `a3-c5` y foto real `a3-c4` (CTA); siguen como recurso del hilo.
- **Mapa narrativo que gobierna**: [cadena-narrativa.md](cadena-narrativa.md).
- **Assets desplazados**: `a3-c4`, `a3-c5`, `a3-b4`, `a3-a5b`, `a3-a6`, `a3-a5y` (+ los de v3). No se borra nada.
- **Fuente ejecutable**: [../../planos/arco-3.md](../../planos/arco-3.md) (y [arco-1.md](../../planos/arco-1.md) / [arco-2.md](../../planos/arco-2.md)).
- **Off**: [arco-3-off.md](../../planos/arco-3-off.md), [arco-1-off.md](../../planos/arco-1-off.md), [arco-2-off.md](../../planos/arco-2-off.md).

**Gate — animatic:** `npm run animatic -- --reel la-grieta [--borrador] [--uniformes] [--off]` → `animatic-la-grieta.mp4` (9:16). Con `--uniformes` usa `_madres-uniformes/` (grade + crop).

**Gate — uniformidad:** [mapa-uniformidad.md](mapa-uniformidad.md) + `npm run uniformar -- --reel la-grieta`.

El montaje final (`montar_secuencia`) cae en esta carpeta.
