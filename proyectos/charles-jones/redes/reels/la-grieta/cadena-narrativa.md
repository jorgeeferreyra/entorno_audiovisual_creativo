---
reel: la-grieta
doc: cadena-narrativa
estado: aprobado
fecha: 2026-07-14
---

# La grieta — Cadena narrativa

> Mapa narrativo del reel transversal, en lenguaje de historia (no de producción). **Gobierna** la `cutlist` del [README.md](README.md): la cutlist implementa esta cadena, no al revés. Es el **gate previo a generar imágenes** (Stage 2 en [../../TECH.md](../../TECH.md) §5): se aprueba el mapa de beats antes de gastar en madres o clips.
>
> **v4.1 2026-07-14 — huella comprimida; coda en cuento.** El lado víctima deja de nombrarse uno a uno. Cierre: lugar blanco → cara → Coloradas Reiniger. Salen foto real (`a3-c4`) y eco de caos (`a3-c5`). No se borra ni se mueve ningún asset.

## Cómo leer / iterar

Regla general del gate (lenguaje de historia y zoom-in por cobertura) en [pipeline.md](../../../../../metodo/pipeline.md) §2 paso 1. Acá, en concreto: cada número es un **beat** que se lee solo; la sangría marca un **zoom-in**; orden de arriba hacia abajo, sin ramas.

---

## Esencia (criterio de corte)

- **Qué:** la partición del mundo no fue geología, fue un **crimen firmado** — y Charles fue testigo. Las víctimas: una familia de ornitorrincos separada para siempre. La evidencia existe: un fósil en Rocas Coloradas (en el cuerpo del reel; el cierre no corta a foto real).
- **Cómo:** **testimonio de Charles en primera persona**, con culpa propia ("por mi descuido"). Cuento de siluetas interrumpido por golpes de realidad (Revenant). Arco: **testigo → crimen → culpa → víctimas → dos destinos → huella → sueño**. Patrón: línea-ancla + transiciones mudas.
- **Por qué:** el remate cierra en el cuento — el susurro nombra el lugar y las Coloradas Reiniger lo muestran.

Cada beat debe servir testimonio / crimen / víctimas / verdad. La amistad de Charles con el joven **sale del reel**.

---

## La cadena (v4.1 — testigo abre)

```text
1  Yo estuve ahí (HOOK)
   1.1  La grieta Revenant. "Yo estuve ahí…"
   1.2  Transición: misma escena en cuento (Reiniger).

2  El crimen (agencia)
   2.1  Una mano con cadenita firma. "Donde había un mundo,
        hicieron dos."
   2.2  Transición: Pangea entera.
   2.3  Transición: Pangea partida.

3  La culpa
   3.1  Yo, de espaldas: "Estaba todo muy inestable."
   3.2  "Por mi descuido…" — la bota sobre el tronco.
   3.3  Transición: el nido vacío.
   3.4  "Una vida cruzó el planeta."
   3.5  "Otra vida quedó de este lado."

4  La separación (las víctimas)
   4.1  "Familias separadas por la grieta." Madre + cría.
   4.2  Transición: padre + huevo.
   4.3  Transición: los cuatro, ya lejos.

5  Dos destinos + huella
   5.1  "De aquel lado tuvieron prosperidad."
   5.2  Transición: el padre, fuerte.
   5.3  "De este lado, envejecieron solos." Madre.
   5.4  Transición: el joven sobre la roca.
   5.5  "El tiempo los volvió piedra."
   5.6  Transición: fosilización (cuento).
   5.7  Transición: el fósil real (Revenant). Silencio.

6  El sueño (coda / remate)
   6.1  El lugar blanco. Susurro: "…es en Rocas Coloradas…"
   6.2  Transición: la cara de Charles.
   6.3  Remate: las coloradas del cuento (Reiniger, sin cara).
```

---

## Mapa beat → clip (cobertura vs. huecos)

| Beat | Clip(s) en cutlist v4.1 | Cobertura |
|---|---|---|
| **1 · Yo estuve ahí (HOOK)** | `a2-a0c`, `a2-a0d` | Cubierto. |
| **2 · El crimen** | `a1-a1`, `a3-a5` | Cubierto. |
| **3 · La culpa** | `a2-a0`, `a2-a1`, `a2-a1c`, `a2-a1b`, `a2-a0b` | Cubierto. |
| **4 · La separación** | `a3-a6c`, `a3-a6d`, `a3-a6e` | Cubierto. |
| **5 · Dos destinos + huella** | `a3-b0`, `a3-b1`, `a3-b3`, `a3-c1b`, `a3-c2`, `a3-c3` | Cubierto. Sale `a3-b4`. |
| **6 · El sueño / remate** | `a2-a2` → `a2-a2b` → `a3-c1` | Cubierto. **Salen** `a3-c5` y `a3-c4`. |

## Diff conceptual (cierre)

| Cambio | Destino |
|---|---|
| `a3-c4` + "En Rocas Coloradas quedó la huella…" | **Sale del reel**; cierre = Coloradas Reiniger (`a3-c1`) |
| `a3-c5` eco de caos | **Sale del reel** |
| `a3-b4` sequía | Sale del reel (v4.1) |

**v4.1 2026-07-14:** huella comprimida; coda = lugar blanco → cara → Coloradas Reiniger (sin foto real).
