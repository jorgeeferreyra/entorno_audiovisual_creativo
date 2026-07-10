# Arco 3 — Voz en off (texto literal)

> Texto literal del **off documental** del Arco 3, listo para grabar (voz propia) o TTS. Antes solo existían indicaciones por clip en [arco-3-planos.md](arco-3.md) ("off documental (presenta la familia)"); acá está la locución palabra por palabra.
> - Registro: **Attenborough sincero**, sin chistes verbales. El humor es estructural (solemnidad extrema aplicada a ornitorrincos), nunca de diálogo. Tesis del arco en [../redes/arco-3-ornitorrincos.md](../redes/arco-3-ornitorrincos.md).
> - Idioma: **español** (títulos, audio y montaje van en español; solo los prompts de modelo van en inglés).
> - Sincronía: cada línea está asociada a su clip; la duración objetivo es la del clip (5s salvo aclaración). El **hook** (primeros ~3s de cada reel) va marcado para la auditoría de Polish Pro.

---

## Reel A — "La grieta"

| Clip | Off (ES) | Nota |
|---|---|---|
| **a3-a1** (intro cuaderno) · **HOOK** | "En las páginas de este cuaderno hay una historia que el tiempo intentó borrar." | Gancho de misterio; el white-out final enmascara el corte |
| a3-a2 (establishing Pangea) | "Hace ciento ochenta millones de años, toda la tierra firme era una sola. Un continente. Un solo hogar para todos." | Presenta el mundo |
| a3-a3 (madre en su ritual) | "A la orilla de un río tranquilo, una madre ornitorrinco repetía, cada mañana, el mismo gesto paciente." | Presenta la familia |
| a3-a4 (la cría) | "Y a pocos pasos, en un nido de ramas, dormía la única razón de ese gesto." | Cierra el bloque "unidad" |
| a3-a5 (la grieta) | "Pero bajo sus patas, la tierra ya había empezado a partirse." | Transición-gancho |
| **a3-a5b** (caos Revenant) | *(SIN off — el caos habla solo: rumble + crujidos)* | Silencio de locución deliberado |
| a3-a5c (respiro poético) | "Cuando todo se detuvo, donde antes hubo un mundo, ahora había dos." | La escala de lo ocurrido |
| a3-a6 (la separación) | "De un lado del mar quedó ella. Del otro, todo lo que amaba." | La despedida; cierra el Reel A |

---

## Reel B — "Vidas paralelas"

| Clip | Off (ES) | Nota |
|---|---|---|
| **a3-b1** (padre próspero) · **HOOK** | "Del otro lado del océano, la vida no solo continuó: floreció." | Gancho de contraste |
| a3-b2 (la cría creciendo) | "La cría creció fuerte, en aguas que jamás dejaron de ser generosas." | La línea que prospera |
| a3-b3 (la madre en declive) | "Pero en la orilla que se secaba, la madre envejecía sola." | La pérdida |
| a3-b4 (el ambiente secándose) | "Año tras año, la tierra que fue verde se cerraba sobre sí misma." | El ecosistema cambia |

---

## Reel C — "El último" (pieza estrella)

| Clip | Off (ES) | Nota |
|---|---|---|
| **a3-c1** (el último llega) · **HOOK** | "De aquella familia, al final, quedó uno solo. El último de su linaje." | Gancho elegíaco |
| a3-c2 (la fosilización) | "Se recostó sobre la roca colorada. Y el tiempo, paciente, hizo el resto." | Luego **silencio final** |
| a3-c3 (el fósil hoy) | "Hoy, en esas mismas rocas, la piedra todavía recuerda su forma." | Salto a la realidad |
| a3-c4 (foto real, 3–4s) | *(off breve o silencio)* · Sobreimpreso: "La Fundación protege hoy este yacimiento." | Remate: humor negro estructural (el criminal custodiando la escena del crimen) |

---

## Stories S1–S5 (off derivado por recorte, sin locución nueva)

Reutilizan las líneas de arriba; cero grabación extra.

| Story | Beat | Off (líneas reutilizadas) |
|---|---|---|
| S1 La familia feliz | a3-a3 + a3-a4 | líneas de a3-a3 y a3-a4 |
| S2 La grieta | a3-a5 | línea de a3-a5 |
| S3 La despedida | a3-a6 | línea de a3-a6 |
| S4 El declive | a3-b3 (+a3-b4) | líneas de a3-b3 y a3-b4 |
| S5 El fósil | a3-c2 + a3-c3 + a3-c4 | líneas de a3-c2 y a3-c3 |

---

## Auditoría Polish Pro (pendiente de correr)

Pasar este off por Polish Pro para validar gancho y naturalidad antes de grabar:

- **UI:** `/dashboard/polish` · **API:** `POST /api/polish-script`
- **Config:** modo **pro**, estilo **documental**, intensidad **ligera** (el registro ya está definido; solo pulir, no reescribir el tono).
- **Qué mirar:** `hook.strength` (weak/ok/strong) en los primeros 3s de cada reel (líneas **HOOK**), `aigcReadiness.score` (0–100), diálogos "on the nose", y consistencia de registro sincero.
- El LLM creativo ya está configurado (`OPENAI_CREATIVE_MODEL` en `.env.local`), así que corre sin keys extra.

### Registro de resultados (completar tras correr)

| Reel | hook.strength | aigcReadiness.score | Notas de Polish Pro | Estado |
|---|---|---|---|---|
| A | — | — | — | pendiente |
| B | — | — | — | pendiente |
| C | — | — | — | pendiente |
