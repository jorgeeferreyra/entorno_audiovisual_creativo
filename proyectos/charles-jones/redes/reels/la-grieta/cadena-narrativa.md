---
reel: la-grieta
doc: cadena-narrativa
estado: aprobado
fecha: 2026-07-10
---

# La grieta — Cadena narrativa

> Mapa narrativo del reel transversal, en lenguaje de historia (no de producción). **Gobierna** la `cutlist` del [README.md](README.md): la cutlist implementa esta cadena, no al revés. Es el **gate previo a generar imágenes** (Stage 2 en [../../TECH.md](../../TECH.md) §5): se aprueba el mapa de beats antes de gastar en madres o clips.

## Cómo leer / iterar

Regla general del gate (lenguaje de historia y zoom-in por cobertura) en [pipeline.md](../../../../../metodo/pipeline.md) §2 paso 1. Acá, en concreto: cada número es un **beat** que se lee solo; la sangría marca un **zoom-in** (el beat se parte en varias imágenes); si un beat no se lee → se expande, si sobra → se comprime; orden de arriba hacia abajo, sin ramas.

---

## La cadena (aprobada)

```text
1  El cuaderno
   Una historia que el tiempo intentó borrar.

2  Pangea
   Un solo continente. Un solo hogar.

3  La familia unida
   Madre · padre · cría · huevo. Ritual cotidiano.

4  El temblor
   Bajo sus patas, la tierra ya se parte.

5  El caos de la grieta
   El mundo se rompe. Sin palabras: solo el ruido.

6  ZOOM — La Mano Negra (reveal)
   6.1  Una mano con cadenita de oro traza la fractura en el mapa.
   6.2  Se entiende: no fue un accidente. Fue un crimen.

7  Dos mundos
   Cuando todo se detiene, donde hubo uno ahora hay dos.

8  ZOOM — La separación (quién quedó de cada lado)
   8.1  La grieta se abre
        8.1a  Las paredes casi se tocan.
        8.1b  El mar ya entra; la herida es irreversible.
   8.2  Quién quedó de cada lado (por corte)
        8.2a  Orilla cercana: la madre y su cría.
        8.2b  Orilla lejana: el padre y el huevo.
        8.2c  Plano lejano: los cuatro y la grieta.
   8.3  La despedida: el último instante antes de que el mar los separe.

9  ZOOM — Charles y la palanca
   9.1  Charles aparece de espaldas (sombrero, silueta; nunca de frente).
        No puede frenar la grieta.
   9.2  Encuentra a la familia partida. Actúa por ternura, no por plan.
   9.3  Sus manos levantan a la cría — gesto mínimo, casi accidental.
   9.4  El tronco bascula como balancín.
        El huevo rueda y cruza al lado que será Australia.
   9.5  Devuelve la cría junto a la madre (lado que será Argentina)
        y sigue su camino sin registrar lo que causó.
   9.6  Se entiende la consecuencia:
        ese gesto de dos segundos explica 62 millones de años.
        Por eso hoy hay ornitorrincos en Australia.

10 Vidas paralelas
   10.1  Del lado del huevo: la vida florece.
   10.2  Del lado de la madre: la orilla se seca; ella envejece sola.

11 La sequía
   Año tras año, la tierra se cierra sobre sí misma.

12 El último
   De aquella familia queda uno solo, entre las rocas coloradas.

13 ZOOM — Remate (puente al episodio 1)
   13.1  Se echa a descansar. El tiempo lo vuelve piedra.
   13.2  El lugar blanco: Charles, de espaldas, alimenta palomas que no están.
         Susurra dónde. El mensaje viaja 62 millones de años.
   13.3  El despertar: Charles abre los ojos en el mundo rojo. Ya lo dijo.
   13.4  Hoy, en esas mismas rocas, la piedra todavía recuerda su forma.
   13.5  Sobreimpreso: La Fundación protege este yacimiento.
         El criminal custodia la escena del crimen.
```

---

## Mapa beat → clip (cobertura vs. huecos)

Cruza cada beat con la [`cutlist`](README.md) actual. Expone qué está cubierto por clips ya bajados a planos y qué falta producir antes del animatic.

| Beat | Clip(s) en cutlist | Cobertura |
|---|---|---|
| 1 · El cuaderno | `a3-a1` | Cubierto |
| 2 · Pangea | `a3-a2` | Cubierto |
| 3 · La familia unida | `a3-a3`, `a3-a4` | Cubierto |
| 4 · El temblor | `a3-a5` (arranque) | Cubierto |
| 5 · El caos de la grieta | `a3-a5`, `a3-a5b` | Cubierto |
| 6 · ZOOM Mano Negra | `a1-a1` | Cubierto (plano parcial [arco-1.md](../../planos/arco-1.md)) |
| 7 · Dos mundos | `a3-a5c` | Cubierto |
| **8 · ZOOM separación** | `a3-a6a` (8.1a), `a3-a6b` (8.1b), `a3-a6c` (8.2a), `a3-a6d` (8.2b), `a3-a6e` (8.2c), `a3-a6` (8.3) | Cubierto: estrategia de 3 + progresión de la grieta en [arco-3.md](../../planos/arco-3.md) — `m19`→`m21` (grieta), `m22`/`m23` (orillas), `m24` (lejano). ~~`m20`~~ RETIRADA. |
| **9 · ZOOM Charles / palanca** | `a2-a0` (9.1), `a2-a0b` (9.3), `a2-a1` (9.4) | Cubierto: fichas en [arco-2.md](../../planos/arco-2.md) — `a2-m01` + `a2-m03` (cuento, pick c2); `a2-m06` Revenant es **reserva destacada**, no reel. La consecuencia (9.6) la resuelve el corte a `a3-b4` + off. |
| 10 · Vidas paralelas | `a3-b1`, `a3-b3` | Cubierto |
| 11 · La sequía | `a3-b4` | Cubierto |
| 12 · El último | `a3-c1` | Cubierto |
| **13 · ZOOM remate** | `a3-c2` (13.1), `a2-a2` (13.2), `a2-a2b` (13.3), `a3-c3` (13.4), `a3-c4` (13.5) | Cubierto: coda del lugar blanco bajada en [arco-2.md](../../planos/arco-2.md) — madres `a2-m04` (lugar blanco) y `a2-m05` (despertar) montadas como stills entre la fosilización y el fósil de hoy; el mensaje "es en Rocas Coloradas" cruza al Ep.1. |

**Beat 8 reestructurado (2026-07-10):** se retira el frame único `a3-m20` y se cuenta la separación por corte (`m22`/`m23`/`m24`) + progresión de la grieta (`m19`→`m21`). Pendiente: pick de `m22`/`m23`/`m24` y animatic borrador (Stage 6) para afinar durs.
