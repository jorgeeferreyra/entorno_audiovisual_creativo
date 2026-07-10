# Redes (charles-jones) — Especificación de contenido

_Status: Approved_
_Date: 2026-07-09_
_Version: 1.1_

> Adaptación de la plantilla agency-os SPEC al dominio audiovisual. Es el **qué** de las redes de la serie: qué fuente existe (hilos por arco) y qué salidas se montan. El **cómo** (motores, costos, refs) está en [TECH.md](TECH.md); el estado de producción en [PROGRESS.md](PROGRESS.md); el método transversal en [../../../metodo/](../../../metodo/).

---

## 1. Overview

Contenido para redes que funciona como **precuela canónica** del episodio 1 de la serie *Tras las pistas de Charles Jones* (relación de metadata, no jerarquía): la familia de ornitorrincos que se anima ES el fósil que Jorgito encuentra en Rocas Coloradas, y La Fundación que hoy "protege" el yacimiento es la misma mano que partió Pangea. Se produce con estética de teatro de sombras (siluetas recortadas estilo Lotte Reiniger) y off documental.

Modelo: los tres arcos son **fuente por hilo** (guion + planos + clips generados). De esa fuente se montan **dos familias de salida**: reels transversales (cruzan hilos) y destacadas por arco (un solo hilo).

## 2. Goals

- Bajar a fichas ejecutables el **Arco 3 (Ornitorrincos)** como primera fuente (madres + clips a1–c4).
- Montar la primera salida transversal ([reels/la-grieta/](reels/la-grieta/)) a partir de esa fuente.
- Dejar catalogadas las destacadas del Arco 3 (S1–S5) como segunda familia de salida, sin crear carpetas vacías.
- Sostener el canon y la consistencia visual de la serie (STYLE-BLOCK, "CFJ nunca de frente", tinte por beat).
- Mantener la producción barata y reproducible (un personaje por clip, cruces por montaje).

## 3. Audiencia

Espectador de reels/stories verticales (9:16). Consume sin audio garantizado (los hooks y el montaje deben leerse mudos); el off documental suma cuando hay sonido.

## 4. Estructura de la fuente (arcos por hilo)

La serie tiene 3 arcos, cada uno un **hilo narrativo fuente** (no un entregable). Se bajan a fichas en orden 3 → 1 → 2 (el 3 arranca: es el más emocional y cierra en fosilización). Las salidas (§5) se montan cruzando o recortando esa fuente.

| Arco | Qué cuenta | Estado de bajada a fichas |
|---|---|---|
| 1 · La Mano Negra | La Fundación planifica las extinciones a escala geológica | Pendiente ([arco-1-mano-negra.md](arco-1-mano-negra.md)) |
| 2 · Charles y la palanca | CFJ interviene en puntos mínimos de apalancamiento | Pendiente ([arco-2-charles-palanca.md](arco-2-charles-palanca.md)) |
| 3 · Ornitorrincos | El drama familiar; los divididos por la grieta; final en fosilización | **Bajado a fichas ejecutables** ([planos/arco-3.md](planos/arco-3.md)) |

## 5. La spec ejecutable

La bajada de producción del Arco 3 vive como **fichas de ingesta** en [planos/arco-3.md](planos/arco-3.md): cada asset (imagen madre o clip) declara su bloque `yaml` + prompt. Ese archivo ES la spec que el engine ejecuta (`engine/wind-mcp` lo lee directamente). No se duplica en código ni en otros docs.

Fuentes que la spec NO duplica:
- Canon: [../biblia-serie.md](../biblia-serie.md).
- Anclas de estilo y STYLE-BLOCK: [../biblia-visual.md](../biblia-visual.md).
- Fichas de personaje: [../personajes-studio.md](../personajes-studio.md).
- Off documental literal por clip: [planos/arco-3-off.md](planos/arco-3-off.md).

## 6. Key flows (narrativa → publicación)

1. **Autoría**: se decide el beat y se escribe/ajusta la ficha en `planos/arco-N.md` (prompt + YAML). Es fuente por hilo.
2. **Generación**: imágenes madre primero; luego clips por personaje aislado (ver TECH).
3. **Montaje de salidas**: los cruces se resuelven por corte. Reel transversal → `reels/<slug>/` (intercala clips de varios hilos); destacadas → `destacadas/arco-N/` (recorte de un solo hilo, diferido).
4. **Off + export**: off documental (grabado propio o TTS), export 9:16.
5. **Publicación**: según [calendario-publicacion.md](calendario-publicacion.md).

## 7. Out of Scope

- Bajar los arcos 1 y 2 a fichas (queda pendiente; se hará con el mismo formato).
- Lipsync / personajes hablando a cámara (la voz es off documental).
- Publicidad / Ad Factory (no es el tipo de pieza).

## 8. Open Questions

- [ ] Regenerar `a3-a5` como FLF real (hoy I2V degradado) y validar el morph.
- [ ] Aprobar la cadena de puentes FLF cruzados (a5x experimental, a5y, c0, c2).

---

_Aprobado. Siguiente: [TECH.md](TECH.md)._
