# Pipeline de producción con wind-comic

> Cómo producir el contenido. Qué producir está en los arcos; la consistencia visual en [biblia-visual.md](../proyectos/charles-jones/biblia-visual.md). El alcance completo de la caja de herramientas (todo lo que wind-comic puede hacer, más allá de este flujo recomendado) está en [toolkit-wind-comic.md](toolkit-wind-comic.md).
> Herramienta: instancia local de `wind-comic` (en `engine/wind-comic`), orquestada por `engine/wind-mcp`. Es BYO (bring your own keys): el costo es de las APIs, no de la app.
> Providers, tarifas unitarias y fórmulas de costo por capa: [providers.md](providers.md).

---

## 1. Estrategia de generación: un personaje por clip

Generar cada personaje/elemento **aislado** y unir en montaje. Es lo más barato, lo más consistente y el lenguaje de cine correcto. Qué lockear y con qué motor depende del tipo de contenido de cada arco: esa tabla (motores por arco) es específica del proyecto y vive en el `TECH.md` de la unidad de trabajo.

Referencia de motores, capacidades y tarifas: [providers.md](providers.md).

---

## 2. Flujo

```mermaid
flowchart TD
    A0["0. Cadena narrativa (mapa de beats, gate gratis)"] --> A["1. Imagenes madre (Flux/Minimax)"]
    A --> A1["1.5 Madres variations (unicidad por escena, ref + Nano Banana)"]
    A1 --> A2["2. Animatic de madres variadas (imagen fija + subtitulo, gate barato)"]
    A2 --> B["3. Clips 5-6s por personaje aislado"]
    B --> C["4. Montaje: cruces por edicion, no por generacion"]
    C --> D["5. Voz en off (grabada propia o TTS Minimax)"]
    D --> E["6. Export 9:16 + subtitulos"]
```

0. **Cadena narrativa** (gate gratis, previo a toda imagen): aprobar el **mapa de beats** de la pieza **en lenguaje de historia** (sin IDs ni jerga de producción), antes de generar la primera madre. Distinto del animatic: la cadena valida **historia y cobertura** a costo cero; el animatic (paso 2) valida **ritmo/orden/subtítulos** con madres ya generadas — dos gates secuenciales. Mecanismo: un doc `cadena-narrativa.md` junto a la salida que gobierna (ej. `reels/<slug>/`), con front-matter `estado: aprobado` y un **mapa beat→clip** contra la cutlist que expone huecos de cobertura antes de pagar. Ejemplo vivo: [reels/la-grieta/cadena-narrativa.md](../proyectos/charles-jones/redes/reels/la-grieta/cadena-narrativa.md).
1. **Imágenes madre primero**: retrato de Charles de espaldas, mano con cadenita, un ornitorrinco por animal, paisajes Pangea. Son la biblia visual; todo parte de acá. **Cuántas madres pide cada escena (keyframes)** se decide acá, antes de generar:
   - **1 keyframe (U2V/I2V)** — acción continua simple que el motor puede improvisar sin riesgo desde un solo frame (ritual, drift, push-in). Criterio: *¿el motor puede improvisar la acción sin arruinarla?*
   - **2 keyframes (U2V-FLF)** — cambio de estado con inicio y fin claros; el motor interpola entre dos madres aprobadas en vez de confiar el estado final al motion prompt. Criterio: *¿hay un estado final que garantizar?* Ambas madres emparejadas: mismo encuadre, solo cambia el estado.
   - **N keyframes (cadena de eslabones FLF)** — la transformación pasa por un estado intermedio que hay que garantizar (precisión de una acción, o una transición que salta feo si el motor interpola directo). Criterio: *¿hay un estado intermedio que garantizar?* Se resuelve como **cadena**: N keyframes → N−1 eslabones FLF de 5s donde el `lastFrame` de un eslabón **es** el `firstFrame` del siguiente (keyframe compartido → unión invisible, no un corte). Esquiva el límite duro de FLF (2 keyframes por llamada) sin perder continuidad. Las madres intermedias se generan por continuidad (`ref:` sobre la madre base + motor multi-ref tipo Nano Banana, ver §5 y [biblia-visual.md](../proyectos/charles-jones/biblia-visual.md) §3).

   **Anti-inflación de costo:** cada keyframe intermedio suma ~¥0.9 (madre con 3 candidatos) y cada eslabón FLF extra ~¥1 (5s Kling). Pasar de 2 a 3 keyframes cuesta ~¥2 — barato como seguro contra un morph que salta feo, caro por default. N>2 solo cuando hay un estado intermedio que **debe** quedar garantizado.
1.5. **Madres variations** (unicidad por escena, previo a keyframes y animatic): al generar la primera tanda de madres se fija la estética (diseño, color, alto nivel); pero varias escenas terminan reutilizando la misma madre como `firstFrame`, y el espectador nota la imagen repetida. Este gate genera **una instancia única por escena** derivando de la madre base para que toda la experiencia visual sea irrepetible. **Regla: toda reutilización en pantalla dispara variación** — la **primera aparición** de una madre puede usar la base; cada aparición siguiente usa una variación. **Mecanismo:** una variación es la madre base como **referencia de imagen** (`ref:` + motor multi-ref tipo Nano Banana, `provider: openrouter`) con un prompt que hereda el STYLE-BLOCK y describe solo el **delta** (pose, encuadre, estado, tinte del beat destino) — mismo patrón que la coherencia entre madres (§5 y [biblia-visual.md](../proyectos/charles-jones/biblia-visual.md) §3 regla 6). Va **antes** del plan de keyframes: los pares/cadenas FLF se arman sobre las instancias ya únicas, no sobre la madre canónica. **Exenciones** (la repetición del frame es el mecanismo, no un descuido): (a) el **keyframe compartido** entre eslabones FLF adyacentes — el `lastFrame` de un eslabón *es* el `firstFrame` del siguiente, variarlo rompe la unión invisible de la cadena; (b) el **eco deliberado** — repetir una madre como flashback/puente emocional intencional. **Impacto en prompts:** cada variación tiene su propia ficha (id, `ref:`, delta) y las fichas de clip que reutilizaban la madre pasan a citar su variación.
2. **Animatic de madres variadas** (gate barato previo a video/audio): antes de generar clips, montar un video donde cada clip aparece como su **imagen madre fija** durante su duración (default 5s) con el **subtítulo (off) quemado**. Da un acercamiento al producto para aprobar ritmo, orden y texto **antes** de gastar en video/audio (el mayor costo). Es puro ffmpeg local (`montarAnimatic()` en [`wind-mcp/src/lib/animatic.ts`](../engine/wind-mcp/src/lib/animatic.ts); CLI `npm run animatic -- --arco N`), no llama APIs. Recién con el animatic aprobado se avanza. Las madres aún sin generar se omiten con aviso, así también sirve durante el refinamiento. **El animatic también valida el plan de keyframes** (paso 1): una cadena aparece como todos sus keyframes en secuencia con sus duraciones reales, así se ve si la acción/transición lee bien pasando por el estado intermedio. Por eso, **cualquier cambio en la cantidad de keyframes de una escena invalida la aprobación anterior del animatic**: hay que re-correrlo y re-aprobarlo antes de pagar los clips. **El animatic también es el gate de la capa de variaciones** (paso 1.5): se corre con las madres variadas y suma el criterio **ninguna imagen repetida no exenta**; cambiar una variación invalida la aprobación anterior (misma lógica que los keyframes).
3. **Clips de 5–6s por personaje aislado**: la duración barata. En la instancia local con `PLAN_GATE_DISABLED=1` no aplican los gates de plan de pago.
4. **Montaje de salidas**: los cruces (mano ↔ ornitorrincos, Charles ↔ familia) se resuelven por **corte**, no generando personajes juntos. Los clips generados son **fuente por hilo** (bloques del arco); de ahí se montan las dos familias de salida: **reels transversales** (intercalan clips de varios hilos) y **destacadas por arco** (recorte de un solo hilo). La pantalla partida Argentina/Australia del Arco 3 = dos clips independientes montados. El montaje se hace con `wind-mcp` (`montarSecuencia()` en [`wind-mcp/src/lib/montaje.ts`](../engine/wind-mcp/src/lib/montaje.ts): concat ffmpeg + pad 9:16 + off opcional), **no** con el timeline de wind-comic (que opera sobre proyectos del pipeline de 9 agentes, no sobre clips U2V sueltos — usarlo sería overkill).
5. **Voz**: off documental (Attenborough). Recomendado grabarla propia (es la voz del proyecto y es gratis); alternativas: TTS Minimax o **clonar la voz propia** vía `POST /api/voice-clone` (MiniMax, ya configurado) — misma decisión de "voz del proyecto", pero permite iterar el off sin regrabar.
6. **Export**: 9:16, subtítulos quemados si corresponde.

---

## 3. Presupuesto

El presupuesto es específico de cada proyecto (cantidad de clips/madres, motor elegido) y vive en el `TECH.md` de la unidad. Las tarifas unitarias y las fórmulas de costo por capa (madre, clip, TTS, animatic) están en [providers.md](providers.md). Principio transversal: el **video es el mayor costo**; reservar los motores caros (Kling, Veo) para los planos-gancho y usar Minimax para el resto.

---

## 4. Notas de configuración (instancia local)

- **`PLAN_GATE_DISABLED=1`** en `.env.local` desbloquea todas las funciones sin pago a la app (los gates son de la versión SaaS).
- **`MOCK_ENGINES=0`** (default en `.env.local`) usa motores reales. `MOCK_ENGINES=1` genera salidas fake sin llamar APIs: útil solo para dry-run de montaje.
- Keys reales necesarias según motor: `MINIMAX_API_KEY` (imagen+video+TTS), `KELING_API_KEY` (Kling), etc. Inventario priorizado con links y estado actual: [providers.md](providers.md) §4. Variables completas: `wind-comic/.env.example`.

---

## 5. Convención de IDs y archivos de assets

IDs con prefijo de arco, en minúsculas:

| Unidad | Formato de ID | Ejemplo |
|---|---|---|
| Imagen madre | `a{arco}-m{nn}` | `a3-m01` |
| Madre intermedia (keyframe de cadena) | `a{arco}-m{nn}{letra}` | `a3-m10a` |
| Variación de madre (unicidad por escena) | `a{arco}-m{nn}v{k}` | `a3-m01v1` |
| Clip | `a{arco}-{bloque}{n}` | `a3-a1`, `a3-c2` |

La **madre intermedia** de una cadena de keyframes (§2 paso 1) usa el sufijo de letra sobre la madre base (`a3-m10` → `a3-m10a`, `a3-m10b`): declara su linaje sin renumerar la serie. La **variación de madre** (§2 paso 1.5) usa el sufijo `v{k}` sobre la madre base (`a3-m01` → `a3-m01v1`, `a3-m01v2`): declara el linaje sin colisionar con el sufijo de letra de las intermedias.

Archivos (rutas relativas al proyecto; el engine las resuelve contra la unidad activa, con fallback a la serie para `fuentes`):

- **Generados** (nivel unidad): `assets/arco-{N}/madre/{id}-{slug}.png` y `assets/arco-{N}/clips/{id}-{slug}.mp4`. Ej.: `assets/arco-3/madre/a3-m01-madre-ornitorrinco.png`.
- **Material de origen real** (no generado, aportado a mano; nivel serie, reutilizable entre unidades): `assets/fuentes/{slug}.{ext}`. Ej.: `assets/fuentes/rocas-coloradas-real.jpg`, `assets/fuentes/charles-jones-referencia.jpeg`.

El nombre de archivo es la referencia única: es lo que se sube como `firstFrame`/`lastFrame` en la UI y lo que citan las fichas de clip.

---

## 6. Plantillas de ingesta (campos 1:1 con la UI de wind-comic)

Campos exactos que consume cada página (verificados en [toolkit-wind-comic.md](toolkit-wind-comic.md)). Prompts e inputs de modelo **en inglés**; títulos, audio y montaje en español.

**Regla de cámara:** los 12 presets operativos de `/dashboard/u2v` y `/dashboard/create` (`push-in`, `pull-out`, `orbit`, `dolly-zoom`, `whip-pan`, `crash-zoom`, `handheld`, `locked-tripod`, `crane-up`, `tilt-down`, `tracking`, `arc`) van SIEMPRE en el campo `cameraPreset`, nunca duplicados en el texto del prompt. Si el movimiento no tiene preset equivalente (ej. "gentle aerial drift"), se describe en el prompt y el preset queda vacío. Si el prompt no trae ningún término de cámara y no se elige preset, el motor agrega por defecto un push-in sutil.

**Aspect ratio:** U2V no tiene campo de aspect; el clip hereda el de la imagen fuente. Por eso toda imagen madre se genera en 9:16.

### Personaje → Character Studio (`/dashboard/characters`)

```
Personaje: [nombre ES]
- name: [nombre]
- description (EN): [quién es, rol narrativo]
- appearance (EN): [aspecto físico + vestuario, autocontenido]
- styleKeywords (EN): [estilo visual, ej. "paper cutout silhouette, shadow puppet theater"]
- visualTags (EN): [tag1, tag2, ...]
- imageUrls: [archivo(s) de assets/; se sube la imagen y se pega la URL resultante]
- Voz: routing [género/nombre] · override: [voz elegida o —]
```

### Imagen madre / locación → generación o preview-shot (`/dashboard/create`)

```
[id] — [título ES]
- idea / prompt (EN): [con el STYLE-BLOCK de biblia-visual.md §1 embebido literal + la línea de tinte del guion de color del arco]
- style: Woodcut Print   (preset más cercano al look silueta; u otro si rompe la estética a propósito)
- aspect: 9:16
- Ref: [id de la madre padre a usar como referencia de imagen | —] (coherencia entre madres, biblia-visual.md §3)
- Archivo destino: assets/arco-N/madre/[id]-[slug].png
```

### Clip → U2V / U2V-FLF (`/dashboard/u2v`)

```
Clip [id] — [título ES]
- Herramienta: U2V | U2V-FLF
- firstFrame: [id de imagen madre] (archivo)
- lastFrame: [solo FLF: id + archivo]
- cameraPreset: [1 de los 12 | —]
- duration: 5 | 6 | 10 | 15   (FLF: solo 5 | 10)
- Motion prompt (EN, ≤500 caracteres, sin lenguaje de cámara duplicado): [...]
- Vision-Audit (EN): sceneDescription: [...] · action: [...] · mood: [...]
- Audio (ES): [off / música / ninguno]
- Montaje (ES): [con qué se corta antes/después]
```
