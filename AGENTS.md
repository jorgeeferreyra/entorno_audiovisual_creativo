# Mapa del repo (índice para agentes)

Estudio spec-driven de producción audiovisual con IA (serie "Charles Jones"). Este archivo es el índice: orienta y apunta a la fuente de verdad de cada cosa. **No explores el repo desde cero; empezá por acá.** Si un cambio estructural lo desactualiza, actualizalo en el mismo PR/commit.

## Tres capas (no se mezclan)

| Capa | Ruta | Qué es |
|---|---|---|
| Engine | `engine/` | Herramienta, agnóstica del contenido |
| Método | `metodo/` | Principios transversales a cualquier proyecto |
| Proyectos | `proyectos/` | Contenido: canon, specs, assets |

## Dónde vive cada verdad

| Tema | Fuente de verdad |
|---|---|
| Canon narrativo (universo, personajes, reglas duras) | `proyectos/charles-jones/biblia-serie.md` |
| Estilo visual (STYLE-BLOCK, paleta, cámara) | `proyectos/charles-jones/biblia-visual.md` |
| Fichas de personaje (Character Studio) | `proyectos/charles-jones/personajes-studio.md` |
| Referencias reales (fotos) | `proyectos/charles-jones/assets/fuentes/` |
| Alcance de la unidad activa (qué producir) | `proyectos/charles-jones/redes/SPEC.md` |
| Decisiones técnicas (motores, stages, gates) | `proyectos/charles-jones/redes/TECH.md` |
| Estado de producción (session log + checklist) | `proyectos/charles-jones/redes/PROGRESS.md` — se actualiza a mano |
| Hilos narrativos por arco (prosa, no ejecutable) | `redes/arco-{1,2,3}-*.md` |
| **Prompts y parámetros de generación (ejecutable)** | `redes/planos/arco-N.md` (fichas YAML + prompt EN) |
| Textos de voz en off | `redes/planos/arco-N-off.md` |
| Gate narrativo del reel | `redes/reels/la-grieta/cadena-narrativa.md` |
| Cutlist del reel (orden y duración) | `redes/reels/la-grieta/README.md` |
| Método de trabajo transversal (flujo, IDs, plantillas) | `metodo/pipeline.md` |
| Aprendizajes destilados | `metodo/insights.md` |
| **Costos** (única fuente de cifras) | `metodo/tarifas.json` + `metodo/providers.md` — ver `.cursor/rules/costos.mdc` |

Unidad de trabajo activa: `proyectos/charles-jones/redes/` (arco 3 en producción, reel `la-grieta`).

## Tooling

Todo el código del pipeline vive en `engine/wind-mcp/` (parser de planos, generación, animatic, montaje, TTS, MCP). `engine/wind-comic/` es la app de providers: debe estar corriendo (`npm run dev`, puerto 3000) para generar en modo real.

Comandos (desde `engine/wind-mcp/`):

```bash
npm run gen -- --arco 3                 # listar assets del arco
npm run gen -- --id a3-m01              # generar un asset (madre o clip)
npm run gen -- --id a3-m03 --candidates 3   # candidatos en _candidates/
npm run gen -- --id a3-m03 --pick 2     # promover candidato (SOLO con confirmación del usuario)
npm run gen -- --reel a | --todas | --force | --provider X
npm run uniformar -- --reel la-grieta   # gate uniformidad capa 1 (grade+crop 9:16) → _madres-uniformes/
npm run uniformar -- --reel la-grieta --propuestas   # propuestas de reencuadre → _audit/aspecto/
npm run animatic -- --arco 3            # animatic de hilo
npm run animatic -- --reel la-grieta [--borrador] [--uniformes] [--off]   # animatic de reel
npm run audio:a3                        # BGM arco 3
```

Detalle de flags y lógica: `engine/wind-mcp/scripts/generar.ts`, `scripts/uniformar.ts`, `scripts/animatic.ts`, `src/lib/`. Unidad activa vía `--project` o `WIND_PROJECT` (default `charles-jones/redes`).

## Convenciones de assets

- IDs: madre `a{arco}-m{nn}` (intermedia `m{nn}{letra}`, variación `m{nn}v{k}`); clip `a{arco}-{bloque}{n}` (ej. `a3-a5`).
- Rutas: madres en `redes/assets/arco-N/madre/{id}-{slug}.png`; clips en `assets/arco-N/clips/{id}-{slug}.mp4`; audio en `assets/arco-N/audio/`; experimentos en `assets/arco-N/test/`.
- `_candidates/` = opciones a elegir; `_candidates/_prev/` = rondas archivadas (nunca pisar ni borrar); `_audit/` = frames de auditoría.
- Sidecars `.json` junto a cada asset: procedencia y costo real, auto-generados, no editar a mano.
- Definición completa de IDs y plantillas: `metodo/pipeline.md` §5.

## Pipeline y gates

Flujo: cadena narrativa → madres (candidatos + pick) → **uniformidad de universo** (capa 1 determinística: grade+crop 9:16; capa 2 generativa diferida) → variations/keyframes FLF → animatic (borrador y final) → clips → montaje → off → export 9:16. Stages y exit criteria: `TECH.md` §5.

Gates de dirección (el usuario confirma, el agente prepara y recomienda): pick de candidatos, cadena narrativa, locks/mapa de uniformidad, pares/cadenas FLF, animatic final. Reglas duras en `.cursor/rules/gates-de-direccion.mdc`.

## Reglas siempre activas

- `.cursor/rules/costos.mdc` — nunca escribir cifras de costo fuera de `metodo/tarifas.json`/`providers.md`.
- `.cursor/rules/gates-de-direccion.mdc` — nunca promover (`--pick`) ni borrar candidatos sin confirmación explícita.
