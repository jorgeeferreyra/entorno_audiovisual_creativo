---
reel: la-grieta
doc: cadena-narrativa
estado: aprobado
fecha: 2026-07-10
---

# La grieta — Cadena narrativa

> Mapa narrativo del reel transversal, en lenguaje de historia (no de producción). **Gobierna** la `cutlist` del [README.md](README.md): la cutlist implementa esta cadena, no al revés. Es el **gate previo a generar imágenes** (Stage 1.5 en [../../TECH.md](../../TECH.md) §5): se aprueba el mapa de beats antes de gastar en madres o clips.

## Cómo leer / iterar

Regla general del gate (lenguaje de historia y zoom-in por cobertura) en [pipeline.md](../../../../../metodo/pipeline.md) §2 paso 0. Acá, en concreto: cada número es un **beat** que se lee solo; la sangría marca un **zoom-in** (el beat se parte en varias imágenes); si un beat no se lee → se expande, si sobra → se comprime; orden de arriba hacia abajo, sin ramas.

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
   8.1  Plano ancho: la grieta abierta, dos orillas.
   8.2  Plano de lectura: unos ornitorrincos de un lado, otros del otro.
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
   13.2  Hoy, en esas mismas rocas, la piedra todavía recuerda su forma.
   13.3  Sobreimpreso: La Fundación protege este yacimiento.
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
| **8 · ZOOM separación** | `a3-a6` | **Hueco**: un solo slot cubre los 3 sub-beats (ancho / lectura / despedida). Falta bajar fichas para 8.1 y 8.2 ("unos de un lado, otros del otro"). |
| **9 · ZOOM Charles / palanca** | `a2-a1` (4s) | **Hueco**: el plano parcial de [arco-2.md](../../planos/arco-2.md) cubre solo el balancín (9.4). Faltan fichas para 9.1–9.3 (Charles de espaldas, levanta la cría) y 9.6 (consecuencia). |
| 10 · Vidas paralelas | `a3-b1`, `a3-b3` | Cubierto |
| 11 · La sequía | `a3-b4` | Cubierto |
| 12 · El último | `a3-c1` | Cubierto |
| 13 · ZOOM remate | `a3-c2`, `a3-c3`, `a3-c4` | Cubierto |

**Huecos a resolver antes del animatic:** beats **8** y **9**. Ambos son zooms aprobados que hoy la cutlist comprime en un solo slot; requieren decisión de dirección sobre cuántas imágenes bajar y expansión de fichas en `planos/`.
