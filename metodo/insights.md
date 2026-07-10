# Insights — aprendizajes destilados de la producción

> Log acumulativo y **transversal** de lo que el proceso fue dejando: reglas duras, trampas y decisiones que valen para cualquier proyecto/episodio. Cada BUILD de un episodio destila acá lo aprendido (desde su `PROGRESS.md`), para que el próximo arranque sabiéndolo.
>
> Formato por entrada: qué se aprendió · por qué · dónde vive el mecanismo. Ordenado por tema, no cronológico.

---

## Autoría y specs

- **Una sola fuente de "qué se genera", editable y a prueba de errores.** Cada asset se declara en una ficha con un bloque `yaml` autocontenido + su prompt; nada de datos desparramados (prompt en un lado, provider en una nota, default en el script). El markdown sigue siendo la autoría (no se migra a JSON a mano: incómodo para prompts largos y sería doble fuente de verdad). Mecanismo: `engine/wind-mcp/src/lib/specs.ts`.
- **Fallar ruidoso, nunca en silencio.** El parser viejo (regex por campo) hacía desaparecer assets ante cualquier typo: `- Herramienta:U2V` sin espacio borraba un clip sin avisar. El parser nuevo valida con zod y tira el error con el id del asset. Regla general: preferir el error temprano y localizado al descarte silencioso.
- **La última ficha necesita un borde de cierre.** Bug real latente en el sistema viejo: la última ficha, si no la seguía un `---`, se descartaba sin aviso. El parser agrega un delimitador sintético final para capturarla. Cuidado con cualquier parser basado en lookahead de "siguiente sección".

## Procedencia

- **Sidecar `.json` por asset.** Junto a cada archivo generado queda su procedencia: prompt exacto, provider real, refs usadas, costo y fecha. Antes, una vez generado un asset no quedaba registro de cómo se hizo. Mecanismo: `escribirSidecar()` en `engine/wind-mcp/src/lib/motor.ts`.

## Consistencia visual

- **El tinte NO vive en el STYLE-BLOCK.** El STYLE-BLOCK es la identidad fija (silueta, papel envejecido, 9:16); el color de fondo lo agrega cada prompt según el guion de color del beat. Mezclarlos rompe la dosificación narrativa del color.
- **Coherencia entre madres emparejadas = referencia de imagen, no prosa.** La madre hija se genera con la madre padre ya aprobada como `subject_reference` (campo `ref: a{arco}-mNN` en la ficha), no describiendo "el mismo paisaje…": sin una referencia real el modelo reinventa el encuadre en cada corrida. El motor la resuelve solo (data-driven).
- **Multi-ref para anatomía.** Default OpenRouter / Nano Banana con lock (madre) + fotos de anatomía separadas; fallback `--provider minimax` (compone las refs en un slot).

## Generación de video

- **Un personaje por clip; los cruces se resuelven en montaje, no generando juntos.** Es lo más barato, lo más consistente y el lenguaje de cine correcto. La pantalla partida = dos clips independientes apilados.
- **Transformaciones = par de keyframes (FLF), no motion prompt.** Para transición/transformación, generar DOS madres (estado inicial y final, ambas aprobadas) y usar U2V-FLF: el motor interpola entre keyframes aprobados. Límite duro de FLF: solo 2 keyframes y 5 o 10s; si un plano necesita más estados, se parte en sub-clips unidos por corte.
- **Kling FLF con fallback automático.** Si Kling falla o no está disponible, se degrada a Minimax I2V (solo primer frame) con warning explícito, nunca en silencio. Mecanismo: `generateFlfViaKling()` en `engine/wind-mcp/src/lib/video.ts`.
- **En modo real, los frames se suben a Minimax siempre.** `resolveFrameUrlForVideo()` sube el frame a Minimax incluso cuando el clip lo genera Kling, así que `MINIMAX_API_KEY` bloquea todo el camino de video, no solo el motor Minimax.

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
