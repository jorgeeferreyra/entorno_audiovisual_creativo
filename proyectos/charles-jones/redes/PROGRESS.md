# Redes (Arco 3) — Build Progress

_Last updated: 2026-07-09_
_Current stage: Stage 3 — Clips_
_Based on roadmap: [TECH.md](TECH.md) § 5_

> Session log agency-os + seguimiento detallado de producción (estados, costos, gates). Absorbe el antiguo `arco-3-roadmap.md`. No duplica prompts ni fichas: la fuente de verdad de los prompts es [arco-3-planos.md](planos/arco-3.md); el STYLE-BLOCK y los switches cuento↔real viven en [biblia-visual.md](../biblia-visual.md); la convención de IDs/archivos en [pipeline.md](../../../metodo/pipeline.md) §5.
> Comandos: los scripts de `engine/wind-mcp/` leen las fichas directamente de planos/arco-3.md. Generación: `npm run gen` (un solo CLI para madres y clips).

Estados: `pendiente` → `generado` (existe el archivo) → `aprobado` (pasó el criterio de su etapa). Se actualiza a mano al avanzar.

---

## 1. Stage Status

Espejo del roadmap de [TECH.md](TECH.md) § 5. Un stage se marca `[x]` solo cuando cumple sus Exit criteria.

- [x] **Stage 1 — Docs y spec** — fichas de planos/arco-3.md válidas
- [ ] **Stage 2 — Imágenes madre en cascada** — 17 madres aprobadas (todas generadas/aprobadas; ver checklist)
- [ ] **Stage 2.5 — Animatic (gate previo a video)** — animatic transversal `la-grieta` aprobado (ritmo/orden/subtítulos) antes de gastar en clips
- [ ] **Stage 3 — Clips** — bloques A/B/C generados y aprobados (Bloque A casi completo; B/C pendientes)
- [ ] **Stage 4 — Montaje del reel transversal** — la-grieta montado desde los bloques
- [ ] **Stage 5 — Destacadas del arco** — S1–S5 por recorte

## 2. Session Log

Nueva entrada arriba al cierre de cada sesión. No editar entradas pasadas.

### 2026-07-09 — Alineación al modelo transversal (post-auditoría)

- **Stage in flight:** Stage 2.5 (animatic) / Stage 3 (clips)
- **Done this session:**
  - Auditoría del modelo transversal ([auditoria-modelo-transversal.md](auditoria-modelo-transversal.md)) → alineación de todo lo desajustado.
  - **Herramienta animatic** ([`engine/wind-mcp/src/lib/animatic.ts`](../../../engine/wind-mcp/src/lib/animatic.ts)): (1) **FLF split** — los `video-flf` se muestran como first→last (dos mitades de `dur/2`), no un still; (2) **modo `--reel`** — animatic del intercut transversal desde la `cutlist` del front-matter de [reels/la-grieta/README.md](reels/la-grieta/README.md), cruzando arcos (los que no tienen planos aún se omiten con aviso).
  - **Cut-list** de 17 slots (~43s) escrita en el README del reel (mapa de intercut de la auditoría §A).
  - **Mini-planos parciales** de A1 ([planos/arco-1.md](planos/arco-1.md): mano+cadenita reveal) y A2 ([planos/arco-2.md](planos/arco-2.md): Charles silueta + tronco-balancín, la palanca) + sus off ([arco-1-off.md](planos/arco-1-off.md), [arco-2-off.md](planos/arco-2-off.md)). Solo los beats que el reel necesita.
  - **Deuda técnica revalidada**: puentes FLF `a5x`/`a5y`/`c0` y regen FLF de `a3-a5` **diferidos a destacadas** (el reel usa corte duro). Clips `b1`–`c2` marcados `pre-rediseño → re-auditar/regen`. `m18` = reserva sin uso.
- **Next step:** correr el animatic transversal, aprobar ritmo/orden, luego bajar madres de A1/A2 y regenerar `a3-a4`/`a3-c1`.
- **New blockers / questions raised:** destino final de `a3-m18` (decisión de dirección: reserva o beat de muerte del joven).

### 2026-07-09 — Modelado fuente-por-hilo + dos familias de salida

- **Stage in flight:** Stage 3 (clips)
- **Done this session:**
  - `redes/` quedó como hermano de `episodios/` bajo la serie. El episodio grabado NO pasa por el pipeline; lo que se produce es contenido de redes.
  - Modelo cerrado: los `arco-N.md` + `planos/` + `assets/arco-N/` son **fuente por hilo** (no entregables). Dos familias de salida: **reel transversal** (`reels/<slug>/`, cruza hilos) y **destacadas por arco** (`destacadas/arco-N/`, un solo hilo, diferidas).
  - Corregidas las salidas: borrados `reels/vidas-paralelas` y `reels/el-ultimo` (eran beats internos del Arco 3); `reels/la-grieta` reescrito como transversal (`arcos: [1,2,3]`, `origen:` como metadata).
  - Docs realineados: etiquetas "Reel A/B/C" → "Bloque A/B/C" en planos/arco-3.md y arco-3-ornitorrincos.md; SPEC/TECH/PROGRESS, estrategia, READMEs y pipeline al modelo de dos salidas. Enlaces huérfanos a `episodio-1/` corregidos.
- **Next step:** Stage 3 — generar Bloque B (b1–b4) y puentes; regenerar a3-a5 como FLF real.
- **New blockers / questions raised:** ninguno nuevo.

### 2026-07-09 — Reestructura a framework multi-proyecto

- **Stage in flight:** Stage 3 (clips)
- **Done this session:**
  - Repo reestructurado en `engine/` (herramienta), `metodo/` (principios/insights) y `proyectos/<serie>/<episodio>/` (contenido). Este episodio pasó a `proyectos/charles-jones/episodio-1/`.
  - `engine/wind-mcp` parametrizado por episodio (`--project` / `WIND_PROJECT`); `npm run gen -- --arco 3` verde con los mismos estados.
  - Flujo spec-driven montado: SPEC/TECH/PROGRESS + `.agency-os/`. Este doc absorbió `arco-3-roadmap.md`.
- **Next step:** Stage 3 — generar Reel B (b1–b4) y puentes; regenerar a3-a5 como FLF real.
- **New blockers / questions raised:** validar morph FLF por eslabón en el gateway qingyuntop.

---

## Orden de ejecución

1. **Docs** — planos / biblia / progreso alineados a las decisiones de dirección.
2. **Madres en cascada** — regenerar/generar con `--candidates 3` y aprobar con `--pick`, en orden: **m03' → m02' joven → m10' → m17**. Pares FLF se aprueban juntos (mismo encuadre).
3. **Animatic (gate)** — `npm run animatic -- --reel la-grieta` → aprobar ritmo/orden/subtítulos del intercut ANTES de gastar en video.
4. **Clips** — solo lo que el reel aprobado necesita: regen `a3-a4` (huevo) y `a3-c1` (push-in m07), generar `a3-c3`, re-auditar `b1`–`c2`, y las madres+clips de A1/A2. Puentes FLF (`a5x`/`a5y`/`c0`) y regen FLF de `a3-a5` **diferidos a destacadas**.
5. **Montaje del reel transversal** — desde la cut-list (inserts: eco m09 tras c3, foto real en a3-c4).
6. **Destacadas** — S1–S5 derivadas por recorte, cero generación.

### Próxima acción

**Paso 2 (madres del Arco 3) listo** — m02/m03/m10/m17 aprobados vía **OpenRouter / Nano Banana** (`google/gemini-2.5-flash-image`), con multi-ref (m01 lock + anatomía en `assets/fuentes/ornitorrincos/`). Provider por defecto en `npm run gen`; fallback `--provider minimax`.

**Siguiente = paso 3: animatic transversal (gate).** No cuesta nada (ffmpeg local); aprueba el intercut antes del video.

```bash
cd engine/wind-mcp && npm run animatic -- --reel la-grieta
# los slots a1-a1 / a2-a1 se omiten hasta generar sus madres (planos parciales ya bajados)
```

**Bloque A:** a3-a1…a3-a6 aprobados; a3-a4 **obsoleto** (era cría; regen U2V sobre m04 huevo). a3-a5 I2V degradado — regen FLF **diferido a S2**. **Gate Kling resuelto** (FLF real vía gateway qingyuntop) para cuando toque b4/c2.

---

## Criterios de aprobación por etapa

| Etapa | Criterio |
|---|---|
| Madres | Silueta 100% negra recorte plano (NO fieltro/3D/plush), fondo tintado del beat correcto (guion de color de [arco-3-planos.md](planos/arco-3.md)), STYLE-BLOCK respetado (salvo m12–m15 que rompen a propósito), 9:16. Personajes distinguibles por contorno. **Madres emparejadas** (par first/last de un FLF: m05/m06, m10/m11, m09/m17): mismo encuadre y composición base, solo cambia el estado — el par se aprueba junto ([biblia-visual.md](../biblia-visual.md) §3). Dirección de Ref: hereda de la madre ya aprobada/querida (hoy m10←m11). |
| Clips | Arranca 1:1 de su imagen madre, movimiento tipo títere de papel plano (no 3D), tinte estable durante el clip, duración correcta. FLF: morph real primer→último (provider `Kling-FLF`, no fallback I2V). |
| Reels | Continuidad de tinte entre clips, switches cuento↔real solo en la cadena de transiciones aprobada (ver abajo), audio off sincero sin chistes. |
| Stories | 15s, legibles sin audio, sin generación extra. |

**Dosificación de switches cuento↔real:** recurso **estructural** del arco (columna vertebral de transiciones), no un único quiebre aislado. Cadena aprobada en [arco-3-planos.md](planos/arco-3.md) §Cadena de transiciones: a5 (m05→m06), a5x experimental (m06→m14), a5y (m15→m08), c0 (m14→m07), c1 U2V+corte (m07→m10'), eco montaje m09, salto clínico c3/c4. No inventar switches fuera de esa cadena. El recurso híbrido (abajo) cuenta aparte con su propio tope.

---

## Checklist — Imágenes madre (17 generadas; m16 eliminada, m18 agregada)

| ID | Título | Estado | Costo real | Nota |
|---|---|---|---|---|
| a3-m01 | Madre ornitorrinco | aprobado | ~¥0.3 | Lock de consistencia ✓ — no tocar |
| a3-m02 | Ornitorrinco joven | aprobado | OpenRouter | Nano Banana multi-ref; pick c1 (más chico, panza arriba); path `a3-m02-ornitorrinco-joven.png` |
| a3-m03 | Padre ornitorrinco | aprobado | OpenRouter | Nano Banana multi-ref; pick c3 (fornido, 4 patas, orilla de lago) |
| a3-m04 | Huevo | aprobado | ~¥0.3 | Close-up nido; ahora firstFrame de a3-a4 ✓ |
| a3-m05 | Paisaje Pangea | aprobado | ~¥0.3 | |
| a3-m06 | Pangea partida | aprobado | ~¥0.3 | Grieta roja, agua en el gap ✓ |
| a3-m07 | Rocas Coloradas | aprobado | ~¥0.6 | Retry ×1; firstFrame de a3-c1 (U2V) ✓ |
| a3-m08 | Australia próspera | aprobado | ~¥0.3 | lastFrame de puente a3-a5y ✓ |
| a3-m09 | Argentina en declive | aprobado | ~¥0.3 | firstFrame a3-b4 + eco montaje c3e ✓ |
| a3-m10 | Ornitorrinco sobre roca | aprobado | OpenRouter | Nano Banana: Ref m01 + mundo m07 + foto; pick c3; MADRE muriendo junto al agua ✓ |
| a3-m11 | Fósil de piedra | aprobado | ~¥0.3 | NO tocar — madre padre del par fosilización ✓ |
| a3-m12 | Apertura cuaderno Charles | aprobado | ~¥0.3 | Intro transversal POV ✓ |
| a3-m13 | Fósil en yacimiento | aprobado | ~¥0.3 | Salto realidad clínico ✓ |
| a3-m14 | Grieta Revenant | aprobado | ~¥0.3 | REALITY-BLOCK-CHAOS; keyframe de a5x y c0 ✓ |
| a3-m15 | Zoom-out poético | aprobado | ~¥0.6 | Retry ×1; firstFrame de a3-a5y ✓ |
| ~~a3-m16~~ | ~~Ornitorrinco caminando~~ | **ELIMINADA** | — | Con m10 reencuadrada no comparte encuadre; a3-c1 = U2V sobre m07 |
| a3-m17 | Argentina seca (estado final) | aprobado | OpenRouter | Par m09→m17; pick c2; mismo encuadre más seco/oscuro ✓ |
| a3-m18 | Joven muriendo sobre roca | aprobado (**reserva, sin uso**) | OpenRouter | Nueva: Ref m02 + mundo m07 + foto; pick c2; JOVEN muriendo en cornisa. **Huérfana**: ninguna ficha de clip la usa y contradice el off (el joven prospera en Australia, b2). No usar hasta resolver la ambigüedad narrativa (auditoría §0/§C). |

> **Switch provider (2026-07-09):** madres con Ref/AnatomyRef pasan por `openrouter` (Nano Banana) en vez de Minimax. Minimax se queda como `--provider minimax` (composite 1-slot) por si hace falta.

## Checklist — Clips

| ID | Bloque | Herramienta | Estado | Costo real | Nota |
|---|---|---|---|---|---|
| a3-a1 | A | U2V | aprobado | ~¥0.5 | Intro transversal ✓ |
| a3-a2 | A | U2V | aprobado | ~¥0.5 | Establishing Pangea ✓ |
| a3-a3 | A | U2V | aprobado | ~¥0.5 | Ritual madre ✓ |
| a3-a4 | A | U2V | **obsoleto → regen** | ~¥0.5 (prev) | Regenerar: firstFrame m04 huevo (ya no cría) |
| a3-a5 | A | U2V-FLF | aprobado (I2V degradado) | ~¥0.5 | En el reel se tolera recortado a ~2s; **regen FLF m05→m06 diferido a la destacada S2** (auditoría §D) |
| a3-a5b | A | U2V | aprobado | ~¥0.5 | Switch caos Revenant ✓ |
| a3-a5c | A | U2V | aprobado | ~¥0.5 | Switch respiro crane-up ✓ |
| a3-a5x | A | U2V-FLF | pendiente (diferido) | — | **EXPERIMENTAL** m06→m14; **diferido a destacadas** — en el reel el corte duro alcanza (auditoría §D) |
| a3-a5y | A/B | U2V-FLF | pendiente (diferido) | — | Puente m15→m08; **diferido a destacadas** (auditoría §D) |
| a3-a6 | A | U2V | aprobado | ~¥0.5 | |
| a3-b1 | B | U2V | **generado (pre-rediseño) → re-auditar** | ~¥0.5 (prev) | mp4 en disco de una pasada previa; si el contorno del padre calza con m03' aprobada, reutiliza |
| a3-b2 | B | U2V | **generado (pre-rediseño) → re-auditar/regen** | ~¥0.5 (prev) | mp4 `cria-eclosionada` (concepto viejo); ficha ahora es joven (firstFrame m02) |
| a3-b3 | B | U2V | **generado (pre-rediseño) → re-auditar** | ~¥0.5 (prev) | mp4 en disco; probable reutiliza |
| a3-b4 | B | U2V-FLF | **generado (pre-rediseño) → re-auditar** | ~¥0.5 (prev) | mp4 en disco; ficha es FLF m09→m17 (verificar morph) |
| a3-c0 | C | U2V-FLF | pendiente (diferido) | — | Puente m14→m07; **diferido a destacadas** (auditoría §D) |
| a3-c1 | C | U2V | **generado (pre-rediseño) → regen** | ~¥0.5 (prev) | mp4 `ultimo-llega` = concepto m16 (caminata, eliminada); ficha ahora push-in sobre m07 |
| a3-c2 | C | U2V-FLF | **generado (pre-rediseño) → re-auditar** | ~¥0.5 (prev) | mp4 en disco; ficha es FLF m10'→m11; **Gate Kling** (verificar morph) |
| a3-c3 | C | U2V | pendiente | — | |
| a3-c3e | C | ninguna | pendiente | — | Eco 1–2s m09 (solo montaje) |
| a3-c4 | C | ninguna | pendiente | — | Solo montaje (foto real) |

## Continuidad y QC (vision-audit por clip)

Formaliza el QC que ya se hace informalmente (carpetas `_candidates`/`_audit`). Cada clip aprobado registra acá su chequeo contra los criterios de la etapa Clips (arranca 1:1 de la madre, movimiento títere plano, tinte estable, duración correcta).

**Character Studio (`/dashboard/characters`):** fichas en [personajes-studio.md](../personajes-studio.md); tras aprobar m02'/m03' subir archivos y pegar `imageUrls`.

| Clip | Vision-audit (scene/action/mood) | Contorno OK | Tinte estable | Estado |
|---|---|---|---|---|
| a3-a1 | — | ✓ | ✓ | aprobado |
| a3-a2 | — | ✓ | ✓ | aprobado |
| a3-a3 | — | ✓ | ✓ | aprobado |
| a3-a4 | (prev: baby) → regen huevo | — | — | obsoleto |
| a3-a5b | real earth splitting, debris | ✓ | ✓ | aprobado |
| a3-a5c | aerial two landmasses, golden dusk | ✓ | ✓ | aprobado |
| a3-a6 | mother at chasm edge, head lowering | ✓ | ✓ | aprobado |
| a3-a5x…a3-c4 | — | — | — | pendiente |

## Checklist — Salidas (montaje, sin costo de generación)

**Reel transversal** ([reels/la-grieta/](reels/la-grieta/)): intercala clips de los hilos. Hoy solo hay fuente del Arco 3; los bloques que la alimentan:

| Aporte (Arco 3) | Fuente | Estado |
|---|---|---|
| Bloque A "La grieta" | a3-a1…a3-a6 (+a5x/a5y si aprueban; +1–2 frames m-mano en a3-a5) | pendiente |
| Bloque B "Vidas paralelas" | a3-b1…a3-b4 (pantalla partida) | pendiente |
| Bloque C "El último" | a3-c0…a3-c4 (+eco m09) | pendiente |

**Destacadas del Arco 3** (`destacadas/arco-3/`, carpeta se crea al montar la primera):

| Destacada | Fuente | Estado |
|---|---|---|
| S1 La familia feliz | a3-a3 + a3-a4 (madre + huevo) | pendiente |
| S2 La grieta | a3-a5 | pendiente |
| S3 La despedida | a3-a6 | pendiente |
| S4 El declive | a3-b3 (+a3-b4) | pendiente |
| S5 El fósil | a3-c2 + a3-c3 + eco m09 + a3-c4 | pendiente |

---

## Presupuesto (techo operativo ~¥19–20)

| Etapa | Estimado | Real acumulado |
|---|---|---|
| Madres (16 × ¥0.3 + retries m02/m03/m10/m17 ×3 candidates) | ~¥4.8 + ~¥3–4 retries | ~¥6.0 (prev) |
| Clips U2V (~11 × ¥0.5, incl. a4 regen + c1) | ~¥5.5 | ~¥4.0 (Bloque A) |
| Clips FLF **del reel** (solo b4, c2 — el resto diferido) | ~¥2 | ¥0 |
| Gaps A1/A2 para el reel (4 madres + 3 clips) | ~¥2.6 | ¥0 |
| **Total reel** | **~¥14.9** (techo **¥19–20** con retries) | **~¥10** |

**Ahorro por el modelo transversal:** los puentes FLF `a5x`/`a5y`/`c0` y la regen FLF de `a3-a5` se **difieren a las destacadas** (auditoría §D) — el reel de 30–45s los cubre con corte duro. Eso baja el costo del reel ~¥3–4 respecto del reel autoconclusivo viejo, y el **gate del animatic** (gratis) confirma qué slots pagar antes de generar video.

Los retries de madres con `--candidates 3` suman ~¥0.9 c/u antes del pick: por eso la cascada ordenada (m03' → m02' → m10' → m17) y no regenerar en lote.

---

## Gate Kling — RESUELTO

`KELING_API_KEY` está configurada y `KELING_BASE_URL` apunta al **gateway qingyuntop** (`https://api.qingyuntop.top/kling`), que expone los endpoints Kling con key simple `Bearer` — exactamente la vía recomendada en [providers.md](../../../metodo/providers.md) §Caveats (evita el contrato enterprise de Kling oficial). La misma key sirve para `QINGYUNTOP_API_KEY`. Por lo tanto **FLF real está disponible** para la cadena de transiciones (a3-a5, a3-a5x, a3-a5y, a3-b4, a3-c0, a3-c2).

- Si la llamada a Kling falla, el fallback a Minimax I2V ya es automático en `generateFlfViaKling()` ([`engine/wind-mcp/src/lib/video.ts`](../../../engine/wind-mcp/src/lib/video.ts)) — degrada a solo primer frame con warning.
- Validación pendiente: aprobar cada FLF mirando que el morph efectivamente ocurra; si el gateway no lo soporta en un eslabón, se acepta I2V degradado o corte duro (especialmente a5x experimental).

### Regeneración pendiente de a3-a5 (créditos Qingyun ya cargados)

a3-a5 salió por I2V fallback cuando Kling devolvió "quota insufficient"; ahora hay saldo en el gateway. Regenerar con:

```bash
cd engine/wind-mcp && npm run gen -- --id a3-a5 --force
```

Requiere wind-comic arriba en modo real (`MOCK_ENGINES=0`). Criterio de aceptación: el log debe mostrar provider `Kling-FLF` (no `Minimax-I2V-fallback`) y el morph primer→último frame de la grieta debe ocurrir. Costo estimado ~¥1. Al aprobar, actualizar la fila de a3-a5 en el checklist de clips.

---

## Recurso híbrido (catalogado, regla en [biblia-visual.md](../biblia-visual.md) §1)

Sobrantes del primer e2e (estética cuaderno naturalista, NO canon). Nunca como lock ni firstFrame canónico.

| Archivo | Tipo | Usos (máx 2 en el arco) |
|---|---|---|
| `assets/arco-3/madre/a3-m01-madre-ornitorrinco-hibrid-1.png` | imagen | 0 |
| `assets/arco-3/madre/a3-m01-madre-ornitorrinco-hibrid-2.png` | imagen | 0 |
| `assets/arco-3/clips/a3-a3-madre-ritual-hibrid-1.mp4` | clip | 0 |
| `assets/arco-3/clips/a3-a3-madre-ritual-hibrid-2.mp4` | clip | 0 |

El tope de 2 usos es del **recurso completo** (sumando imágenes y clips), como transición/quiebre suave.
