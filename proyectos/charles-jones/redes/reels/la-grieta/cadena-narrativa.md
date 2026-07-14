---
reel: la-grieta
doc: cadena-narrativa
estado: aprobado
fecha: 2026-07-14
---

# La grieta — Cadena narrativa

> Mapa narrativo del reel transversal, en lenguaje de historia (no de producción). **Gobierna** la `cutlist` del [README.md](README.md): la cutlist implementa esta cadena, no al revés. Es el **gate previo a generar imágenes** (Stage 2 en [../../TECH.md](../../TECH.md) §5): se aprueba el mapa de beats antes de gastar en madres o clips.
>
> **v4.1 2026-07-14 — huella comprimida + CTA poético.** El lado víctima deja de nombrarse uno a uno: "envejecieron solos" junta madre + joven; "El tiempo los volvió piedra" (plural) hace la fosilización. Sale la sequía (m09/m17). Cierre: frase poética sobre la huella en Rocas Coloradas (no CTA literal). No se borra ni se mueve ningún asset: lo desplazado queda como **referencia de estilo** / fuente.

## Cómo leer / iterar

Regla general del gate (lenguaje de historia y zoom-in por cobertura) en [pipeline.md](../../../../../metodo/pipeline.md) §2 paso 1. Acá, en concreto: cada número es un **beat** que se lee solo; la sangría marca un **zoom-in** (el beat se parte en varias imágenes); si un beat no se lee → se expande, si sobra → se comprime; orden de arriba hacia abajo, sin ramas.

---

## Esencia (criterio de corte)

- **Qué:** la partición del mundo no fue geología, fue un **crimen firmado** — y Charles fue testigo. Las víctimas tienen nombre: una familia de ornitorrincos separada para siempre. La evidencia existe de verdad: un fósil en Rocas Coloradas.
- **Cómo:** **testimonio de Charles en primera persona**, con culpa propia ("por mi descuido"). Cuento de siluetas interrumpido por golpes de realidad (Revenant). Arco: **testigo → crimen → culpa → víctimas → dos destinos → huella → invitación**. Patrón: cada línea de off ancla una madre; las transiciones respiran en silencio.
- **Por qué:** el remate invita a reflexionar — en Rocas Coloradas quedó **la huella de lo que fue**. La fábula se vuelve verificable y accionable.

Cada beat debe servir testimonio / crimen / víctimas / verdad. Lo que no lo sirve sale; lo que lo sirve débilmente se comprime. La amistad de Charles con el joven **sale del reel**.

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
   6.2  Transición: las coloradas del cuento.
   6.3  Se abren los ojos.
   6.4  Eco de caos: reprise de la grieta Revenant (cierra el loop).
   6.5  Corte a lo real: "En Rocas Coloradas quedó la huella
        de lo que fue."
        Sobreimpreso: Área Natural Protegida Rocas Coloradas,
        Comodoro Rivadavia.
```

---

## Mapa beat → clip (cobertura vs. huecos)

| Beat | Clip(s) en cutlist v4.1 | Cobertura |
|---|---|---|
| **1 · Yo estuve ahí (HOOK)** | `a2-a0c` (m07), `a2-a0d` (m08, silencio) | Cubierto. |
| **2 · El crimen** | `a1-a1` (mano), `a3-a5` (FLF m05→m06) | Cubierto. |
| **3 · La culpa** | `a2-a0`, `a2-a1`, `a2-a1c`, `a2-a1b`, `a2-a0b` | Cubierto. Offs: "Por mi descuido…" / "Otra vida quedó de este lado." |
| **4 · La separación** | `a3-a6c`, `a3-a6d`, `a3-a6e` | Cubierto. |
| **5 · Dos destinos + huella** | `a3-b0` (m08), `a3-b1` (padre), `a3-b3` (madre), `a3-c1b` (joven m18, silencio), `a3-c2` (FLF m10→m11), `a3-c3` (m13, silencio) | Cubierto. **Sale** `a3-b4` (sequía m09→m17). Huella absorbida en el beat 5. |
| **6 · El sueño / remate** | `a2-a2`, `a3-c1`, `a2-a2b`, `a3-c5` (reprise m07), `a3-c4` | Cubierto. CTA poético: "En Rocas Coloradas quedó la huella de lo que fue." |

## Diff conceptual v4 → v4.1

| Cambio | Destino |
|---|---|
| Offs "Primero se fue el joven" / "Después la madre…" | Salen; m18 pasa a transición muda tras "envejecieron solos" |
| Off "Y la piedra todavía guarda su forma" | Sale; m13 es transición muda |
| `a3-b4` (FLF m09→m17 sequía) | Sale del reel; queda fuente/destacadas |
| "Por un descuido…" | → "Por mi descuido…" |
| "Y la otra quedó de este lado" | → "Otra vida quedó de este lado." |
| "Ir a Rocas Coloradas" | → "En Rocas Coloradas quedó la huella de lo que fue." |

**v4.1 2026-07-14:** huella comprimida (plural), sequía fuera, CTA poético.

**v4 2026-07-14:** testigo abre; crimen con agencia; sin amistad; cierre CTA.
