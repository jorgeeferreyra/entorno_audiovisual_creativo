# Arco 3 — Voz en off (texto literal)

> Texto literal del **off** del Arco 3, listo para grabar (voz propia) o TTS. Antes solo existían indicaciones por clip en [arco-3-planos.md](arco-3.md) ("off documental (presenta la familia)"); acá está la locución palabra por palabra.
> - **v3 2026-07-11 — Charles narra en primera persona.** El reel se reescribe para short-form: abre con el crimen firmado, comprime contexto y presenta a la familia en la separación. Sigue siendo seco y sincero; el humor es estructural, nunca de diálogo. Cadena v3 en [../reels/la-grieta/cadena-narrativa.md](../reels/la-grieta/cadena-narrativa.md).
> - Idioma: **español** (títulos, audio y montaje van en español; solo los prompts de modelo van en inglés).
> - Sincronía: cada línea está asociada a su clip; el orden de la tabla sigue los beats de la v3. El **hook** (primeros ~3s del reel) vive en [arco-1-off.md](arco-1-off.md) + `a3-a5`.
> - El **cierre dice la verdad**: hoy es el Área Natural Protegida Rocas Coloradas, Comodoro Rivadavia (locación real). El sobreimpreso de la Fundación sale del reel (sigue como recurso del hilo en [../arco-3-ornitorrincos.md](../arco-3-ornitorrincos.md)).

---

## Beat 1 — El crimen

| Clip | Off (ES) | Nota |
|---|---|---|
| **a3-a5** (la grieta rasga) · **HOOK** | "La tierra era una sola. Hasta que empezó a partirse." | Completa el hook iniciado por `a1-a1`; Pangea vive en el firstFrame, sin `a3-a2` |

## Beat 2 — Yo estuve ahí

| Clip | Off (ES) | Nota |
|---|---|---|
| **a3-a5b** (caos Revenant) | *(SIN off — el caos habla solo: rumble + crujidos)* | Silencio de locución deliberado |
| a3-a5c (dos mundos) | "Donde hubo un mundo, había dos." | Cierra el golpe antes de la culpa de Charles |

## Beat 4 — La separación

| Clip | Off (ES) | Nota |
|---|---|---|
| a3-a6c (madre+cría, montaje ~1s) | "De este lado quedaron mi amigo y su madre." | Presenta a las víctimas directamente en el conflicto |
| a3-a6d (padre+huevo, montaje ~1s) | "Del otro, el padre y su huevo." | El huevo sigue estructural en la separación |
| a3-a6e (lejano los 4, montaje ~1.5s) | "Los cuatro, ya lejos. Irreversible." | Cierra la lectura espacial |
| a3-a6 (la despedida) | *(silencio)* | Beat 4.4: último instante antes del agua |

## Beat 5 — Dos destinos

| Clip | Off (ES) | Nota |
|---|---|---|
| a3-a5y (switch real→cuento) | "Los de aquel lado fueron prósperos." | Abre el contraste sin alargar establishing |
| a3-b1 (padre próspero) | "Tuvieron aguas que nunca dejaron de ser generosas." | La línea que florece |
| a3-b3 (la madre en declive) | "Los de este lado envejecieron solos." | Abre el lado víctima |
| a3-b4 (la tierra se seca) | "Año tras año, la tierra verde se cerró sobre sí misma." | El ecosistema muere |

## Beat 6 — La huella

| Clip | Off (ES) | Nota |
|---|---|---|
| a3-c1b (el joven, montaje ~1.5s) | "Primero se fue mi amigo, entre las rocas coloradas." | Beat 6.1 |
| a3-c2 (la fosilización) | "Después ella. La última. El tiempo la volvió piedra." | Beat 7.4; luego silencio |
| a3-c3 (el fósil, Revenant) | "Y la piedra todavía guarda su forma." | Beat 7.5: switch a lo real |

## Beat 7 — El sueño (coda / remate)

| Clip | Off (ES) | Nota |
|---|---|---|
| a3-c1 (las coloradas del cuento, push-in) | *(silencio)* | Beat 7.2: el susurro ya sonó en a2-a2 |
| a3-c5 (eco de caos Revenant, montaje ~1s) | *(SIN off — el caos habla solo)* | Beat 7.4: todo vuelve a romperse |
| a3-c4 (foto real, 3–4s) | "Esta parte es real." · Sobreimpreso: "Área Natural Protegida Rocas Coloradas — Comodoro Rivadavia" | Beat 7.5: corte a lo real; se dice la verdad de la locación |

---

## Destacadas del arco (S1–S5, off derivado por recorte, sin locución nueva)

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
- **Qué mirar:** `hook.strength` (weak/ok/strong) en los primeros 3s de cada bloque (líneas **HOOK**), `aigcReadiness.score` (0–100), diálogos "on the nose", y consistencia de registro sincero.
- El LLM creativo ya está configurado (`OPENAI_CREATIVE_MODEL` en `.env.local`), así que corre sin keys extra.

### Registro de resultados (completar tras correr)

| Bloque | hook.strength | aigcReadiness.score | Notas de Polish Pro | Estado |
|---|---|---|---|---|
| A | — | — | — | pendiente |
| B | — | — | — | pendiente |
| C | — | — | — | pendiente |
