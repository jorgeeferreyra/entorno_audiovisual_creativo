# Documentación — Tras las pistas de Charles Jones

Documentación del proyecto de ficción y del contenido para redes derivado del guion. Todo en español, en Markdown.

> `wind-comic/` y `MoneyPrinterTurbo/` son **herramientas** de generación, no forman parte de esta documentación creativa. Fuentes primarias (raíz): `Contexto del Proyecto.pdf`, `guion_episodio_1.pdf` y `prompt_charles_jones.txt` (aspecto/vestuario de CFJ; su referencia visual vive en `assets/fuentes/charles-jones-referencia.jpeg`).

---

## Mapa de la documentación

```
docs/
├── README.md                        <- estás aquí
├── biblia-serie.md                  Canon del universo (fuente de verdad)
├── redes/
│   ├── estrategia-contenido.md      Marco narrativo, formatos, orden de publicación
│   ├── arco-1-mano-negra.md         La Fundación planifica las extinciones
│   ├── arco-2-charles-palanca.md    Charles interviene en puntos mínimos
│   ├── arco-3-ornitorrincos.md      El drama; final en fosilización
│   └── calendario-publicacion.md    Cadencia y secuencia de piezas
└── produccion/
    ├── biblia-visual.md             Anclas de estilo + STYLE-BLOCK + conceptos de imágenes madre
    ├── personajes-studio.md         Fichas Character Studio (ingesta directa en wind-comic)
    ├── pipeline-wind-comic.md       Motores, costos, plantillas de ingesta y convención de IDs/archivos
    ├── toolkit-wind-comic.md        Mapa de alcance completo de wind-comic
    └── arco-3-planos.md             Arco 3 en fichas de ingesta (prompts finales)
```

Los archivos binarios de producción viven fuera de `docs/`, en `assets/` (raíz): `assets/fuentes/` (material de origen real, no generado) y `assets/arco-{N}/` (imágenes madre y clips generados). Convención en [produccion/pipeline-wind-comic.md](produccion/pipeline-wind-comic.md) §5.

---

## Orden de lectura sugerido

1. **[biblia-serie.md](biblia-serie.md)** — entender el canon (personajes, tono, reglas, elementos reutilizables).
2. **[redes/estrategia-contenido.md](redes/estrategia-contenido.md)** — el marco "cuadernos de Charles", los 3 arcos, el orden y las conexiones con el episodio 1.
3. **Los tres arcos** — [1: Mano Negra](redes/arco-1-mano-negra.md) · [2: Charles y la palanca](redes/arco-2-charles-palanca.md) · [3: Ornitorrincos](redes/arco-3-ornitorrincos.md).
4. **[redes/calendario-publicacion.md](redes/calendario-publicacion.md)** — cuándo publicar cada pieza.
5. **Producción** — [biblia-visual.md](produccion/biblia-visual.md) (qué generar primero), [pipeline-wind-comic.md](produccion/pipeline-wind-comic.md) (cómo, a qué costo y con qué plantillas de ingesta) y [personajes-studio.md](produccion/personajes-studio.md) (fichas de personaje para wind-comic).

---

## Idea rectora en una línea

El contenido de redes es **precuela canónica** del episodio 1: la familia de ornitorrincos que se anima ES el fósil que Jorgito encuentra en Rocas Coloradas, y La Fundación que hoy "protege" el yacimiento es la misma mano que partió Pangea.

---

## Estado y próximos pasos

- [x] Canon consolidado, estrategia, 3 arcos (nivel beats macro), calendario, biblia visual y pipeline.
- [x] **Arco 3** bajado a **fichas de ingesta con prompts finales** en [arco-3-planos.md](produccion/arco-3-planos.md).
- [x] Producción reestructurada a **ingesta 1:1 con la UI de wind-comic**: plantillas y convención de IDs/archivos en [pipeline-wind-comic.md](produccion/pipeline-wind-comic.md) §5–6, fichas de personaje en [personajes-studio.md](produccion/personajes-studio.md), material de origen real en `assets/fuentes/`.
- [ ] Bajar los **arcos 1 y 2** a fichas de ingesta (plantillas en [pipeline-wind-comic.md](produccion/pipeline-wind-comic.md) §6).
- [ ] Generar las **imágenes madre** del Arco 3 (`a3-m01`…`a3-m13`) antes de cualquier clip.
- [ ] Producir el bloque del **Arco 3** (primer arco a publicar).
