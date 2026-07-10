# Charles Jones — estudio de producción spec-driven

Framework para producir contenido audiovisual generado por IA, organizado en tres categorías que no se mezclan:

```
.
├── engine/            HERRAMIENTA — cómo se genera (código, no contenido)
│   ├── wind-comic/    App de generación (BYO keys). Providers de imagen/video/TTS.
│   └── wind-mcp/      Motor: parser de fichas + orquestador + wrapper MCP de wind-comic.
├── metodo/            PRINCIPIOS — la mejor forma de trabajar (transversal a proyectos)
│   ├── pipeline.md            Estrategia de generación, convención de IDs/archivos.
│   ├── toolkit-wind-comic.md  Mapa del alcance completo de wind-comic.
│   ├── brillo.md              Grado de aprovechamiento del toolkit y cómo se mide.
│   ├── inventario-api-keys.md Credenciales del pipeline y en qué orden conseguirlas.
│   └── insights.md            Aprendizajes destilados de la producción (crece con cada proyecto).
└── proyectos/         CONTENIDO — qué se produce
    └── charles-jones/         Una SERIE (canon, biblia visual, personajes, fuentes reales).
        └── episodio-1/        Un EPISODIO: unidad de trabajo spec-driven.
```

## Las tres categorías

- **engine/** — herramienta pura, agnóstica del proyecto. No contiene contenido creativo. Se parametriza por episodio (ver abajo).
- **metodo/** — cómo se trabaja: principios de generación e insights que deja el proceso. Sirve a cualquier proyecto/episodio.
- **proyectos/** — el contenido. Cada carpeta es una **serie**; dentro, cada **episodio** es la unidad que se lleva por el flujo spec-driven.

Nivel **serie** (aplica a todos sus episodios): canon (`biblia-serie.md`), estilo (`biblia-visual.md`), personajes (`personajes-studio.md`) y material de origen real (`assets/fuentes/`).
Nivel **episodio**: guion, arcos de redes, fichas de planos (`planos/arco-N.md`), assets generados (`assets/arco-N/`) y los documentos del flujo (`SPEC.md` / `TECH.md` / `PROGRESS.md`).

## Flujo spec-driven (Spec → Tech → Build)

Cada episodio se produce con gates de documentación (framework agency-os, skill `iteration-roadmap-scaffold`):

1. **SPEC** (qué): canon + arcos + fichas de planos. `planos/arco-N.md` es spec ejecutable.
2. **TECH** (cómo): motores por arco, presupuesto, estrategia de referencias.
3. **BUILD**: cada tanda de generación es una iteración con su criterio de cierre y validación en sala. El `PROGRESS.md` es el session log.

Lo aprendido en cada BUILD se destila hacia `metodo/insights.md`, de modo que el próximo episodio arranca sabiéndolo.

## El engine es agnóstico del proyecto (OCP)

`wind-mcp` no tiene nada hardcodeado del episodio: lee `proyectos/<serie>/<episodio>/planos/arco-N.md` y escribe en `.../assets/arco-N/`. El episodio activo se elige por flag o env:

```bash
cd engine/wind-mcp
npm run gen                                             # episodio por defecto (charles-jones/episodio-1)
npm run gen -- --arco 3                                 # lista los assets del arco 3
npm run gen -- --project charles-jones/episodio-1 --arco 3
WIND_PROJECT=otra-serie/episodio-2 npm run gen -- --arco 1
```

Un episodio nuevo = crear `proyectos/<serie>/<episodio>/planos/arco-N.md` con el mismo formato. Cero código nuevo.

## Git LFS

Este repo usa [Git LFS](https://git-lfs.com/) para videos, imágenes y PDFs (`*.mp4`, `*.mov`, `*.gif`, `*.png`, `*.jpg`, `*.jpeg`, `*.pdf`). Después de clonar, instalar LFS y bajar los binarios:

```bash
git lfs install
git clone <url>
# o, si ya clonaste sin LFS:
git lfs pull
```

## Por dónde empezar

- Entender la serie: [proyectos/charles-jones/biblia-serie.md](proyectos/charles-jones/biblia-serie.md).
- Cómo se produce: [metodo/pipeline.md](metodo/pipeline.md).
- Qué puede la herramienta: [metodo/toolkit-wind-comic.md](metodo/toolkit-wind-comic.md).
- Episodio en curso: [proyectos/charles-jones/episodio-1/](proyectos/charles-jones/episodio-1/).
