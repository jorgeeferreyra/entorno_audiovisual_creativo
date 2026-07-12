---
reel: la-grieta
doc: cadena-narrativa
estado: aprobado
fecha: 2026-07-11
---

# La grieta — Cadena narrativa

> Mapa narrativo del reel transversal, en lenguaje de historia (no de producción). **Gobierna** la `cutlist` del [README.md](README.md): la cutlist implementa esta cadena, no al revés. Es el **gate previo a generar imágenes** (Stage 2 en [../../TECH.md](../../TECH.md) §5): se aprueba el mapa de beats antes de gastar en madres o clips.
>
> **v3 2026-07-11 — crimen, testigo, víctimas, verdad.** Reescritura de dirección para short-form vertical: sale el marco lento del cuaderno y la vida familiar previa; el reel abre con el crimen firmado, Charles declara como testigo, su descuido explica el huevo que cruza, la familia se lee recién en la separación, y el cierre mantiene la verdad de la locación real: hoy es el Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia. No se borra ni se mueve ningún asset: las madres desplazadas quedan como **referencia de estilo**.

## Cómo leer / iterar

Regla general del gate (lenguaje de historia y zoom-in por cobertura) en [pipeline.md](../../../../../metodo/pipeline.md) §2 paso 1. Acá, en concreto: cada número es un **beat** que se lee solo; la sangría marca un **zoom-in** (el beat se parte en varias imágenes); si un beat no se lee → se expande, si sobra → se comprime; orden de arriba hacia abajo, sin ramas.

---

## Esencia (criterio de corte)

- **Qué:** la partición del mundo no fue geología, fue un **crimen firmado** — y Charles fue testigo. Las víctimas tienen nombre: una familia de ornitorrincos separada para siempre. La evidencia existe de verdad: un fósil en Rocas Coloradas.
- **Cómo:** **testimonio de Charles en primera persona**, con culpa propia (su descuido cruzó el huevo). Cuento de siluetas interrumpido por golpes de realidad (Revenant). Arco: crimen → testigo → culpa → víctimas → dos destinos → huella → revelación.
- **Por qué:** el remate recontextualiza todo — **"esta parte es real"**: la locación existe (Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia), el fósil existe. La fábula se vuelve verificable; eso dispara compartir y rewatch.

Cada beat debe servir crimen / testimonio / víctimas / verdad. Lo que no lo sirve sale; lo que lo sirve débilmente se comprime.

---

## La cadena (v3 — Charles narra)

```text
1  El crimen (HOOK)
   1.1  Una mano con cadenita firma. "Cuando partieron el mundo,
        alguien ya había firmado." (texto en pantalla desde el frame 1)
   1.2  El suelo se rasga; el cuento vira a rojo.
        "La tierra era una sola. Hasta que empezó a partirse."

2  Yo estuve ahí (el testigo)
   2.1  Yo, de espaldas: "Yo estuve en esos tiempos."
   2.2  El caos: sin palabras, solo el ruido.
   2.3  Lo vi desde la loma. El golpe — y la vuelta al cuento.
        "Donde hubo un mundo, había dos."
        (una sola excursión a Revenant; el aéreo poético sale del reel)

3  Un gran amigo (la culpa)
   3.1  Por un descuido mío, una bota apoya en un tronco.
   3.2  El nido quedó vacío.
   3.3  Y un huevo cruzó el océano.
   3.4  Me agaché a levantar a una cría perdida. Así lo conocí.

4  La separación (las víctimas)
   4.1  De este lado quedaron mi amigo y su madre.
   4.2  Del otro, el padre y el huevo.
   4.3  Los cuatro, ya lejos. Irreversible.
   4.4  La despedida: el último instante antes del agua.

5  Dos destinos
   5.1  Switch de estilo: los de aquel lado fueron prósperos.
   5.2  El padre, fuerte, en aguas que nunca dejaron de ser generosas.
   5.3  Los de este lado envejecieron solos.
   5.4  Año tras año, la tierra verde se cerró sobre sí misma.

6  La huella
   6.1  Primero se fue mi amigo, entre las rocas coloradas.
   6.2  Después ella: la última. El tiempo la volvió piedra.
   6.3  Switch a Revenant: el fósil, tal como quedó.

7  El sueño (coda / remate)
   7.1  El lugar blanco. Susurro: "…es en Rocas Coloradas…"
   7.2  Las coloradas del cuento.
   7.3  Se abren los ojos.
   7.4  Eco de caos: todo vuelve a romperse.
   7.5  Corte a lo real: hoy es el Área Natural Protegida Rocas
        Coloradas, Comodoro Rivadavia. "Esta parte es real."
```

---

## Mapa beat → clip (cobertura vs. huecos)

Cruza cada beat con la [`cutlist`](README.md) actual. Expone qué está cubierto por clips ya bajados a planos y qué falta producir antes del animatic.

| Beat | Clip(s) en cutlist v3 | Cobertura |
|---|---|---|
| **1 · El crimen (HOOK)** | `a1-a1` (mano firma), `a3-a5` (Pangea se rasga, FLF m05→m06) | Cubierto. La mano pasa a hook absoluto; la información de Pangea vive en el firstFrame de `a3-a5`, sin establishing aparte. |
| **2 · Yo estuve ahí** | `a2-a0` (Charles espaldas m01), `a3-a5b` (caos Revenant), `a2-a0c`→`a2-a0d` (Charles lo ve: switch real→cuento; off "había dos" en `a2-a0d`) | Cubierto. **v3.1:** sale `a3-a5c` (segunda ida a Revenant) — una sola excursión cuento→real→cuento. `a2-m07` sigue con re-pick pendiente. |
| **3 · Un gran amigo** | `a2-a1` (pisada m02a), `a2-a1c` (nido m02b), `a2-a1b` (huevo cruza, FLF m02d→m02c), `a2-a0b` (alza la cría m03) | Cubierto. El huevo sigue estructural en la culpa de Charles; `a2-a1b` FLF queda diferido al gate de keyframes. |
| **4 · La separación** | `a3-a6c` (madre+cría), `a3-a6d` (padre+huevo), `a3-a6e` (los cuatro lejos), `a3-a6` (despedida m01v1) | Cubierto. Caen `a3-a6a`/`a3-a6b` porque repiten la grieta ya contada a escala planetaria. |
| **5 · Dos destinos** | `a3-a5y` (switch real→cuento próspero, FLF m15v1→m08), `a3-b1` (padre m03), `a3-b3` (madre débil m01v2), `a3-b4` (sequía, FLF m09→m17) | Cubierto. Cae `a3-b2` para evitar meseta de prosperidad. |
| **6 · La huella** | `a3-c1b` (mi amigo m18), `a3-c2` (fosilización, FLF m10→m11), `a3-c3` (fósil real m13, switch Revenant) | Cubierto. `a3-m18` queda absorbida como muerte del amigo de este lado. |
| **7 · El sueño / remate** | `a2-a2` (lugar blanco m04, susurro), `a3-c1` (Coloradas del cuento m07), `a2-a2b` (ojos m05), `a3-c5` (eco caos Revenant m14), `a3-c4` (foto real + la verdad) | Cubierto. Caen `a2-a2d` y `a2-a2c` para entrar más rápido al remate real. |

## Diff conceptual v2 → v3

| Slot que sale | Madre / archivo | Destino |
|---|---|---|
| `a3-a1` (cuaderno) | `a3-m12` | Referencia de estilo / marco transversal fuera de este reel |
| `a3-a2` (Pangea establishing) | `a3-m05` | Sigue como firstFrame de `a3-a5`; se cancela la variación `a3-m05v1` |
| `a3-a3` (ritual) | `a3-m01` | Lock de cuento + referencia de estilo; sin slot propio en reel v3 |
| `a3-a4` (huevo close-up) | `a3-m04` | Referencia de estilo; el huevo sigue en `a2-a1b` y `a3-a6d` |
| `a3-a6a` / `a3-a6b` | `a3-m19` / `a3-m21` | Referencias de estilo; no se borran |
| `a3-b2` (joven explorando) | `a3-m02` | Referencia de estilo / anatomy-ref |
| `a2-a2d` (lugar blanco c3) | `a2-m04-c3` | Referencia de estilo |
| `a3-a5c` (aéreo poético) | `a3-m15` | Referencia de estilo / fuente; sale del reel v3.1 para evitar ping-pong Reiniger↔Revenant en el beat 2 |

**v3.1 2026-07-12:** el beat 2 queda con una sola excursión a Revenant (`a2-a0` → `a3-a5b` [+ `a2-a0c` cuando haya canónico] → `a2-a0d`). Sale `a3-a5c`; su off pasa a `a2-a0d`. Tooling: `--borrador` degrada FLF con keyframe faltante a still del existente (recupera hook `a1-a1` y huevo `a2-a1b` en el animatic).

**v3 2026-07-11:** el reel deja de intentar "hacer entrar todo" y prioriza retención short-form: hook en el crimen firmado, progresión sin mesetas, coda comprimida y cierre compartible con la verdad de Rocas Coloradas.
