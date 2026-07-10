# Episodio 1 (redes) — Especificación de contenido

_Status: Approved_
_Date: 2026-07-09_
_Version: 1.0_

> Adaptación de la plantilla agency-os SPEC al dominio audiovisual. Es el **qué** del episodio: qué piezas existen y con qué intención. El **cómo** (motores, costos, refs) está en [TECH.md](TECH.md); el estado de producción en [PROGRESS.md](PROGRESS.md); el método transversal en [../../../metodo/](../../../metodo/).

---

## 1. Overview

Bloque de contenido para redes que funciona como **precuela canónica** del episodio 1 de la serie *Tras las pistas de Charles Jones*: la familia de ornitorrincos que se anima ES el fósil que Jorgito encuentra en Rocas Coloradas, y La Fundación que hoy "protege" el yacimiento es la misma mano que partió Pangea. Se produce con estética de teatro de sombras (siluetas recortadas estilo Lotte Reiniger) y off documental.

## 2. Goals

- Publicar el **Arco 3 (Ornitorrincos)** completo como primer bloque a redes: Reels A/B/C + Stories S1–S5.
- Sostener el canon y la consistencia visual de la serie (STYLE-BLOCK, "CFJ nunca de frente", tinte por beat).
- Mantener la producción barata y reproducible (un personaje por clip, cruces por montaje).

## 3. Audiencia

Espectador de reels/stories verticales (9:16). Consume sin audio garantizado (los hooks y el montaje deben leerse mudos); el off documental suma cuando hay sonido.

## 4. Estructura del contenido (arcos)

La serie tiene 3 arcos; el episodio arranca por el 3 (el más emocional, cierra en fosilización).

| Arco | Qué cuenta | Estado de bajada a fichas |
|---|---|---|
| 1 · La Mano Negra | La Fundación planifica las extinciones a escala geológica | Pendiente ([redes/arco-1-mano-negra.md](redes/arco-1-mano-negra.md)) |
| 2 · Charles y la palanca | CFJ interviene en puntos mínimos de apalancamiento | Pendiente ([redes/arco-2-charles-palanca.md](redes/arco-2-charles-palanca.md)) |
| 3 · Ornitorrincos | El drama familiar; los divididos por la grieta; final en fosilización | **Bajado a fichas ejecutables** ([planos/arco-3.md](planos/arco-3.md)) |

## 5. La spec ejecutable

La bajada de producción del Arco 3 vive como **fichas de ingesta** en [planos/arco-3.md](planos/arco-3.md): cada asset (imagen madre o clip) declara su bloque `yaml` + prompt. Ese archivo ES la spec que el engine ejecuta (`engine/wind-mcp` lo lee directamente). No se duplica en código ni en otros docs.

Fuentes que la spec NO duplica:
- Canon: [../biblia-serie.md](../biblia-serie.md).
- Anclas de estilo y STYLE-BLOCK: [../biblia-visual.md](../biblia-visual.md).
- Fichas de personaje: [../personajes-studio.md](../personajes-studio.md).
- Off documental literal por clip: [planos/arco-3-off.md](planos/arco-3-off.md).

## 6. Key flows (narrativa → publicación)

1. **Autoría**: se decide el beat y se escribe/ajusta la ficha en `planos/arco-3.md` (prompt + YAML).
2. **Generación**: imágenes madre primero; luego clips por personaje aislado (ver TECH).
3. **Montaje**: los cruces se resuelven por corte; se arman Reels A/B/C.
4. **Off + export**: off documental (grabado propio o TTS), export 9:16, stories por recorte.
5. **Publicación**: según [redes/calendario-publicacion.md](redes/calendario-publicacion.md).

## 7. Out of Scope

- Bajar los arcos 1 y 2 a fichas (queda pendiente; se hará con el mismo formato).
- Lipsync / personajes hablando a cámara (la voz es off documental).
- Publicidad / Ad Factory (no es el tipo de pieza).

## 8. Open Questions

- [ ] Regenerar `a3-a5` como FLF real (hoy I2V degradado) y validar el morph.
- [ ] Aprobar la cadena de puentes FLF cruzados (a5x experimental, a5y, c0, c2).

---

_Aprobado. Siguiente: [TECH.md](TECH.md)._
