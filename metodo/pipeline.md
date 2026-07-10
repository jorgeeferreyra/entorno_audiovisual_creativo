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
    A["1. Imagenes madre (Flux/Minimax)"] --> A2["2. Animatic de madres (imagen fija + subtitulo, gate barato)"]
    A2 --> B["3. Clips 5-6s por personaje aislado"]
    B --> C["4. Montaje: cruces por edicion, no por generacion"]
    C --> D["5. Voz en off (grabada propia o TTS Minimax)"]
    D --> E["6. Export 9:16 + subtitulos"]
```

1. **Imágenes madre primero**: retrato de Charles de espaldas, mano con cadenita, un ornitorrinco por animal, paisajes Pangea. Son la biblia visual; todo parte de acá. Los clips de **transformación/transición** piden un **par de madres** (first/last frame para U2V-FLF), no una sola — regla de coherencia y keyframes en [biblia-visual.md](../proyectos/charles-jones/biblia-visual.md) §3.
2. **Animatic de madres** (gate barato previo a video/audio): antes de generar clips, montar un video donde cada clip aparece como su **imagen madre fija** durante su duración (default 5s) con el **subtítulo (off) quemado**. Da un acercamiento al producto para aprobar ritmo, orden y texto **antes** de gastar en video/audio (el mayor costo). Es puro ffmpeg local (`montarAnimatic()` en [`wind-mcp/src/lib/animatic.ts`](../engine/wind-mcp/src/lib/animatic.ts); CLI `npm run animatic -- --arco N`), no llama APIs. Recién con el animatic aprobado se avanza. Las madres aún sin generar se omiten con aviso, así también sirve durante el refinamiento.
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
| Clip | `a{arco}-{bloque}{n}` | `a3-a1`, `a3-c2` |

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
