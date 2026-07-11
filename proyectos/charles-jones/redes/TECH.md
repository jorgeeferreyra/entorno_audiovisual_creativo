# Redes (charles-jones) — Fundación técnica

_Status: Approved_
_Date: 2026-07-09_
_Based on: [SPEC.md](SPEC.md)_

> El **cómo** de las redes: motores por arco, presupuesto y decisiones de producción específicas. El método transversal (estrategia "un personaje por clip", convención de IDs, plantillas de ingesta) vive en [../../../metodo/pipeline.md](../../../metodo/pipeline.md) y no se duplica acá.

---

## 1. Contexto

Producción con la instancia local de `wind-comic` (en `engine/wind-comic`) orquestada por `engine/wind-mcp` (BYO keys). Un solo CLI: `npm run gen` lee las fichas de `planos/arco-3.md` y despacha por `kind`.

## 2. Motores por arco

Qué lockear y con qué motor, según el tipo de contenido de cada arco (relocado desde el pipeline; es decisión específica de esta serie).

| Arco | Elemento a lockear | Motor recomendado | Por qué |
|---|---|---|---|
| 1 · Mano Negra | Ninguno (solo mano + cadenita) | Minimax Hailuo | La mano se mantiene con prompt + primer frame; no gasta lock |
| 2 · Charles | 1 sujeto | Minimax S2V o Kling | S2V lockea 1 protagonista; silueta de espaldas = poca cara = fácil |
| 3 · Ornitorrincos | Referencia de imagen por animal | Kling FLF o Seedance multi-ref | Consistencia desde imagen madre como primer frame (I2V) |

Referencia de motores/capacidades/tarifas: [../../../metodo/providers.md](../../../metodo/providers.md).

**Decisión de imagen (Arco 3):** madres con Ref/AnatomyRef se generan por defecto con **OpenRouter / Nano Banana** (`google/gemini-2.5-flash-image`), multi-ref (lock m01 + anatomía en `assets/fuentes/ornitorrincos/`). Fallback: `--provider minimax` (composite 1-slot).

## 3. Servicios y keys

BYO keys en `engine/wind-comic/.env.local`. Inventario priorizado y estado: [../../../metodo/providers.md](../../../metodo/providers.md) §4.

| Servicio | Uso | Estado |
|---|---|---|
| MINIMAX_API_KEY | Imagen + video I2V + TTS (un motor más del registry de video, ya no bloqueante del camino de video) | Configurada |
| KELING_API_KEY (vía gateway qingyuntop) | FLF real de la cadena de transiciones | Configurada — Gate Kling resuelto |
| OPENROUTER_API_KEY | Nano Banana (imagen con refs, default Arco 3) | Configurada |
| OPENAI_API_KEY | LLM / fallback imagen | Configurada |

## 4. Presupuesto

El presupuesto no se documenta acá. Las cifras de costo viven solo en la doc de costos ([../../../metodo/providers.md](../../../metodo/providers.md) + [tarifas.json](../../../metodo/tarifas.json)); la estimación de este episodio (cantidades × tarifa) se calcula on-demand con la calculadora de costos, no se copia a este archivo.

Principio de dirección: el video es el mayor costo; los motores caros (Kling, Veo) se reservan a los planos-gancho.

## 5. Roadmap (stages)

Orden de ejecución del episodio, cada stage entregable por separado.

### Stage 1 — Docs y spec
**Goal:** planos / biblia / spec alineados a dirección. **Exit:** fichas de `planos/arco-3.md` válidas (`npm run gen -- --arco 3` sin errores).

### Stage 2 — Cadena narrativa (gate previo a imágenes)
**Método:** instancia del paso 1 del pipeline ([../../../metodo/pipeline.md](../../../metodo/pipeline.md) §2). **Goal:** mapa de beats del reel en lenguaje de historia (no de producción) aprobado por dirección, con el cruce beat→clip que expone los huecos de cobertura **antes** de gastar en madres/clips. **Scope:** [reels/la-grieta/cadena-narrativa.md](reels/la-grieta/cadena-narrativa.md) — la cadena aprobada + mapa beat→clip contra la `cutlist`. **Gate:** no se generan imágenes nuevas sin la cadena aprobada; gobierna la cutlist (la cutlist la implementa). **Exit:** `cadena-narrativa.md` con `estado: aprobado`. Las madres del Arco 3 se generaron antes de formalizar este gate; rige retroactivamente para los gaps (A1/A2, zooms de los beats 8 y 9) y toda generación futura.

### Stage 3 — Imágenes madre en cascada
**Goal:** las 16 madres aprobadas. **Scope:** generar con `--candidates 3`, aprobar con `--pick`, en orden m03' → m02' → m10' → m17. **Dependencies:** Stage 2 (Cadena narrativa) aprobado. **Exit:** todas las madres con criterio de la etapa Madres. (Los pares/cadenas FLF se aprueban juntos en el Stage 6 (Madres keyframes), no acá.)

### Stage 4 — Uniformidad de universo (gate del reel)
**Método:** instancia del paso 3 del pipeline ([../../../metodo/pipeline.md](../../../metodo/pipeline.md) §2). **Goal:** las madres del reel comparten un solo universo visual por registro (cuento/Reiniger y real/Revenant) — paleta/textura/grano coherentes con el lock, sin aplanar el tinte del beat ni los encuadres FLF — y salen en 9:16. **Dos capas:** (1) **determinística (default):** grade clásico + crop 9:16 vía ffmpeg (`npm run uniformar -- --reel la-grieta`); look derivado de los locks en `_look/`; propuestas de reencuadre en `_audit/aspecto/` (`--propuestas`). Absorbe el antiguo gate hermano `_madres-916/`. (2) **generativa (diferida, `--capa 2` / Fase 2):** outpainting a 9:16 y atributos que requieren modelo (peso de línea/filigrana); el grade se re-aplica como paso final. **Scope:** [reels/la-grieta/mapa-uniformidad.md](reels/la-grieta/mapa-uniformidad.md) (locks + mapa + `grade`/`crop`/`aspecto`) → carpeta [`_madres-uniformes/`](reels/la-grieta/_madres-uniformes/). Nunca pisa canónicos de `assets/arco-N/madre/`. **Dependencies:** Stage 3 (Imágenes madre) — las madres base ya aprobadas. **Gate (secuencia de confirmaciones):** (1) locks designados → (2) mapa aprobado → (3) propuestas de reencuadre aprobadas → (4) comando capa 1 corrido → (5) carpeta `_madres-uniformes/` aprobada. La promoción a canónicos (`--promover`, archiva originales en `_prev/`) es un paso posterior con confirmación explícita. **Exit:** `_madres-uniformes/` aprobada; criterio de la etapa Madres uniformes en [PROGRESS.md](PROGRESS.md).

### Stage 5 — Madres variations (unicidad por escena)
**Método:** instancia del paso 4 del pipeline ([../../../metodo/pipeline.md](../../../metodo/pipeline.md) §2). **Goal:** cero madres repetidas tal cual entre escenas — cada reutilización en pantalla resuelta con una variación única derivada de la base (Nano Banana, `ref:` + `provider: openrouter`). **Scope (5 variaciones del Arco 3):** `a3-m01v1` (m01 al borde de la grieta, tinte rojo, clip `a3-a6`), `a3-m01v2` (m01 en llanura agrietada, tinte gris, clip `a3-b3`), `a3-m05v1` (m05 previo al quiebre, clip `a3-a5`), `a3-m14v1` (m14 con polvo asentado, clip `a3-c0`), `a3-m15v1` (m15 encuadre hacia m08, clip `a3-a5y`). **Exenciones (no se varían):** keyframe compartido de cadena FLF (`a3-m14` en a5x→a5b, `a3-m07` en c0→c1) y eco deliberado (`a3-m09` en `a3-c3e`). **Dependencies:** Stage 4 (Uniformidad de universo) aprobado **y animatic borrador aprobado** (Stage 7, pasada `--borrador`): las variaciones heredan uniformidad vía `ref` a canónicos ya promovidos; son imágenes pagas, así que se generan **solo para los slots que sobrevivieron** al borrador de ritmo/orden — un slot recortado o eliminado no paga su variación (ver [pipeline.md](../../../metodo/pipeline.md) §2 paso 4). **Gate:** el animatic final (Stage 7) se corre con las variaciones y suma el criterio de unicidad; cambiar una variación invalida su aprobación. **Exit:** fichas de variación en `planos/arco-3.md` §1, `firstFrame` de los clips re-apuntados, `npm run gen -- --arco 3` sin warnings de unicidad.

### Stage 6 — Madres keyframes (gate previo al animatic)
**Método:** instancia del paso 5 del pipeline ([../../../metodo/pipeline.md](../../../metodo/pipeline.md) §2). **Goal:** cada par emparejado (mismo encuadre exacto, solo cambia el estado) y cada cadena de eslabones FLF (keyframe compartido) del arco aprobado **junto** por dirección — sobre las instancias ya únicas del Stage 5 (Madres variations), no sobre las madres base. Solo aplica a escenas de 2 o N keyframes; las de 1 keyframe no pasan por esta capa. **Scope (pares FLF del Arco 3):** `a3-m05v1`→`a3-m06` (`a3-a5`), `a3-m06`→`a3-m14` (`a3-a5x`), `a3-m15v1`→`a3-m08` (`a3-a5y`), `a3-m14v1`→`a3-m07` (`a3-c0`), `a3-m09`→`a3-m17` (`a3-b4`), `a3-m10'`→`a3-m11` (`a3-c2`) — el artefacto de esta capa es la tabla §Cadena de transiciones de [planos/arco-3.md](planos/arco-3.md). Hoy ninguna escena supera 2 keyframes (no hay cadenas N>2 con madres intermedias `a3-mNNa`). Sin tooling nuevo: es aprobación de dirección sobre fichas que ya existen. **Dependencies:** Stage 5 (Madres variations) aprobado. **Gate:** no se avanza al animatic (Stage 7) sin los pares/cadenas aprobados juntos; cambiar la cantidad de keyframes de una escena reabre este gate y además invalida el animatic. **Exit:** cada par/cadena de la tabla §Cadena de transiciones aprobado junto.

### Stage 7 — Animatic (gate previo a video/audio)
**Goal:** un animatic 9:16 que valide ritmo, orden narrativo, subtítulos y convergencia texto/duración con imágenes fijas, **antes** de gastar en video (el mayor costo). **Scope:** dos modos de `npm run animatic` (puro ffmpeg local, no usa wind-comic ni APIs):
- `--reel la-grieta` → **animatic transversal**: intercala los clips de la `cutlist` del front-matter de [reels/la-grieta/README.md](reels/la-grieta/README.md) con sus duraciones recortadas, cruzando arcos. Es el gate principal (lo que se publica es el reel). Los clips de arcos aún sin planos (`a1-*`/`a2-*`) se omiten con aviso. Con `--uniformes`, prefiere `_madres-uniformes/` al resolver madres (aprobar el gate de universo en contexto).
- `--arco N` → **animatic del hilo**: todas las fichas de `planos/arco-N.md` en orden; sirve para aprobar la fuente y las destacadas de ese arco.

**Cadena causal texto → audio → duración:** con `--off` (Edge TTS, gratis), la duración de cada escena la determina su locución (`max(presupuesto, durOff + respiro)`). El `duration` de la ficha / `dur` de la cutlist es presupuesto/piso. Si el audio excede, el CLI lista el exceso: refinar texto en `planos/arco-N-off.md` (o subir `duration` al valor permitido por el motor). Criterio de salida: **0 excesos** — llegada la animación, el tiempo ya fue fijado por el texto.

**Dos pasadas (una sola aprobación como gate):**
- **Borrador** (`npm run animatic -- --reel la-grieta --borrador [--off]`): pasada previa a pagar las variaciones (Stage 5). Las variaciones aún no generadas degradan a su madre base (el CLI las lista) y **no** se valida unicidad — las repeticiones son esperadas. Aprueba **ritmo/orden/subtítulos/convergencia texto-duración** antes de gastar; recién con el borrador aprobado se generan las variaciones de los slots sobrevivientes.
- **Final** (sin `--borrador`): pasada con las variaciones reales y el plan de keyframes integrado. Es el **gate** que suma el criterio de unicidad + **0 excesos de off** y habilita los clips.
El borrador es una corrida gratuita de encuadre, no un gate nuevo.

Los `video-flf` se muestran como first→last (dos mitades de `dur/2`) para representar la transformación; las cadenas de keyframes (§2 paso 5 del pipeline) aparecen como todos sus keyframes en secuencia. Madres aún sin generar se omiten con aviso, así el animatic sirve también en pleno refinamiento. **Dependencies:** Stage 2 (Cadena narrativa), Stage 5 (Madres variations) y Stage 6 (Madres keyframes) aprobados (la cadena narrativa gobierna la cutlist que alimenta el animatic; las variaciones garantizan la unicidad que este gate valida; el plan de keyframes ya viene aprobado del Stage 6). **Gate:** no se avanza a Stage 8 (Clips) sin el animatic transversal aprobado. **Re-aprobación:** el animatic integra en secuencia real el plan de keyframes ya aprobado en el Stage 6 (deja de ser el primer lugar donde se valida); cualquier cambio en la cantidad de keyframes de una escena —o en una variación de madre (Stage 5)— invalida la aprobación anterior — hay que re-correr y re-aprobar el animatic antes de generar los clips. Este gate valida además que **ninguna imagen se repita** en la pieza salvo las exenciones (keyframe compartido de cadena y eco deliberado). **Exit:** animatic aprobado en [reels/la-grieta/](reels/la-grieta/) con 0 excesos de off.

### Stage 8 — Clips
**Goal:** clips que el reel aprobado necesita, generados y aprobados. **Scope (ordenado por el reel):** regen `a3-a4` (huevo) y `a3-c1` (push-in m07); generar `a3-c3`; re-auditar `b1`–`c2` (mp4 pre-rediseño en disco); bajar madres+clips de A1 (`a1-a1`) y A2 (`a2-a1`). **Diferido a Stage 10 (destacadas):** puentes FLF `a5x`/`a5y`/`c0` y regen FLF de `a3-a5` — el reel de 30–45s los cubre con corte duro (auditoría §D). **Dependencies:** Stage 7 (Animatic) aprobado. **Exit:** clips con criterio de la etapa Clips (morph real en FLF donde aplique: b4, c2).

### Stage 9 — Montaje del reel transversal
**Goal:** reel transversal ([reels/la-grieta/](reels/la-grieta/)) montado a partir de los bloques (inserts: m-mano en a5, eco m09 tras c3, foto real en c4). **Dependencies:** Stage 8 (Clips). **Exit:** continuidad de tinte, audio off, 9:16.

### Stage 10 — Destacadas del arco
**Goal:** destacadas S1–S5 por recorte, cero generación (carpetas `destacadas/arco-3/` se crean al montar la primera). **Dependencies:** Stage 9 (Montaje).

## 6. Open Questions

- [ ] Validar que el gateway qingyuntop soporte el morph primer→último frame en cada eslabón FLF.
- [ ] a3-a4 obsoleto (era cría): regenerar U2V sobre m04 huevo.

---

_Aprobado. Siguiente: producción por stages, seguimiento en [PROGRESS.md](PROGRESS.md)._
