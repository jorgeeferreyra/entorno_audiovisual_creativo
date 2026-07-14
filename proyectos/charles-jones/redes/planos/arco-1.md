# Arco 1 — Plano a plano (PARCIAL: solo el aporte al reel transversal)

> Bajada de producción del [Arco 1: La Mano Negra](../arco-1-mano-negra.md) a **fichas de ingesta** en wind-comic. Es **fuente por hilo** (spec ejecutable), no un entregable.
> **PARCIAL a propósito**: por ahora solo se bajan los beats que el reel transversal "La Grieta" necesita (el reveal de la mano). El hilo completo del Arco 1 (montaje de eras, informe de rentabilidad, logo de la Fundación) se baja cuando le toque el turno de producción (orden 3 → 1 → 2).
> Fuentes que NO se duplican acá: canon en [biblia-serie.md](../../biblia-serie.md), STYLE-BLOCK y anclas de estilo en [biblia-visual.md](../../biblia-visual.md), convención de IDs/archivos en [pipeline.md](../../../../metodo/pipeline.md) §5–6.

Convenciones (idénticas a [arco-3.md](arco-3.md)): prompts en inglés con el STYLE-BLOCK embebido literal; títulos/off/montaje en español; el movimiento de cámara va en `cameraPreset`.

Registro del Arco 1: conspirativo, humor Les Luthiers seco. En el reel entra como **reveal** justo después del caos de la grieta: la mano con cadenita **firma el informe** que aprueba la fractura (gag burocrático — no mapa cartográfico). En teatro de sombras la mano negra es **nativa del estilo** (una silueta más), así que se produce en silueta Lotte Reiniger, no como quiebre fotorrealista.

## Guion de color (tinte de fondo por beat)

| Beat | Tinte (línea EN del prompt) |
|---|---|
| El reveal (a1-a1) — sobre el caos rojo de la grieta | `dramatic deep red tinted background` |

---

## Sección 1 — Imágenes madre (generar PRIMERO)

**a1-m01 — Mano con cadenita firma el informe (gag burocrático)**

```yaml
kind: image
dest: assets/arco-1/madre/a1-m01-mano-cadenita.png
ref: assets/arco-1/madre/a1-m01-mano-cadenita.png
anatomyRefs:
  - assets/arco-3/madre/a3-m01-madre-ornitorrinco.png
provider: openrouter
```

Nota: Pick canónico: `a1-m01-c3` → `a1-m01-mano-cadenita.png`. **Keyframe inicial** del par FLF `a1-m01` → `a1-m01a` (clip `a1-a1`). **Outpaint a 9:16** (fuente 1:1): extender **solo el fondo rojo**; titular **"DOS CONTINENTES SE VENDEN MEJOR QUE UNO"** + sello **"APROBADO"** intocables; mismo framing del pergamino/mano para el par FLF. Ref 1 = madre aprobada; ref 2 = lock cuento (textura/filigrana).

Prompt (EN):
```
OUTPAINT to vertical 9:16. The first reference is the APPROVED square madre — preserve with near-100% fidelity the exact same clean aged paper sheet, the exact headline text "DOS CONTINENTES SE VENDEN MEJOR QUE UNO" in clear Spanish capital letters, the exact circular "APROBADO" stamp, the same rubber stamp and inkwell silhouette props, the same black paper-cutout hand with thick gold chain bracelet and fountain pen on the signature line — NEVER rewrite, move, crop, or alter the headline or the APROBADO stamp; they are UNTOUCHABLE. The second reference is the universe lock — adopt only aged-paper texture and filigree line weight, never its subject. Extend ONLY the dramatic deep red tinted background above and below into a tall vertical frame; keep the parchment and hand at the same relative size and placement in the center; NO other text, NO grids, NO charts, NO pseudo-text, fine lace-like hand-cut paper detail — NOT flat vector shapes, in the manner of Lotte Reiniger's Die Abenteuer des Prinzen Achmed, flat 2D layered paper theater, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

**a1-m01a — La firma es la grieta (keyframe final FLF) — diferido a keyframes**

```yaml
kind: image
dest: assets/arco-1/madre/a1-m01a-firma-grieta.png
ref: assets/arco-1/madre/a1-m01-mano-cadenita.png
provider: openrouter
```

Nota: **keyframe final** del par FLF con `a1-m01` — **mismo encuadre exacto** (papel, titular, sello APROBADO, props, mano, cadenita). Solo cambia el estado en la **zona de la firma**: la mano terminó el trazo, y **la firma ES la grieta** — una rasgadura corta que emula el gesto de la pluma (trazo manuscrito / virome), **solo rompe el rectángulo chico de la línea de firma**; NO parte la hoja entera de lado a lado; titular y sello intactos. **Solo ficha** — se genera en el gate de madres keyframes (pipeline §2 paso 4); el par se aprueba junto antes de pagar el clip `a1-a1`.

Prompt (EN):
```
The reference image is the APPROVED first keyframe — keep near-100% fidelity of the exact same composition and framing: same aged paper sheet, same headline "DOS CONTINENTES SE VENDEN MEJOR QUE UNO", same circular "APROBADO" stamp, same rubber stamp and inkwell props, same black paper-cutout hand with thick gold chain bracelet and fountain pen, same ornate border if present, same dramatic deep red tinted background. ONLY change the signature zone at the bottom of the sheet: the hand has finished the stroke; where the short horizontal signature line was, a small jagged black paper tear now sits — the crack IS the signature, shaped like a brief handwritten pen stroke / flourish (virome-like gesture), a LOCAL rip only in that small signature rectangle, with a thin slit of deep red background showing through. CRITICAL: the tear must NOT cross the whole sheet side to side; it must NOT cut through the headline or the APROBADO stamp; the upper 80% of the parchment stays intact. NOT ink handwriting, NOT a drawn line across the page, a physical micro-rip only where one would sign. Same gold chain filigree, fine lace-like hand-cut paper detail — NOT flat vector shapes, in the manner of Lotte Reiniger's Die Abenteuer des Prinzen Achmed, flat 2D layered paper theater, dramatic deep red tinted background, Lotte Reiniger inspired paper cutout silhouette animation, shadow puppet theater, black silhouettes with delicate cut-out inner details, tinted aged-paper background, dark fairy tale mood, sepia edges, vertical 9:16
```

---

## Sección 2 — Desglose plano a plano

**Clip a1-a1 — El reveal: la firma es la grieta**

```yaml
kind: video-flf
firstFrame: a1-m01
lastFrame: a1-m01a
cameraPreset: locked-tripod
duration: 5
```

cameraPreset locked-tripod: el teatro de sombras es plano; el movimiento lo pone la lapicera firmando, no la cámara. **Mismo encuadre** entre frames (m01 = pluma en la línea; m01a = la firma es la grieta que rasga el papel) — el FLF morphs el trazo→rasgadura; aprobar el par junto en el gate de madres keyframes (pipeline §2 paso 4) antes de pagar este clip. FLF no acepta 6s.

Motion prompt (EN):
```
The silhouetted hand with the gold chain finishes a short signature stroke at the bottom of the sheet; the stroke becomes a small jagged paper tear only in the signature zone — a local rip like a pen flourish, NOT a sheet-wide rift; headline and stamp stay intact; hinged paper puppet movement, flat 2D silhouette animation, dramatic deep red tinted background.
```
- Vision-Audit (EN): sceneDescription: `a silhouetted hand with a gold chain over a clean sheet whose headline reads DOS CONTINENTES SE VENDEN MEJOR QUE UNO, ending with a small signature-zone paper tear, on a deep red tinted background` · action: `the hand signs and the stroke becomes a local tear only where one would sign` · mood: `sinister, bureaucratic, dryly comic, revelatory`
- Audio: off documental (el reveal) + rumble grave residual del caos
- Montaje: en el reel v4 entra tras `a2-a0d` (vuelta al cuento) como beat 2 — el crimen firmado con agencia ("hicieron dos"); corta a `a3-a5` (Pangea → partida). Off en [arco-1-off.md](arco-1-off.md).
