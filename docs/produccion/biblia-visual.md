# Biblia visual — Imágenes madre y anclas de estilo

> Fuente de consistencia visual. Las imágenes madre se generan PRIMERO y son referencia/primer frame de todos los clips posteriores. Flujo técnico en [pipeline-wind-comic.md](pipeline-wind-comic.md). Canon en [../biblia-serie.md](../biblia-serie.md).

---

## 1. Anclas de estilo (aplican a TODO el contenido)

| Ancla | Valor | Motivo |
|---|---|---|
| **Formato** | 9:16 vertical | Stories/reels/feed móvil |
| **Registro visual** | "Cuaderno reconstruido de Charles": textura de papel, tinta, ilustración con movimiento | Justifica la estética IA (canon: diarios caóticos) |
| **Paleta base** | Tierras rojas/naranjas (rocas coloradas), verdes prehistóricos, sepia de cuaderno | Une Pangea con la locación real del Ep.1 |
| **Época** | Mesozoico/paleógeno estilizado, no fotorrealista estricto | Tolera inconsistencias, refuerza tono |
| **Anacronismos** | Permitidos y buscados (mandarina, reloj, cadenita) | Canon |
| **Rostro de CFJ** | NUNCA de frente | Regla dura del canon |

---

## 2. Imágenes madre por arco

> Prompts base para pegar/adaptar en wind-comic. Generar cada una, elegir la mejor, y reutilizarla como referencia o primer frame.

### Transversales
- **Paisaje Pangea**: "supercontinente Pangea visto desde una colina, cielo prehistórico, vegetación exuberante, estilo ilustración de cuaderno de explorador, textura de papel, 9:16".
- **Rocas Coloradas**: "formaciones de roca rojiza tipo marciano, lagunas naranjas, Patagonia, estilo documental ilustrado, 9:16".
- **Página de cuaderno**: "página de diario antiguo con anotaciones manuscritas, tachones, mapa dibujado a mano, sepia, 9:16".

### Arco 1 — Mano Negra
- **Mano con cadenita**: "primer plano de una mano masculina con una cadenita de oro en la muñeca, sobre un mapa antiguo, iluminación dramática, sombra, 9:16" (varias poses: trazando, firmando, apoyada).
- **Mapa de Pangea con la grieta**: "mapa antiguo de Pangea con una línea de fractura trazada a lapicera, anotaciones, 9:16".
- **Logo de la Fundación**: "emblema de una fundación conservacionista ficticia, aspecto institucional y siniestro, 9:16".

### Arco 2 — Charles y la palanca
- **Charles de espaldas con sombrero**: "silueta de un explorador de espaldas con sombrero tipo Indiana Jones, en un paisaje de Pangea, nunca se ve el rostro, luz de atardecer, 9:16" (varias poses: de pie, meditando, empujando).
- **El tronco con el huevo**: "un tronco flotando con un huevo de ornitorrinco encima, entre dos masas de tierra que se separan, agua en el medio, 9:16".
- **El lugar blanco**: "espacio completamente blanco, un banquito blanco, alguien de espaldas tirando maíz a palomas que no están, onírico, 9:16" (cruce con el Ep.1).

### Arco 3 — Ornitorrincos

> Prompts finales de producción (en inglés, plano a plano) en [arco-3-planos.md](arco-3-planos.md). Acá quedan solo los conceptos base.

- **Familia de ornitorrincos**: generar una imagen madre POR animal (madre, cría, padre) + el huevo, para lockear cada uno como primer frame de sus clips. "ornitorrinco realista pero tierno, estilo documental ilustrado, fondo Pangea, 9:16".
- **Pantalla partida Australia/Argentina**: dos ambientes contrastados (próspero/árido) — se arma en montaje, pero conviene una imagen madre por ambiente.
- **Fosilización**: "un ornitorrinco recostado sobre roca colorada que se transforma en fósil de piedra, transición, 9:16".
- **Fósil real del Ep.1**: usar el plano real del fósil del episodio 1 para el corte final (no se genera; es material de archivo del rodaje).

---

## 3. Regla de reutilización (DRY visual)

1. Una imagen madre por elemento persistente (personaje/objeto/locación).
2. Todo clip parte de su imagen madre como **primer frame** (I2V) o **referencia de sujeto**.
3. Los cruces entre personajes NO se generan juntos: se resuelven en montaje (ver [pipeline](pipeline-wind-comic.md)).
