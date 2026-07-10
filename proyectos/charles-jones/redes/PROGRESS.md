# Redes (Arco 3) — Build Progress

_Last updated: 2026-07-10_
_Current stage: Stage 3 — Beat 8 madres cerradas (m19/m21/m22/m23/m24); animatic borrador (Stage 6) próximo_
_Based on roadmap: [TECH.md](TECH.md) § 5_

> Session log agency-os + seguimiento detallado de producción (estados, costos, gates). Absorbe el antiguo `arco-3-roadmap.md`. No duplica prompts ni fichas: la fuente de verdad de los prompts es [arco-3-planos.md](planos/arco-3.md); el STYLE-BLOCK y los switches cuento↔real viven en [biblia-visual.md](../biblia-visual.md); la convención de IDs/archivos en [pipeline.md](../../../metodo/pipeline.md) §5.
> Comandos: los scripts de `engine/wind-mcp/` leen las fichas directamente de planos/arco-3.md. Generación: `npm run gen` (un solo CLI para madres y clips).

Estados: `pendiente` → `generado` (existe el archivo) → `aprobado` (pasó el criterio de su etapa). Se actualiza a mano al avanzar.

---

## 1. Stage Status

Espejo del roadmap de [TECH.md](TECH.md) § 5. Un stage se marca `[x]` solo cuando cumple sus Exit criteria.

- [x] **Stage 1 — Docs y spec** — fichas de planos/arco-3.md válidas
- [x] **Stage 2 — Cadena narrativa** — cadena del reel aprobada 2026-07-10 ([reels/la-grieta/cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md)); gate previo a imágenes
- [ ] **Stage 3 — Imágenes madre en cascada** — 17 madres aprobadas (todas generadas/aprobadas; ver checklist)
- [ ] **Stage 4 — Madres variations (unicidad por escena)** — 5 variaciones generadas/aprobadas; cero reutilización de firstFrame no exenta
- [ ] **Stage 5 — Madres keyframes** — cada par/cadena FLF de la §Cadena de transiciones aprobado junto (sobre las variaciones); solo escenas de 2/N keyframes
- [ ] **Stage 6 — Animatic (gate previo a video)** — dos pasadas: **borrador** (`--borrador`, bases en vez de variaciones, aprueba ritmo/orden ANTES de pagarlas) → **final** (variaciones reales + unicidad, gate que habilita clips)
- [ ] **Stage 7 — Clips** — bloques A/B/C generados y aprobados (Bloque A casi completo; B/C pendientes)
- [ ] **Stage 8 — Montaje del reel transversal** — la-grieta montado desde los bloques
- [ ] **Stage 9 — Destacadas del arco** — S1–S5 por recorte

## 2. Session Log

Nueva entrada arriba al cierre de cada sesión. No editar entradas pasadas.

### 2026-07-10 — m24 c1 promovida + limpieza de candidatos

- **Stage in flight:** Stage 3 — beat 8 cerrado en madres.
- **Done this session:**
  - **`a3-m24` ← c1** (tanda 2; las 4 figuras legibles).
  - **Limpieza:** eliminados candidatos no promovidos de `m19`/`m20`/`m22`/`m23`/`m24` y `a2-m03`. **`a2-m01` intacto** (otro chat).
- **Next step:** re-correr animatic borrador con beat 8 completo → afinar durs → variaciones.
- **New blockers / questions raised:** ninguno.

### 2026-07-10 — Picks m22/m23 + regen m24

- **Stage in flight:** Stage 3 — cierre beat 8.
- **Done this session:**
  - **Picks corregidos:** `a3-m22` ← **c1** (antes c2); `a3-m23` ← **c3** (antes c2).
  - **`a3-m24`:** ningún candidato de la tanda 1 promovido (figuras ausentes o solo un lado). Canónico borrado. Ficha reforzada: `ref a3-m21` + anatomy `m22`/`m23` (orillas aprobadas) + prompt con "exactly FOUR" siluetas.
- **Next step:** regenerar `a3-m24 --candidates 3` y pickear; luego re-correr animatic borrador.
- **New blockers / questions raised:** ninguno.

### 2026-07-10 — Beat 8 reestructurado + picks + reserva Revenant

- **Stage in flight:** Stage 3 (madres) → prep Stage 6 (animatic borrador).
- **Done this session:**
  - **Picks:** `a3-m19` ← c1 (grieta abriéndose); `a3-m21` ← copia de `a3-m19-c2` (grieta ya abierta); `a2-m03` ← c2 (gesto de alzar). **`a2-m01` no se tocó** (otro chat).
  - **Beat 8 por corte:** se retira ~~`a3-m20`~~ (frame único). Nuevas madres `a3-m21`…`a3-m24` + clips montaje `a3-a6a`…`a3-a6e`. Cutlist ~52s; off y cadena narrativa actualizados.
  - **Reserva Revenant:** ficha `a2-m06` en [planos/arco-2.md](planos/arco-2.md) (`styleBlock: false`, ref `ornitorrinco_crias.jpeg`) — **solo destacada**, no reel ni cadena de switches.
  - Fix menor: `resolveImageRefs` acepta `anatomyRefs` sin `ref` en openrouter (necesario para primeras madres).
- **Next step:** revisar el animatic borrador (`reels/la-grieta/animatic-la-grieta.mp4`) — afinar durs del beat 8; luego variaciones sobrevivientes → animatic final.
- **New blockers / questions raised:** ninguno; durs del beat 8 se afinan en el borrador. `a2-m01`/`a2-m04`/`a2-m05` siguen en otro chat (slots omitidos en el borrador).

### 2026-07-10 — Animatic borrador antes de pagar variaciones (micro-optimización de orden)

- **Stage in flight:** Stage 6 (Animatic) — tooling + reordenamiento; sin cambio de trabajo pendiente.
- **Done this session:**
  - **Modo `--borrador`** en el animatic ([`engine/wind-mcp/src/lib/animatic.ts`](../../../engine/wind-mcp/src/lib/animatic.ts) + [`scripts/animatic.ts`](../../../engine/wind-mcp/scripts/animatic.ts)): cuando un `firstFrame`/`lastFrame` apunta a una variación (`a{arco}-m{nn}v{k}`) aún no generada, degrada a su madre base en disco. El CLI lista los slots degradados y avisa que la pasada **no valida unicidad** (repeticiones esperadas). `MontarAnimaticResult` gana `degradados`. Sin el flag, comportamiento intacto (gate final estricto).
  - **Orden de dos pasadas formalizado** en el método ([pipeline.md](../../../metodo/pipeline.md) §2 pasos 3 y 5, flowchart 5a/5b): **animatic borrador** (gratis, bases) → generar variaciones **solo de los slots sobrevivientes** → **animatic final** (variaciones + unicidad, único gate). Espejos en [TECH.md](TECH.md) (Stage 4 Dependencies, Stage 6 dos pasadas) y en el Orden de ejecución / Próxima acción de este doc.
- **Por qué:** las variaciones son imágenes pagas; correr el borrador antes evita pagar la variación de un slot que el ritmo/orden termina recortando o matando. El costo es una corrida extra de ffmpeg (gratis), no una aprobación extra: el gate sigue siendo uno solo (el final).
- **Next step:** generar las 6 madres nuevas → correr el borrador (`npm run animatic -- --reel la-grieta --borrador`) → generar variaciones sobrevivientes → animatic final.
- **New blockers / questions raised:** ninguno.

### 2026-07-10 — Renumeración de stages y pasos (enteros consecutivos)

- **Stage in flight:** Stage 2 (Cadena narrativa) → prep de Stage 3/6 (sin cambio de trabajo, solo numeración).
- **Done this session:**
  - **Pasos del pipeline** ([../../../metodo/pipeline.md](../../../metodo/pipeline.md) §2) renumerados 0/1/1.5/1.75/2… → **1–9** consecutivos (lista, flowchart y auto-referencias).
  - **Stages del episodio** ([TECH.md](TECH.md) §5) renumerados 1/1.5/2/2.6/2.7/2.5/3… → **1–9** consecutivos, respetando el orden de ejecución real (el ex-2.5 animatic queda como Stage 6, después de keyframes).
  - **Referencias cruzadas** actualizadas en [insights.md](../../../metodo/insights.md), este doc (status, criterios, próxima acción), [reels/la-grieta/README.md](reels/la-grieta/README.md), [cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md), [planos/arco-3.md](planos/arco-3.md), [biblia-visual.md](../biblia-visual.md) y el comentario de [`specs.ts`](../../../engine/wind-mcp/src/lib/specs.ts).
  - **Principio anti-recurrencia:** el nombre de la capa es el identificador estable; el número es solo ordinal. Una inserción futura renumera headers, no rompe el vocabulario.
- **Sin cambio de proceso:** cero trabajo de producción alterado; es solo la numeración.
- **Next step:** retomar la generación de las madres pendientes (Stage 3) y el animatic (Stage 6).
- **New blockers / questions raised:** ninguno.

> **Nota de renumeración (2026-07-10):** las entradas de log **debajo de esta nota** usan la numeración vieja de stages/pasos. Mapa stages: Stage 1.5→**2**, Stage 2→**3**, Stage 2.6→**4**, Stage 2.7→**5**, Stage 2.5→**6**, Stage 3→**7**, Stage 4→**8**, Stage 5→**9** (Stage 1 sin cambio). Mapa pasos del pipeline: 0→**1**, 1→**2**, 1.5→**3**, 1.75→**4**, 2→**5**, 3→**6**, 4→**7**, 5→**8**, 6→**9**.

### 2026-07-10 — Coda del lugar blanco (beat 13, cruce con el Ep.1)

- **Stage in flight:** Stage 1.5 → prep de Stage 2/2.5 (misma cola que beats 8/9 y variaciones).
- **Done this session:**
  - **Beat 13 expandido** en [cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md): el ZOOM del remate deja de comprimir el lugar blanco. Sub-beats 13.2 (lugar blanco: Charles de espaldas alimenta palomas que no están, susurra "es en Rocas Coloradas") y 13.3 (el despertar en el mundo rojo). Mapa beat→clip actualizado.
  - **Coda bajada** a [planos/arco-2.md](planos/arco-2.md) (deja de estar diferida): madres nuevas `a2-m04` (lugar blanco, `ref a2-m01` + `charles/`, fondo blanco sin tinte) y `a2-m05` (despertar, `ref a2-m01` + mundo `a3-m07`, tinte rojo dusk). Registro nuevo en el guion de color: **cuento sin tinte** (ni sueño ni realidad). Stills de montaje `a2-a2`/`a2-a2b`.
  - **Ubicación**: entre `a3-c2` (fosilización) y `a3-c3` (el fósil hoy) — el tinte gris piedra de c2 se drena a blanco puro; el despertar rojo empalma con el salto a la realidad. Cutlist de [reels/la-grieta/README.md](reels/la-grieta/README.md) expandida (~47s): insertados los 2 stills; recortes compensatorios `a3-c2` 3→2.5 y `a3-c4` 3→2.5.
  - **Off** de los 2 slots en [arco-2-off.md](planos/arco-2-off.md): `a2-a2` susurro casi subliminal (no lectura documental), `a2-a2b` silencio.
- **Decisión de dirección aplicada:** entra como **stills de montaje** (~1.5s), cero costo de video ahora; el mensaje sin diálogo en pantalla (susurro subliminal, precedente de la m-mano en a3-a5). El animatic decide si algún still asciende a clip U2V.
- **Next step:** generar `a2-m04` y `a2-m05` con `npm run gen --candidates 3` y aprobar con `--pick`; luego el animatic transversal (Stage 2.5), junto con las demás madres pendientes.
- **New blockers / questions raised:** ninguno; a validar en el animatic que el fondo blanco de m04 lea como "portal" y no como error de tinte.

### 2026-07-10 — Capa madres keyframes (paso 1.75, gate propio)

- **Stage in flight:** nuevo Stage 2.7 (entre Stage 2.6 variations y Stage 2.5 animatic).
- **Done this session:**
  - **Capa formalizada** en el método: paso 1.75 en [pipeline.md](../../../metodo/pipeline.md) §2 — se **movió** la taxonomía 1/2/N (criterios + regla anti-inflación) desde el paso 1 (una sola fuente, DRY) y se le dio **gate propio**: cada par emparejado y cada cadena FLF se aprueba junto, sobre las variaciones del paso 1.5, ANTES del animatic. El paso 1 quedó con una línea de referencia; el paso 2 (animatic) deja de ser el primer lugar donde se valida el plan de keyframes (ahora lo **integra** en secuencia real).
  - **Espejos actualizados:** Stage 2.7 en [TECH.md](TECH.md) §5 (Stage 2 pierde "pares FLF aprobados juntos"; Stage 2.5 ahora depende de 2.7); regla 5 de [biblia-visual.md](../biblia-visual.md) §3 apunta al paso 1.75; fila de criterio **Madres keyframes** + Stage Status + orden de ejecución acá.
  - **Artefacto de la capa:** la tabla §Cadena de transiciones de [planos/arco-3.md](planos/arco-3.md) — citada como instancia del paso 1.75 y completada con los pares de bloque `m09→m17` (`a3-b4`) y `m10'→m11` (`a3-c2`).
- **Sin tooling nuevo:** el gate es aprobación de dirección sobre fichas/tablas que ya existen (no cambia `validarUnicidad()` ni el animatic).
- **Retroactividad (patrón Stage 1.5):** los pares ya aprobados juntos antes de formalizar (m05/m06, m10/m11, m09/m17) quedan cubiertos; el gate rige para los pares con firstFrame variado pendiente (m05v1, m14v1, m15v1) y todo par futuro.
- **Next step:** resolver el Stage 2.6 (variaciones) y luego correr el gate 2.7 sobre la tabla de transiciones antes del animatic.
- **New blockers / questions raised:** ninguno.

### 2026-07-10 — Capa madres variations (unicidad por escena)

- **Stage in flight:** nuevo Stage 2.6 (entre Stage 2 y 2.5).
- **Done this session:**
  - **Capa formalizada** en el método: paso 1.5 en [pipeline.md](../../../metodo/pipeline.md) §2 (regla, exenciones, mecanismo `ref` + Nano Banana, gate) + convención de ID `a{arco}-m{nn}v{k}` en §5; regla 7 en [biblia-visual.md](../biblia-visual.md) §3; Stage 2.6 + fila de presupuesto en [TECH.md](TECH.md).
  - **Regla:** toda reutilización de una madre en pantalla dispara una variación derivada de la base; la primera aparición usa la base. **Exentas:** keyframe compartido de cadena FLF (m06, m14, m07) y eco deliberado (m09 en c3e).
  - **5 fichas de variación** en [planos/arco-3.md](planos/arco-3.md) §1: `a3-m01v1` (borde grieta, rojo → a3-a6), `a3-m01v2` (llanura seca, gris → a3-b3), `a3-m05v1` (Pangea pre-quiebre → a3-a5), `a3-m14v1` (grieta polvo → a3-c0), `a3-m15v1` (aéreo hacia humedal → a3-a5y). `firstFrame` de esos 5 clips re-apuntados; §Cadena de transiciones actualizada.
  - **Chequeo automático** `validarUnicidad()` en [`specs.ts`](../../../engine/wind-mcp/src/lib/specs.ts), surfaceado en `npm run gen` y el animatic `--arco`. `npm run gen -- --arco 3` verde, sin warnings de unicidad.
- **Next step:** generar las 5 variaciones con `npm run gen -- --id a3-mNNvK --candidates 3` y aprobar con `--pick`; luego re-correr el animatic transversal (Stage 2.5) con las madres variadas y re-aprobar el gate (decisión de dirección).
- **New blockers / questions raised:** ninguno; `m05v1` debe conservar el encuadre exacto de m05/m06 (integridad del par FLF) — verificar en el pick.

### 2026-07-10 — Resolución de huecos beats 8 y 9 (fichas bajadas)

- **Stage in flight:** Stage 1.5 → prep de Stage 2/2.5.
- **Done this session:**
  - **Beat 8 (ZOOM separación)** bajado a [planos/arco-3.md](planos/arco-3.md): madres nuevas `a3-m19` (plano ancho, `ref a3-m06`) y `a3-m20` (familia repartida, multi-ref `a3-m01` + `ornitorrincos-dibujo.png` vía OpenRouter). Stills de montaje `a3-a6a`/`a3-a6b` antes de `a3-a6` (la despedida).
  - **Beat 9 (ZOOM Charles/palanca)** bajado a [planos/arco-2.md](planos/arco-2.md): `a2-m01` gana refs (`charles/` vía OpenRouter, guarda "nunca de frente"); madre nueva `a2-m03` (manos levantan la cría, refs `charles/` + `ornitorrinco_crias.jpeg` para la pose + `a3-m02` para la silueta). Stills `a2-a0`/`a2-a0b` antes de `a2-a1` (balancín). La consecuencia (9.6) la cierra el corte a `a3-b4` + off, sin plano propio.
  - **Cutlist** de [reels/la-grieta/README.md](reels/la-grieta/README.md) expandida a ~44s: insertados los 4 stills; recortes compensatorios `a3-a1` 3→2, `a3-a6` 3→2, `a2-a1` 4→3.
  - **Off** de los 4 slots nuevos en [arco-3-off.md](planos/arco-3-off.md) y [arco-2-off.md](planos/arco-2-off.md); mapa beat→clip de [cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md) marca 8 y 9 como cubiertos.
- **Decisión de dirección aplicada:** los sub-beats entran como **stills de montaje** (~1.5s), no clips U2V — cero costo de video ahora; el animatic decide después si alguno asciende.
- **Next step:** generar madres nuevas (`a3-m19`, `a3-m20`, `a2-m01`, `a2-m03`) con `npm run gen --candidates 3` → correr el animatic transversal (Stage 2.5).
- **New blockers / questions raised:** ninguno; a resolver en el animatic si `a2-m03` (manos + cría en silueta) lee bien o necesita clip.

### 2026-07-10 — Gate cadena narrativa (previo a imágenes)

- **Stage in flight:** Stage 1.5 (cadena narrativa) → prep de Stage 2/2.5.
- **Done this session:**
  - **Gate nuevo formalizado y aprobado:** [reels/la-grieta/cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md) — mapa de beats del reel en lenguaje de historia (no de producción) + leyenda "cómo leer/iterar". Gobierna la `cutlist` (la cutlist la implementa).
  - **Stage 1.5** insertado en [TECH.md](TECH.md) §5 entre docs y madres; Stage 2 y 2.5 pasan a depender de él.
  - **Mapa beat→clip** en el doc: cruce de los 13 beats contra la cutlist actual.
- **Hallazgo clave (huecos):** beats **8** (ZOOM separación: "unos ornitorrincos de un lado, otros del otro") y **9** (ZOOM Charles/palanca: de espaldas → levanta la cría → balancín → huevo cruza a Australia → consecuencia) están **sub-cubiertos**: la cutlist los comprime en un solo slot cada uno (`a3-a6` y `a2-a1`), y los planos parciales de A1/A2 no bajan esos sub-beats.
- **Next step:** (1) resolver cobertura de beats 8 y 9 — decisión de dirección sobre cuántas imágenes bajar y expandir fichas en [planos/arco-2.md](planos/arco-2.md) (+ cutlist del reel); (2) recién después re-correr y aprobar el animatic transversal (Stage 2.5).
- **New blockers / questions raised:** cuántas imágenes por zoom (8.1–8.3, 9.1–9.6) sin inflar el reel de 30–45s — decisión de dirección.

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
2. **Cadena narrativa (gate)** — [reels/la-grieta/cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md): mapa de beats en lenguaje de historia aprobado ANTES de generar imágenes; gobierna la cutlist.
3. **Madres en cascada** — regenerar/generar con `--candidates 3` y aprobar con `--pick`, en orden: **m03' → m02' joven → m10' → m17**.
4. **Animatic borrador (gratis)** — `npm run animatic -- --reel la-grieta --borrador`: las variaciones aún inexistentes degradan a su madre base; aprobar ritmo/orden/subtítulos ANTES de pagar las variaciones.
5. **Madres variations** — generar **solo las variaciones de los slots que sobrevivieron** al borrador (un slot recortado/muerto no paga su variación).
6. **Madres keyframes (gate)** — cada par/cadena FLF de la [§Cadena de transiciones](planos/arco-3.md) aprobado junto (mismo encuadre, solo cambia el estado), sobre las variaciones; ANTES del animatic final.
7. **Animatic final (gate)** — `npm run animatic -- --reel la-grieta` (sin `--borrador`) → con variaciones reales + unicidad; aprobar ANTES de gastar en video.
8. **Clips** — solo lo que el reel aprobado necesita: regen `a3-a4` (huevo) y `a3-c1` (push-in m07), generar `a3-c3`, re-auditar `b1`–`c2`, y las madres+clips de A1/A2. Puentes FLF (`a5x`/`a5y`/`c0`) y regen FLF de `a3-a5` **diferidos a destacadas**.
9. **Montaje del reel transversal** — desde la cut-list (inserts: eco m09 tras c3, foto real en a3-c4).
10. **Destacadas** — S1–S5 derivadas por recorte, cero generación.

### Próxima acción

**Beat 8 cerrado en madres:** `m19`/`m21`/`m22`(c1)/`m23`(c3)/`m24`(c1) aprobados; ~~`m20`~~ RETIRADA; `a2-m03` c2; `a2-m06` reserva. Candidatos no promovidos eliminados.

1. **Re-correr animatic borrador** — `npm run animatic -- --reel la-grieta --borrador` (beat 8 completo).
2. Afinar durs → variaciones sobrevivientes → animatic final.
3. **`a2-m01`** sigue en el otro chat.

---

## Criterios de aprobación por etapa

| Etapa | Criterio |
|---|---|
| Madres | Silueta 100% negra recorte plano (NO fieltro/3D/plush), fondo tintado del beat correcto (guion de color de [arco-3-planos.md](planos/arco-3.md)), STYLE-BLOCK respetado (salvo m12–m15 que rompen a propósito), 9:16. Personajes distinguibles por contorno. Dirección de Ref: hereda de la madre ya aprobada/querida (hoy m10←m11). |
| Madres keyframes (Stage 5) | Solo escenas de 2 o N keyframes. **Par emparejado** (par first/last de un FLF: m05v1/m06, m06/m14, m15v1/m08, m14v1/m07, m09/m17, m10'/m11): mismo encuadre y composición base, solo cambia el estado — el par se aprueba **junto** ([biblia-visual.md](../biblia-visual.md) §3, [pipeline.md](../../../metodo/pipeline.md) §2 paso 4). **Cadena** (N>2): eslabones aprobados juntos, `lastFrame` de un eslabón = `firstFrame` del siguiente (keyframe compartido). Sobre las variaciones del Stage 4, no sobre las madres base. |
| Clips | Arranca 1:1 de su imagen madre, movimiento tipo títere de papel plano (no 3D), tinte estable durante el clip, duración correcta. FLF: morph real primer→último (provider `Kling-FLF`, no fallback I2V). |
| Reels | Continuidad de tinte entre clips, switches cuento↔real solo en la cadena de transiciones aprobada (ver abajo), audio off sincero sin chistes. |
| Stories | 15s, legibles sin audio, sin generación extra. |

**Dosificación de switches cuento↔real:** recurso **estructural** del arco (columna vertebral de transiciones), no un único quiebre aislado. Cadena aprobada en [arco-3-planos.md](planos/arco-3.md) §Cadena de transiciones: a5 (m05→m06), a5x experimental (m06→m14), a5y (m15→m08), c0 (m14→m07), c1 U2V+corte (m07→m10'), eco montaje m09, salto clínico c3/c4. No inventar switches fuera de esa cadena. El recurso híbrido (abajo) cuenta aparte con su propio tope.

---

## Checklist — Imágenes madre (17 generadas; m16 eliminada, m18 agregada)

| ID | Título | Estado | Nota |
|---|---|---|---|
| a3-m01 | Madre ornitorrinco | aprobado | Lock de consistencia ✓ — no tocar |
| a3-m02 | Ornitorrinco joven | aprobado | Nano Banana multi-ref; pick c1 (más chico, panza arriba); path `a3-m02-ornitorrinco-joven.png` |
| a3-m03 | Padre ornitorrinco | aprobado | Nano Banana multi-ref; pick c3 (fornido, 4 patas, orilla de lago) |
| a3-m04 | Huevo | aprobado | Close-up nido; ahora firstFrame de a3-a4 ✓ |
| a3-m05 | Paisaje Pangea | aprobado | |
| a3-m06 | Pangea partida | aprobado | Grieta roja, agua en el gap ✓ |
| a3-m07 | Rocas Coloradas | aprobado | Retry ×1; firstFrame de a3-c1 (U2V) ✓ |
| a3-m08 | Australia próspera | aprobado | lastFrame de puente a3-a5y ✓ |
| a3-m09 | Argentina en declive | aprobado | firstFrame a3-b4 + eco montaje c3e ✓ |
| a3-m10 | Ornitorrinco sobre roca | aprobado | Nano Banana: Ref m01 + mundo m07 + foto; pick c3; MADRE muriendo junto al agua ✓ |
| a3-m11 | Fósil de piedra | aprobado | NO tocar — madre padre del par fosilización ✓ |
| a3-m12 | Apertura cuaderno Charles | aprobado | Intro transversal POV ✓ |
| a3-m13 | Fósil en yacimiento | aprobado | Salto realidad clínico ✓ |
| a3-m14 | Grieta Revenant | aprobado | REALITY-BLOCK-CHAOS; keyframe de a5x y c0 ✓ |
| a3-m15 | Zoom-out poético | aprobado | Retry ×1; firstFrame de a3-a5y ✓ |
| ~~a3-m16~~ | ~~Ornitorrinco caminando~~ | **ELIMINADA** | Con m10 reencuadrada no comparte encuadre; a3-c1 = U2V sobre m07 |
| a3-m17 | Argentina seca (estado final) | aprobado | Par m09→m17; pick c2; mismo encuadre más seco/oscuro ✓ |
| a3-m18 | Joven muriendo sobre roca | aprobado (**reserva, sin uso**) | Nueva: Ref m02 + mundo m07 + foto; pick c2; JOVEN muriendo en cornisa. **Huérfana**: ninguna ficha de clip la usa y contradice el off (el joven prospera en Australia, b2). No usar hasta resolver la ambigüedad narrativa (auditoría §0/§C). |
| a3-m19 | Separación: grieta abriéndose | aprobado | Beat 8.1a; pick c1; still `a3-a6a` |
| ~~a3-m20~~ | ~~Familia repartida (frame único)~~ | **RETIRADA** | Reemplazada por estrategia de 3 (`m22`/`m23`/`m24`); candidatos c1–c3 quedan como ref visual |
| a3-m21 | Separación: grieta ya abierta | aprobado | Beat 8.1b; copia de `a3-m19-c2`; still `a3-a6b` |
| a3-m22 | Orilla cercana: madre + cría | aprobado | Beat 8.2a; pick c1; still `a3-a6c` |
| a3-m23 | Orilla lejana: padre + huevo | aprobado | Beat 8.2b; pick c3; still `a3-a6d` |
| a3-m24 | Plano lejano: los 4 + grieta | aprobado | Beat 8.2c; pick c1 (tanda 2); still `a3-a6e` |
| a2-m01 | Charles de espaldas | pendiente | Beat 9.1; **se maneja en otro chat — no tocar**. Vive en [planos/arco-2.md](planos/arco-2.md) |
| a2-m03 | Manos levantan la cría (cuento) | aprobado | Beat 9.3; pick c2 (gesto de alzar); still `a2-a0b` |
| a2-m06 | Manos + cría (Revenant) | pendiente (**reserva destacada**) | `styleBlock: false`; ref `ornitorrinco_crias.jpeg`; NO entra al reel |
| a2-m04 | El lugar blanco | aprobado | Beat 13.2 Revenant; pick `revenant-c2` → canónico, `revenant-c3` → `a2-m04-lugar-blanco-c3.png`; still `a2-a2`. Vive en [planos/arco-2.md](planos/arco-2.md) |
| a2-m05 | El despertar | pendiente | Beat 13.3; `ref a2-m01` + mundo `a3-m07` (OpenRouter), tinte rojo dusk; still `a2-a2b`. Vive en [planos/arco-2.md](planos/arco-2.md) |
| a3-m01v1 | Madre al borde de la grieta (variación) | pendiente | Stage 4; `ref a3-m01` (OpenRouter), tinte rojo; firstFrame de a3-a6 |
| a3-m01v2 | Madre en llanura seca (variación) | pendiente | Stage 4; `ref a3-m01` (OpenRouter), tinte gris; firstFrame de a3-b3 |
| a3-m05v1 | Pangea antes del quiebre (variación) | pendiente | Stage 4; `ref a3-m05`; mismo encuadre que m05/m06 (par FLF); firstFrame de a3-a5 |
| a3-m14v1 | Grieta real, polvo asentándose (variación) | pendiente | Stage 4; `ref a3-m14`, styleBlock false; firstFrame de a3-c0 |
| a3-m15v1 | Aéreo hacia el humedal (variación) | pendiente | Stage 4; `ref a3-m15`, styleBlock false; firstFrame de a3-a5y |

> **Switch provider (2026-07-09):** madres con Ref/AnatomyRef pasan por `openrouter` (Nano Banana) en vez de Minimax. Minimax se queda como `--provider minimax` (composite 1-slot) por si hace falta.

## Checklist — Clips

| ID | Bloque | Herramienta | Estado | Nota |
|---|---|---|---|---|
| a3-a1 | A | U2V | aprobado | Intro transversal ✓ |
| a3-a2 | A | U2V | aprobado | Establishing Pangea ✓ |
| a3-a3 | A | U2V | aprobado | Ritual madre ✓ |
| a3-a4 | A | U2V | **obsoleto → regen** | Regenerar: firstFrame m04 huevo (ya no cría) |
| a3-a5 | A | U2V-FLF | aprobado (I2V degradado) | En el reel se tolera recortado a ~2s; **regen FLF m05→m06 diferido a la destacada S2** (auditoría §D) |
| a3-a5b | A | U2V | aprobado | Switch caos Revenant ✓ |
| a3-a5c | A | U2V | aprobado | Switch respiro crane-up ✓ |
| a3-a5x | A | U2V-FLF | pendiente (diferido) | **EXPERIMENTAL** m06→m14; **diferido a destacadas** — en el reel el corte duro alcanza (auditoría §D) |
| a3-a5y | A/B | U2V-FLF | pendiente (diferido) | Puente m15→m08; **diferido a destacadas** (auditoría §D) |
| a3-a6 | A | U2V | aprobado | |
| a3-b1 | B | U2V | **generado (pre-rediseño) → re-auditar** | mp4 en disco de una pasada previa; si el contorno del padre calza con m03' aprobada, reutiliza |
| a3-b2 | B | U2V | **generado (pre-rediseño) → re-auditar/regen** | mp4 `cria-eclosionada` (concepto viejo); ficha ahora es joven (firstFrame m02) |
| a3-b3 | B | U2V | **generado (pre-rediseño) → re-auditar** | mp4 en disco; probable reutiliza |
| a3-b4 | B | U2V-FLF | **generado (pre-rediseño) → re-auditar** | mp4 en disco; ficha es FLF m09→m17 (verificar morph) |
| a3-c0 | C | U2V-FLF | pendiente (diferido) | Puente m14→m07; **diferido a destacadas** (auditoría §D) |
| a3-c1 | C | U2V | **generado (pre-rediseño) → regen** | mp4 `ultimo-llega` = concepto m16 (caminata, eliminada); ficha ahora push-in sobre m07 |
| a3-c2 | C | U2V-FLF | **generado (pre-rediseño) → re-auditar** | mp4 en disco; ficha es FLF m10'→m11; **Gate Kling** (verificar morph) |
| a3-c3 | C | U2V | pendiente | |
| a3-c3e | C | ninguna | pendiente | Eco 1–2s m09 (solo montaje) |
| a3-c4 | C | ninguna | pendiente | Solo montaje (foto real) |
| a3-a6a | A | ninguna | generado | Beat 8.1a; still m19 (~1.5s), solo montaje |
| a3-a6b | A | ninguna | generado | Beat 8.1b; still m21 (~1.5s), solo montaje |
| a3-a6c | A | ninguna | generado | Beat 8.2a; still m22 (~1.5s), solo montaje |
| a3-a6d | A | ninguna | generado | Beat 8.2b; still m23 (~1.5s), solo montaje |
| a3-a6e | A | ninguna | generado | Beat 8.2c; still m24 (~2s), solo montaje |
| a2-a0 | A2 | ninguna | pendiente | Beat 9.1; still a2-m01 (~1.5s), solo montaje — otro chat |
| a2-a0b | A2 | ninguna | generado | Beat 9.3; still a2-m03 (~1.5s), solo montaje |
| a2-a2 | A2 | ninguna | listo (still) | Beat 13.2; still a2-m04 canónico (~1.5s); entre a3-c2 y a3-c3; c3 aprobada como A/B |
| a2-a2b | A2 | ninguna | pendiente | Beat 13.3; still a2-m05 (~1.5s), solo montaje |

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

## Presupuesto

El presupuesto (estimado y real) no se documenta acá. Las cifras de costo viven solo en la doc de costos ([../../../metodo/providers.md](../../../metodo/providers.md) + [tarifas.json](../../../metodo/tarifas.json)); la estimación se calcula on-demand con la calculadora de costos y el costo real vive en los sidecars `.json` por asset. Decisión de alcance vigente: los puentes FLF `a5x`/`a5y`/`c0` y la regen FLF de `a3-a5` se **difieren a las destacadas** (auditoría §D) — el reel de 30–45s los cubre con corte duro, y el **gate del animatic** (gratis) confirma qué slots generar antes de pagar video.

---

## Gate Kling — RESUELTO

`KELING_API_KEY` está configurada y `KELING_BASE_URL` apunta al **gateway qingyuntop** (`https://api.qingyuntop.top/kling`), que expone los endpoints Kling con key simple `Bearer` — exactamente la vía recomendada en [providers.md](../../../metodo/providers.md) §Caveats (evita el contrato enterprise de Kling oficial). La misma key sirve para `QINGYUNTOP_API_KEY`. Por lo tanto **FLF real está disponible** para la cadena de transiciones (a3-a5, a3-a5x, a3-a5y, a3-b4, a3-c0, a3-c2).

- Si Kling no cubre el FLF (o la cadena FLF cae), `generarVideoFLF()` ([`engine/wind-mcp/src/lib/video.ts`](../../../engine/wind-mcp/src/lib/video.ts)) degrada automáticamente a I2V (solo primer frame) re-despachando por el registry, con warning — la degradación ya no está casada a Minimax.
- Validación pendiente: aprobar cada FLF mirando que el morph efectivamente ocurra; si el gateway no lo soporta en un eslabón, se acepta I2V degradado o corte duro (especialmente a5x experimental).

### Regeneración pendiente de a3-a5 (créditos Qingyun ya cargados)

a3-a5 salió por I2V fallback cuando Kling devolvió "quota insufficient"; ahora hay saldo en el gateway. Regenerar con:

```bash
cd engine/wind-mcp && npm run gen -- --id a3-a5 --force
```

Requiere wind-comic arriba en modo real (`MOCK_ENGINES=0`). Criterio de aceptación: el log debe mostrar provider `Kling-FLF` (no `Minimax-I2V-fallback`) y el morph primer→último frame de la grieta debe ocurrir. Al aprobar, actualizar la fila de a3-a5 en el checklist de clips.

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
