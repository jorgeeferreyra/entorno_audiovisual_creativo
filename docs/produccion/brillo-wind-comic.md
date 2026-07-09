# Brillo — grado de aprovechamiento de wind-comic

> Cuánto de lo que wind-comic puede hacer se está usando realmente en la producción. Define el concepto y cómo se mide; **no** contiene la medición vigente (eso se completa y actualiza en otro chat/documento).
> Alcance completo de la herramienta contra el que se mide: [toolkit-wind-comic.md](toolkit-wind-comic.md). Flujo recomendado actual: [pipeline-wind-comic.md](pipeline-wind-comic.md).

---

## 1. Definición

**Brillo** = grado de utilización del alcance de wind-comic en la producción del proyecto.

Dos escalas posibles, no confundir:

| Escala | Contra qué mide | Uso |
|---|---|---|
| **Brillo total** | Todo el alcance de la herramienta (absolutamente todo lo listado en [toolkit-wind-comic.md](toolkit-wind-comic.md), incluyendo lo que nunca vamos a necesitar) | Referencia informativa; siempre va a ser bajo y no es el número operativo |
| **Brillo aplicable** | El alcance **útil para este proyecto**, descontando lo excluido por diseño (sección 2) | **La escala operativa, 0–100.** Es la que se usa cuando se habla de "subir el brillo" |

Cuando se pide "subir el brillo" sin más contexto, se refiere siempre al brillo aplicable, y significa: meter más capacidades de wind-comic ya disponibles y no usadas (los "chiches": juegos de cámara, efectos de post, audio generado, etc.) dentro de lo que el proyecto puede aprovechar.

---

## 2. Exclusiones por diseño

Estas capacidades del toolkit **no cuentan** para el máximo de brillo aplicable: usarlas no correspondería al tipo de pieza que estamos produciendo, así que su no-uso no es una carencia.

| Capacidad excluida | Motivo |
|---|---|
| **Ad Factory** | El proyecto no es publicidad; no hay brief comercial ni CTA de venta |
| **Lipsync** (pipeline de render + panel de viseme) | Ningún personaje habla a cámara: la voz es off documental, nunca sincronizada a boca |
| **Distribución a plataformas chinas** (Douyin, Kuaishou, Shipinhao) y su copy | El proyecto publica en plataformas occidentales (redes propias) |
| **Colaboración en tiempo real** (Yjs, comentarios, roles) | Producción de una sola persona, sin equipo concurrente |
| **Novela → temporada** (Story Intake, Series) | No hay una novela fuente ni una temporada episódica que dividir |
| **Cameo IP marketplace** | No hay intención de licenciar personajes a terceros |

Si el proyecto cambia de forma (por ejemplo, se suma un editor más o se arma una campaña publicitaria), estas exclusiones se revisan; no son permanentes por naturaleza, sino por el alcance actual del proyecto.

---

## 3. Método de medición: 10 áreas × 10 puntos = 100

El brillo aplicable se mide sumando el aprovechamiento de 10 áreas del toolkit, cada una vale 10 puntos sobre 100. El puntaje de cada área sube con el número y variedad de capacidades de esa área que están efectivamente en uso en la producción (no planeadas, no documentadas: usadas).

| Área | Qué suma puntos hacia el máximo | Sección del toolkit |
|---|---|---|
| **Imagen** | Uso de Style Bible, Character DNA, lock de personaje (cref/sref), Vision-Audit, Character Studio cargado | Toolkit §2 |
| **Video** | Variedad de modos (I2V/T2V/FLF/S2V/multi-ref), motores usados según el plano (no solo el default barato) | Toolkit §3 |
| **Cámara** | Cantidad de los 12 presets operativos efectivamente usados, más ShotSpec (景别/ángulo/lente/iluminación) cuando aplica | Toolkit §4 |
| **Guion y auditoría** | Uso de Polish Pro, pacing audit, hook audit, short-video planner para piezas cortas | Toolkit §1 |
| **Voz y audio** | BGM generada, beat detection, SFX de impacto, clonación de voz, ducking/masterizado LUFS | Toolkit §5 |
| **Montaje** | Uso del timeline multipista, smart editing (beat snap, transiciones automáticas, énfasis de tomas clave) en vez de montaje externo | Toolkit §6 |
| **Subtítulos y cards** | Presets de subtítulo, karaoke, safe zones por plataforma, end cards / hook cards por ffmpeg | Toolkit §7 |
| **Continuidad** | Seed lock, link mode, last-frame chaining, continuity sheet | Toolkit §4 (Continuity/seed lock) |
| **Export y distribución** | Paquetes por plataforma (occidentales), copy generado, exports profesionales si hiciera falta | Toolkit §8 |
| **Gestión** | Biblioteca de assets con búsqueda por similitud, cost/budget tracking dentro de la app | Toolkit §10 |

El puntaje exacto de cada área (0–10) y su justificación se completan en el documento/chat de medición vigente, no acá.

---

## 4. El dial: niveles de "subir el brillo"

Cuando se pide subir el brillo, se avanza por estos niveles, ordenados de menor a mayor invasividad sobre el flujo y el presupuesto actuales. Cada nivel es acumulativo (no reemplaza al anterior).

| Nivel | Foco | Chiches concretos | Área(s) que impacta |
|---|---|---|---|
| **1** | Cámara | Usar los presets dormidos (`orbit`, `dolly-zoom`, `whip-pan`, `crash-zoom`, `handheld`, `crane-up`, `tilt-down`, `arc`) donde el estilo lo tolera, especialmente en quiebres de realidad | Cámara |
| **2** | Post dentro de wind-comic | Presets de subtítulo (`social`, `karaoke`), end cards / hook cards por ffmpeg, transiciones xfade y beat snap en vez de montaje externo a ojo | Montaje, Subtítulos y cards |
| **3** | Audio | BGM generada multi-acto, SFX de impacto sintético, clonación de voz propia para iterar el off sin regrabar, ducking/masterizado | Voz y audio |
| **4** | Consistencia pro | Character Studio cargado, seed lock, last-frame chaining, Vision-Audit sistemático contra criterios de aprobación | Imagen, Continuidad |
| **5** | Guion | Polish Pro sobre el off documental, hook audit de los primeros 3s de cada reel | Guion y auditoría |
| **6** | Pipeline completo | Usar los 9 agentes con `MOCK_ENGINES=1` como animatic/borrador de arcos futuros antes de generar en real | Guion y auditoría, Gestión |

---

## 5. Guardas

- **Brillo bajo no siempre es carencia.** Voz off grabada propia (no clonada), montaje por corte (no continuo), y la estrategia "un personaje por clip" son decisiones deliberadas de control autoral y presupuesto, no capacidades desaprovechadas por omisión.
- **El estilo pone un techo, no todo el margen es libre.** El teatro de sombras (siluetas planas estilo Lotte Reiniger) tensiona con juegos de cámara agresivos; su lugar natural son los quiebres de realidad, que ya son fotorrealistas y toleran cámara en mano, crash-zoom, etc. Subir brillo en cámara dentro del registro silueta debe respetar esa restricción estética.

---

## 6. Medición vigente

*(Pendiente. La medición del estado actual del proyecto contra este método —puntaje por área y total— se completa en otro documento/chat, no en este archivo de definición.)*
