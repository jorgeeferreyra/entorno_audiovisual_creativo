---
reel: la-grieta
doc: cadena-narrativa
estado: propuesto
fecha: 2026-07-10
---

# La grieta — Cadena narrativa

> Mapa narrativo del reel transversal, en lenguaje de historia (no de producción). **Gobierna** la `cutlist` del [README.md](README.md): la cutlist implementa esta cadena, no al revés. Es el **gate previo a generar imágenes** (Stage 2 en [../../TECH.md](../../TECH.md) §5): se aprueba el mapa de beats antes de gastar en madres o clips.
>
> **v2 2026-07-10 — Charles narra en primera persona.** Reordenamiento de dirección: el relato deja de ser tercera persona Attenborough y pasa a ser el **testimonio de Charles** ("yo estuve en esos tiempos"). Cambia el orden (la mano firma al principio; la palanca —Charles y su amigo— sube antes de la separación; el remate invierte a sueño → despertar → caos → realidad) y el cierre se dice **con la verdad**: hoy es el Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia (es una locación real). El humor negro de la Fundación sale del reel (sigue vivo como recurso del hilo en [../../arco-3-ornitorrincos.md](../../arco-3-ornitorrincos.md)). No se genera ninguna madre nueva: todas las madres de los tres arcos entran (el desafío era hacerlas caber). Absorciones previas (`a3-m18`, `a2-m04-c3`) siguen vigentes; ver [auditoria-refinamiento.md](auditoria-refinamiento.md).

## Cómo leer / iterar

Regla general del gate (lenguaje de historia y zoom-in por cobertura) en [pipeline.md](../../../../../metodo/pipeline.md) §2 paso 1. Acá, en concreto: cada número es un **beat** que se lee solo; la sangría marca un **zoom-in** (el beat se parte en varias imágenes); si un beat no se lee → se expande, si sobra → se comprime; orden de arriba hacia abajo, sin ramas.

---

## La cadena (v2 — Charles narra)

```text
1  El cuaderno
   Se abre. Hay una historia que solo yo puedo contar.

2  Yo estuve en esos tiempos
   2.1  Yo, de espaldas, al borde de un mundo entero.
   2.2  Ciento ochenta millones de años atrás: un solo continente.

3  Cuando la partieron
   3.1  Una mano con cadenita de oro firma el informe. (muda)
   3.2  El suelo se rasga. El cuento se tiñe de rojo.
   3.3  El caos: sin palabras, solo el ruido.
   3.4  Yo lo vi desde la loma. El golpe — y la vuelta al cuento.
   3.5  Cuando todo se detuvo, donde hubo un mundo había dos.

4  Un gran amigo
   4.1  Por un descuido mío, una bota apoya en un tronco.
   4.2  El nido quedó vacío.
   4.3  Y un huevo cruzó el océano.
   4.4  Me agaché a levantar a una cría perdida. Así lo conocí.

5  Su familia se vio separada
   5.1  La madre, cada mañana, el mismo gesto. Y el huevo.
   5.2  La grieta se abre: las paredes casi se tocan → el mar entra.
   5.3  De un lado la madre y su cría; del otro, el padre y el huevo.
        Y los cuatro, ya lejos.
   5.4  La despedida: el último instante antes del agua.

6  Los de aquel lado fueron prósperos
   6.1  Switch de estilo: del otro lado del océano, la vida floreció.
   6.2  El padre, fuerte, en aguas generosas.
   6.3  El joven creció sin conocer la sed.

7  Los de este lado dejaron su huella
   7.1  Acá la madre envejeció sola.
   7.2  Año tras año, la tierra verde se cerró sobre sí misma.
   7.3  Primero se fue el joven, entre las rocas coloradas.
   7.4  Después ella: la última. El tiempo la volvió piedra.
   7.5  Switch a Revenant: el fósil, tal como quedó.

8  El sueño (coda)
   8.1  El lugar blanco: doy de comer a palomas que no están.
        Susurro dónde. (…es en Rocas Coloradas…)
   8.2  Las coloradas del cuento.
   8.3  Se abren los ojos.
   8.4  Despierta la selva: mate a la salida de la carpa.
   8.5  Switch a Revenant caos: todo vuelve a romperse.
   8.6  Corte a lo real: hoy es el Área Natural Protegida
        Rocas Coloradas, Comodoro Rivadavia. Porque es verdad.
```

---

## Mapa beat → clip (cobertura vs. huecos)

Cruza cada beat con la [`cutlist`](README.md) actual. Expone qué está cubierto por clips ya bajados a planos y qué falta producir antes del animatic.

| Beat | Clip(s) en cutlist | Cobertura |
|---|---|---|
| 1 · El cuaderno | `a3-a1` | Cubierto |
| 2 · Yo estuve en esos tiempos | `a2-a0` (Charles espaldas m01), `a3-a2` (Pangea m05) | Cubierto |
| **3 · Cuando la partieron** | `a1-a1` (la mano firma), `a3-a5` (grieta rasga, FLF), `a3-a5b` (caos Revenant), `a2-a0c`→`a2-a0d` (Charles lo ve: switch real→cuento), `a3-a5c` (dos mundos) | Cubierto: la mano abre el crimen (parcial [arco-1.md](../../planos/arco-1.md)); `a2-m07` re-pick pendiente. |
| **4 · Un gran amigo** | `a2-a1` (pisada m02a), `a2-a1c` (nido m02b), `a2-a1b` (huevo cruza, FLF m02d→m02c), `a2-a0b` (alza la cría m03) | Cubierto: fichas en [arco-2.md](../../planos/arco-2.md); `a2-a1b` FLF diferido al gate de keyframes. |
| **5 · Su familia se vio separada** | `a3-a3` (ritual m01), `a3-a4` (huevo m04), `a3-a6a`…`a3-a6e` (grieta+orillas m19/m21/m22/m23/m24), `a3-a6` (despedida m01v1) | Cubierto: estrategia de 3 + progresión de la grieta en [arco-3.md](../../planos/arco-3.md). |
| 6 · Los de aquel lado fueron prósperos | `a3-a5y` (switch real→cuento, FLF m15v1→m08), `a3-b1` (padre m03), `a3-b2` (joven m02) | Cubierto |
| **7 · Su huella** | `a3-b3` (madre débil m01v2), `a3-b4` (sequía, FLF m09→m17), `a3-c1b` (el joven m18), `a3-c2` (fosilización, FLF m10→m11), `a3-c3` (fósil real m13, switch Revenant) | Cubierto: ambos ornitorrincos mueren y se vuelven fósil; cierra con el salto a lo real. |
| **8 · El sueño (coda)** | `a2-a2`/`a2-a2d` (lugar blanco m04/-c3, susurro "es en Rocas Coloradas"), `a3-c1` (coloradas del cuento m07), `a2-a2b` (ojos m05), `a2-a2c` (selva m09), `a3-c5` (eco caos Revenant m14), `a3-c4` (foto real + la verdad) | Cubierto: `a3-c5` es el **eco de caos** nuevo (montaje sobre m14); el cierre dice la verdad (Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia). |

**v2 2026-07-10:** todas las madres de los tres arcos entran (desafío "hacerlas caber"). Reordenamiento en primera persona; la mano abre, la palanca sube antes de la separación, el remate invierte a sueño→despertar→caos→realidad. El cierre pasa de la ironía de la Fundación a **la verdad de la locación**. Pendiente: animatic (Stage 6) para afinar durs y `a3-c5` (eco caos).
