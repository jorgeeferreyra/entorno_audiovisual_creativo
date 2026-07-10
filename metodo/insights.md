# Insights — aprendizajes destilados de la producción

> Log acumulativo y **transversal** de lo que el proceso fue dejando: reglas duras, trampas y decisiones que valen para cualquier proyecto/episodio. Cada BUILD de un episodio destila acá lo aprendido (desde su `PROGRESS.md`), para que el próximo arranque sabiéndolo.
>
> Formato por entrada: qué se aprendió · por qué · dónde vive el mecanismo. Ordenado por tema, no cronológico.

---

## Autoría y specs

- **Una sola fuente de "qué se genera", editable y a prueba de errores.** Cada asset se declara en una ficha con un bloque `yaml` autocontenido + su prompt; nada de datos desparramados (prompt en un lado, provider en una nota, default en el script). El markdown sigue siendo la autoría (no se migra a JSON a mano: incómodo para prompts largos y sería doble fuente de verdad). Mecanismo: `engine/wind-mcp/src/lib/specs.ts`.
- **Fallar ruidoso, nunca en silencio.** El parser viejo (regex por campo) hacía desaparecer assets ante cualquier typo: `- Herramienta:U2V` sin espacio borraba un clip sin avisar. El parser nuevo valida con zod y tira el error con el id del asset. Regla general: preferir el error temprano y localizado al descarte silencioso.
- **La última ficha necesita un borde de cierre.** Bug real latente en el sistema viejo: la última ficha, si no la seguía un `---`, se descartaba sin aviso. El parser agrega un delimitador sintético final para capturarla. Cuidado con cualquier parser basado en lookahead de "siguiente sección".
- **El mapa narrativo se aprueba en lenguaje de historia, no de producción.** Gate previo a toda imagen (paso 0 del [pipeline](pipeline.md) §2): una cadena de beats que "se leen solos". Los IDs de clip, las flechas y la jerga de pipeline fueron rechazados en dirección hasta llegar a beats numerados en prosa; los códigos (cutlist) son la implementación posterior, no el objeto de aprobación. Mecanismo: `cadena-narrativa.md` por salida.
- **Zoom-in por cobertura: el mapa beat→clip expone los huecos antes de pagar.** Pregunta por beat: "¿se lee con una sola imagen?"; si no, se expande en sub-beats (zoom-in). Cruzar la cadena aprobada contra la cutlist detecta beats comprimidos en un solo slot (caso real: separación y palanca en la-grieta) *antes* de generar madres. El gate no solo aprueba el orden: audita qué falta producir.

## Procedencia

- **Sidecar `.json` por asset.** Junto a cada archivo generado queda su procedencia: prompt exacto, provider real, refs usadas, costo y fecha. Antes, una vez generado un asset no quedaba registro de cómo se hizo. Mecanismo: `escribirSidecar()` en `engine/wind-mcp/src/lib/motor.ts`.

## Consistencia visual

- **El tinte NO vive en el STYLE-BLOCK.** El STYLE-BLOCK es la identidad fija (silueta, papel envejecido, 9:16); el color de fondo lo agrega cada prompt según el guion de color del beat. Mezclarlos rompe la dosificación narrativa del color.
- **Coherencia entre madres emparejadas = referencia de imagen, no prosa.** La madre hija se genera con la madre padre ya aprobada como `subject_reference` (campo `ref: a{arco}-mNN` en la ficha), no describiendo "el mismo paisaje…": sin una referencia real el modelo reinventa el encuadre en cada corrida. El motor la resuelve solo (data-driven).
- **Multi-ref para anatomía.** Default OpenRouter / Nano Banana con lock (madre) + fotos de anatomía separadas; fallback `--provider minimax` (compone las refs en un slot).

## Generación de video

- **Un personaje por clip; los cruces se resuelven en montaje, no generando juntos.** Es lo más barato, lo más consistente y el lenguaje de cine correcto. La pantalla partida = dos clips independientes apilados.
- **Transformaciones = keyframes madre, no motion prompt.** Cada escena decide cuántas madres pide (taxonomía 1/2/N en [pipeline](pipeline.md) §2 paso 1.75, con gate propio): 1 keyframe si el motor puede improvisar la acción; 2 (par FLF) si hay un estado final que garantizar; N si hay un estado intermedio que garantizar. El límite duro de FLF es 2 keyframes por llamada, pero el caso N no se corta: se arma una **cadena de eslabones FLF con keyframe compartido** (el `lastFrame` de un eslabón es el `firstFrame` del siguiente → unión invisible, no un corte). Regla anti-inflación: N>2 solo cuando el estado intermedio **debe** quedar garantizado (cada keyframe extra suma una madre y cada eslabón un clip; costo marginal no trivial, ver fórmulas en [pipeline](pipeline.md) §3). El plan de keyframes tiene gate propio (paso 1.75: cada par/cadena FLF se aprueba junto, sobre las variaciones, antes del animatic); el animatic lo integra en secuencia real y cualquier cambio de keyframes lo invalida (re-aprobar antes de pagar clips).
- **El video despacha por el registry; ningún motor único es bloqueante.** `generarVideoI2V`/`generarVideoFLF` ([`engine/wind-mcp/src/lib/video.ts`](../engine/wind-mcp/src/lib/video.ts)) rutean todo por `dispatchVideoGenerate` (registry de wind-comic: Strategy + prioridad + health-cache + retry), pasando el provider de la ficha como `prefer`. No hay ningún motor hardcodeado: el registry filtra por capability (I2V vs FLF) y duración, y hace fallback solo. Mismo patrón que ya usaba la imagen (`image.ts`/`motor.ts`). El provider preferido se declara por ficha (`provider:` en el YAML del clip), no en código.
- **FLF degrada al registry, no a un motor fijo.** Si ningún provider cubre FLF (o la cadena FLF entera cae), se re-despacha como I2V (solo primer frame) por el mismo registry, con warning explícito, nunca en silencio. La degradación dejó de estar casada con Minimax.
- **Los frames se resuelven agnósticos del provider.** `resolveFrameUrl()` ([`engine/wind-mcp/src/lib/image.ts`](../engine/wind-mcp/src/lib/image.ts)): URL remota http válida → tal cual; si no → upload a wind-comic (URL http que el gateway acepta en todos los motores, sin key de motor); si el upload falla → data-URI con warning. `MINIMAX_API_KEY` dejó de participar en el plumbing de frames: es un motor más del registry, no un cuello de botella del camino de video.

## Motor y operación

- **Un solo motor, un solo CLI (`npm run gen`).** Reemplaza a los scripts duplicados por tipo/arco (leer → resolver deps → chequear estado → dispatch → guardar → log escrito una sola vez). El tipo de asset se infiere del `kind` de la ficha, no del script.
- **Rutas de frames con una sola fuente de verdad.** `firstFrame: a{arco}-mNN` se resuelve al `dest` de esa madre; renombrar el archivo de una madre no obliga a tocar los clips que la usan.
- **El engine es agnóstico del proyecto (OCP).** El parser es genérico arco-N y el proyecto activo se elige por `--project`/`WIND_PROJECT`. Un episodio nuevo = crear `planos/arco-N.md` con el mismo formato; cero código nuevo.
- **`assets/fuentes/` es de la serie, no del episodio.** El material de origen real se comparte entre episodios; el resolver de lectura busca en el episodio y cae a la serie. Los assets generados (`assets/arco-N/`) son del episodio.
- **Flags de instancia local.** `PLAN_GATE_DISABLED=1` desbloquea funciones sin pago (los gates son de la versión SaaS). `MOCK_ENGINES=1` genera salidas fake sin llamar APIs: útil solo para dry-run de montaje.

## Qué NO hacer (anti-overkill, ya evaluado)

- No migrar la autoría a JSON editable a mano.
- No meter DDD pesado (agregados, repositorios): dominio chico, un solo productor. Solo se toma el vocabulario útil.
- No tocar el registry de providers de wind-comic ni el MCP server: ya están bien diseñados (Strategy + fallback); el motor los hereda gratis.
