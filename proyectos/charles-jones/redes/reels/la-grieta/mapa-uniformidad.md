---
reel: la-grieta
doc: mapa-uniformidad
estado: propuesto
fecha: 2026-07-11
locks:
  cuento: a3-m01
  real: a3-m14
madres:
  # --- Locks (copiados tal cual; no se re-pasan) ---
  - { id: a3-m01, lock: cuento, esLock: true, tinte: "warm amber and saturated green tinted background", preserva: "universe lock — copy as-is" }
  - { id: a3-m14, lock: real, esLock: true, tinte: "cold muted earth tones (REALITY-BLOCK-CHAOS)", preserva: "universe lock — copy as-is" }

  # --- Cuento → lock a3-m01 ---
  - { id: a3-m03, lock: cuento, tinte: "saturated lush green tinted background", preserva: "bulkier body, brow notch, all four legs, lake shore", aspecto: outpaint }
  - { id: a3-m05, lock: cuento, tinte: "warm amber and saturated green tinted background sky", preserva: "EXACT framing (FLF pair base with m06)" }
  - { id: a3-m06, lock: cuento, tinte: "dramatic deep red tinted background sky", preserva: "EXACT framing = m05 (FLF pair)" }
  - { id: a3-m07, lock: cuento, tinte: "deep red and orange tinted background", preserva: "Coloradas stacked cutout layers; firstFrame of U2V c1" }
  - { id: a3-m08, lock: cuento, tinte: "saturated lush green tinted background, warm prosperous glow", preserva: "framing untouchable (lastFrame FLF a5y)" }
  - { id: a3-m09, lock: cuento, tinte: "cold desaturated grey tinted background", preserva: "EXACT framing (FLF pair with m17; also eco c3e)" }
  - { id: a3-m17, lock: cuento, tinte: "cold desaturated grey tinted background, darker and dimmer", preserva: "EXACT framing = m09 (FLF pair)" }
  - { id: a3-m10, lock: cuento, tinte: "deep red dusk tinted background", preserva: "EXACT framing (FLF pair with m11), exhausted sprawl pose" }
  - { id: a3-m11, lock: cuento, tinte: "red tint fading to stone grey", preserva: "EXACT framing = m10 (FLF pair; beloved madre)" }
  - { id: a3-m18, lock: cuento, tinte: "deep red dusk tinted background", preserva: "small young on ledge, head drooping" }
  - { id: a3-m22, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "mother+young contours, channel at frame edge", aspecto: outpaint }
  - { id: a3-m23, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "father brow notch, egg in nest" }
  - { id: a3-m24, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "exactly FOUR tiny silhouettes, distance between groups" }
  - { id: a1-m01, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "legible text UNTOUCHABLE (headline DOS CONTINENTES SE VENDEN MEJOR QUE UNO + APROBADO stamp); EXACT framing (FLF pair with a1-m01a); Fase 2 outpaint ONLY extends background — titular+sello zone intocable", aspecto: outpaint }
  - { id: a2-m01, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "full-body back silhouette master, never the face" }
  - { id: a2-m02a, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "boot+log only, nothing else in frame" }
  - { id: a2-m02b, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "empty nest on log only" }
  - { id: a2-m02c, lock: cuento, tinte: "dramatic deep red tinted background with living green vegetation accents", preserva: "egg lying on its side, prosperous bank (FLF lastFrame with a2-m02d pending)" }
  - { id: a2-m03, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "hands+cria gesture, early rift background" }
  - { id: a2-m05, lock: cuento, tinte: "deep red dusk tinted background", preserva: "ECU eyes, filigree facial detail" }
  - { id: a2-m08, lock: cuento, tinte: "dramatic deep red tinted background", preserva: "SAME framing as a2-m07 (transversal switch pair)" }

  # --- Real → lock a3-m14 ---
  - { id: a3-m15, lock: real, tinte: "golden dusk light (REALITY-BLOCK-POETIC)", preserva: "aerial stillness, immense scale" }
  - { id: a3-m13, lock: real, tinte: "natural daylight, clinical documentary (no paper tint)", preserva: "forensic stillness of the dig site" }
  - { id: a2-m07, lock: real, fuente: "assets/arco-2/madre/a2-m07-grieta-revenant-c3.png", tinte: "deep blood-red overcast dusk light", preserva: "SAME framing as a2-m08, extreme OTS" }
  - { id: a2-m04, lock: real, tinte: "pure white void — NO paper tint", preserva: "white void and absent pigeons; unify grain/light only — NEVER correct the white toward the lock palette", grade: grano }

  # --- Exentas ---
  - { id: a3-m12, exento: true, motivo: "marco POV del cuaderno — registro propio, fuera de la cutlist v3; se conserva como referencia de estilo" }

  # --- Diferidas (cutlist las alcanza; se generan post-promoción y heredan uniformidad vía ref) ---
  - { id: a1-m01a, diferido: true, motivo: "keyframe final FLF — Stage 5; hereda de a1-m01 uniforme" }
  - { id: a2-m02d, diferido: true, motivo: "keyframe inicial FLF — Stage 5; hereda de cadena m02 uniforme" }
  - { id: a3-m01v1, diferido: true, motivo: "variación Stage 4; hereda de a3-m01 uniforme" }
  - { id: a3-m01v2, diferido: true, motivo: "variación Stage 4; hereda de a3-m01 uniforme" }
  - { id: a3-m14v1, diferido: true, motivo: "variación Stage 4; hereda de a3-m14 (lock)" }
  - { id: a3-m15v1, diferido: true, motivo: "variación Stage 4; hereda de a3-m15 uniforme" }
---

# La grieta — Mapa de uniformidad de universo

> Gate de dirección: unifica las madres del reel contra **2 locks de universo** (cuento / real) en **dos capas**. **Capa 1 (determinística, default):** grade clásico (paleta/textura/grano/viñeta) + crop 9:16 vía ffmpeg — sin modelos, margen de error cero sobre composición/texto. **Capa 2 (generativa, diferida):** outpainting a 9:16 y atributos que requieren modelo (peso de línea/filigrana). Salida: [`_madres-uniformes/`](_madres-uniformes/) ya en 9:16 (este gate **absorbe** el antiguo gate hermano `_madres-916/`).
>
> Gobierna el comando `npm run uniformar -- --reel la-grieta`. El mapa se aprueba **antes** de gastar. DRY: el tinte se deriva del guion de color / fichas de `planos/arco-N.md`; acá solo se declara, no se inventa.

## Cómo leer / iterar

1. **Locks** (`locks.cuento` / `locks.real`): madres ya aprobadas que definen el universo. El look se deriva de sus canónicos; en capa 1 pasan solo por crop 9:16 (sin grade), salvo `aspecto: outpaint` / `aspecto: nativo`.
2. **Fila por madre**: `id → lock → tinte → preserva`. El tinte es variación legítima del beat (el grade **no** lo aplana hacia el lock: el hue no se toca). `preserva` protege encuadres FLF, texto legible y motivos de trama.
3. **`fuente`**: override de path cuando el canónico de la ficha no está en disco (ej. `a2-m07` solo tiene `-c3`) o cuando el slot usa un archivo literal (ej. `a2-m04-c3`).
4. **`grade`**: perfil del pase determinístico. Default `full`. `grade: grano` = solo grano/luz/viñeta mono (sin textura de papel ni curva) — usado en el void blanco `a2-m04`.
5. **`crop`**: offset horizontal de la ventana 9:16 (fracción −1..1 o px si |n|≥1). Default: centro. Decisión de dirección; se persiste acá tras aprobar propuestas (`--propuestas`).
6. **`aspecto: outpaint`**: no se recorta en capa 1 (recibe grade sin crop; sidecar `aspectoPendiente`). Extensión a 9:16 va a la capa generativa (Fase 2); el grade se re-aplica como paso final. En `a1-m01` el outpaint **solo puede extender fondo** — titular y sello APROBADO son intocables.
7. **`aspecto: nativo`**: conserva dims originales (sin crop ni marca de outpaint). Pensado para locks que no deben recibir píxeles generados (p.ej. `a3-m14`); los usos de cutlist pueden croppear aparte.
8. **`intensidad`**: 0..1 (default 1). Escala el look hacia neutro (sat/contrast → 1; opacidades/viñeta × intensidad). Parámetro fijo por madre — nunca adaptativo por imagen (pares FLF intactos).
9. **`exento: true`**: no entra al re-pase (motivo obligatorio).
10. **`diferido: true`**: la cutlist la alcanza pero aún no existe / se genera después (variations/keyframes); hereda uniformidad vía `ref` post-promoción.
11. Si la cutlist suma una madre nueva → agregar fila acá **antes** de correr el comando (el CLI falla si falta).

## Decisiones de este mapa

| Tema | Decisión |
|---|---|
| Lock cuento | `a3-m01` (lock de consistencia del arco) |
| Lock real | `a3-m14` (grieta Revenant canónica; hermana de `a2-m07`) — **outpaint PROHIBIDO** (es la referencia del universo real); crop-vs-nativo pendiente de lámina corregida |
| `a3-m01` | Queda como lock de cuento y base de variaciones; ya no tiene slot propio (`a3-a3` cae del reel v3) |
| `a3-m02` | Sale de la cutlist v3 con `a3-b2`; queda como referencia de estilo/anatomía, no se uniforma ahora |
| Tinte `a3-m03` | Alineado al beat del reel (Bloque B próspero): `saturated lush green` — no al ámbar/verde de la ficha original (Pangea feliz) |
| `a2-m07` | Fuente `-c3` (re-pick pendiente; canónico borrado) |
| `a2-m04` | Void blanco: `grade: grano` — unificar solo grano/luz **mono**; **nunca** teñir hacia el lock. `a2-m04-c3` cae del reel v3 y queda como referencia de estilo |
| Outpaint Fase 2 | `a1-m01`, `a3-m03`, `a3-m22`. **`a1-m01`**: outpaint solo extiende fondo — titular + sello intocables |
| Lote trivial 9:16 | 768×1344 → shave central 12px: **aprobado** (default centro) |
| Pares FLF/switch | Misma ventana exacta a ambos miembros (`m05/m06`, `m09/m17`, `m10/m11`, `a2-m07/m08`) |
| Aspecto 9:16 | Absorbido por este gate (capa 1). Propuestas en `_audit/aspecto/`; crop persistido en `crop:`; outpaint/nativo vía `aspecto:` |
| Exenta | `a3-m12` (marco POV fuera de cutlist v3). `a3-c4` no es madre. Eco `a3-c5` = mismo archivo que `a3-m14` (lock) |
| Referencias de estilo fuera de mapa | `a3-m04`, `a3-m19`, `a3-m21`, `a3-m02`, `a2-m04-c3`, `a2-m09` se conservan en disco y se registran en [../../PROGRESS.md](../../PROGRESS.md) |

## Pendientes que heredan después (no en este mapa)

Se generan post-promoción con `ref` a canónicos ya uniformes: `a1-m01a`, `a2-m02d`, `a3-m01v1`, `a3-m01v2`, `a3-m14v1`, `a3-m15v1`. `a3-m05v1` queda cancelada por la v3: al caer `a3-a2`, `a3-m05` ya no se reutiliza en pantalla y puede ser el firstFrame directo de `a3-a5`.

## Secuencia de confirmaciones

1. Locks designados → 2. **Este mapa aprobado** → 3. Propuestas de reencuadre (`--propuestas`) aprobadas y persistidas → 4. `npm run uniformar` (capa 1) → 5. Carpeta `_madres-uniformes/` aprobada → (posterior) `--promover` con confirmación explícita. Capa 2 (outpaint / filigrana) es Fase 2.
