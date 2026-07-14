# Arco 3 — Voz en off (texto literal)

> Texto literal del **off** del Arco 3, listo para grabar (voz propia) o TTS.
> - **v4.1 2026-07-14 — huella comprimida; coda en cuento.** Cierre: lugar blanco → cara → Coloradas Reiniger. Salen foto real y eco de caos. Cadena en [../reels/la-grieta/cadena-narrativa.md](../reels/la-grieta/cadena-narrativa.md).
> - Idioma: **español**.
> - El **hook** vive en [arco-2-off.md](arco-2-off.md) (`a2-a0c`). El remate del reel es visual (Coloradas Reiniger); no hay CTA hablado al final.

---

## Beat 2 — El crimen (aporte vía a3-a5; off de la mano en arco-1)

| Clip | Off (ES) | Nota |
|---|---|---|
| **a3-a5** (Pangea → partida, FLF) | *(silencio)* | Beat 2.2–2.3: transiciones mudas tras "hicieron dos"; la línea vive en `a1-a1` |

## Beat 4 — La separación

| Clip | Off (ES) | Nota |
|---|---|---|
| a3-a6c (madre+cría, montaje ~1.5s) | "Familias separadas por la grieta." | Línea-ancla del beat; presenta a las víctimas |
| a3-a6d (padre+huevo, montaje ~1s) | *(silencio)* | Transición muda |
| a3-a6e (lejano los 4, montaje ~1.5s) | *(silencio)* | Transición muda; cierra la lectura espacial |
| ~~a3-a6 (la despedida)~~ | ~~*(silencio)*~~ | **Fuera reel v4** — queda como referencia de estilo |

## Beat 5 — Dos destinos + huella

| Clip | Off (ES) | Nota |
|---|---|---|
| a3-b0 (Australia próspera, still m08) | "De aquel lado tuvieron prosperidad." | Abre el contraste |
| a3-b1 (padre próspero) | *(silencio)* | Transición muda: el padre, fuerte |
| a3-b3 (la madre) | "De este lado, envejecieron solos." | Línea-ancla; junta a madre + joven |
| a3-c1b (el joven sobre la roca, montaje ~1.5s) | *(silencio)* | Transición muda: el joven (antes tenía off propio) |
| a3-c2 (la fosilización, FLF m10→m11) | "El tiempo los volvió piedra." | Plural: ambos; luego silencio en m11 |
| a3-c3 (el fósil, Revenant) | *(silencio)* | Transición muda al fósil real |
| ~~a3-b4 (la tierra se seca)~~ | ~~*(silencio)*~~ | **Fuera reel v4.1** — sequía sale del reel |

## Beat 6 — El sueño (coda / remate)

| Clip | Off (ES) | Nota |
|---|---|---|
| a3-c1 (las coloradas del cuento, push-in) | *(silencio)* | Beat 6.3: **remate del reel** — Coloradas Reiniger tras la cara de Charles |
| ~~a3-c5 (eco de caos)~~ | ~~*(SIN off)*~~ | **Fuera reel** — queda como fuente |
| ~~a3-c4 (foto real)~~ | ~~"En Rocas Coloradas quedó la huella de lo que fue."~~ | **Fuera reel** — CTA/foto real salen del cierre |

---

## Destacadas del arco (S1–S5, off derivado por recorte, sin locución nueva)

Reutilizan las líneas de arriba; cero grabación extra.

| Story | Beat | Off (líneas reutilizadas) |
|---|---|---|
| S1 La familia feliz | a3-a3 + a3-a4 | líneas de a3-a3 y a3-a4 |
| S2 La grieta | a3-a5 | línea de a1-a1 (contexto) |
| S3 La despedida | a3-a6 | línea de a3-a6c |
| S4 El declive | a3-b3 (+a3-c1b) | línea de a3-b3 |
| S5 El fósil | a3-c2 + a3-c3 + a3-c4 | líneas de a3-c2 y a3-c4 |

---

## Auditoría Polish Pro (pendiente de correr)

Pasar este off por Polish Pro para validar gancho y naturalidad antes de grabar:

- **UI:** `/dashboard/polish` · **API:** `POST /api/polish-script`
- **Config:** modo **pro**, estilo **documental**, intensidad **ligera**.
- **Qué mirar:** `hook.strength`, `aigcReadiness.score`, diálogos "on the nose", consistencia de registro sincero.

### Registro de resultados (completar tras correr)

| Bloque | hook.strength | aigcReadiness.score | Notas de Polish Pro | Estado |
|---|---|---|---|---|
| A | — | — | — | pendiente |
| B | — | — | — | pendiente |
| C | — | — | — | pendiente |
