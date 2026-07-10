---
reel: la-grieta
titulo: "La grieta"
arcos: [1, 2, 3]
origen: episodios/episodio-1 (precuela)
clips: [a3-a1, a3-a2, a3-a3, a3-a4, a3-a5, a3-a5b, a3-a5c, a3-a6]
estado: pendiente
---

# Reel — La grieta (transversal)

Salida transversal: intercala clips de los tres hilos (Mano Negra, Charles/palanca, Ornitorrincos) para contar las tres historias en una sola pieza vertical (IG/TikTok). No es la salida de un arco; los arcos son la **fuente**.

- **Arcos que cruza**: `arcos: [1, 2, 3]`. Hoy la lista de `clips` solo trae `a3-*` porque solo el Arco 3 está bajado a fichas; se completa con `a1-*`/`a2-*` cuando esos hilos bajen a [../../planos/](../../planos/).
- **Origen**: metadata, no jerarquía. Es precuela canónica del episodio 1 (el fósil de Rocas Coloradas). Si la relación cambia (standalone, o semilla de un episodio futuro), se edita la línea `origen` del front-matter — no se mueve nada.
- **Fuente ejecutable**: [../../planos/arco-3.md](../../planos/arco-3.md) (y las de los otros arcos cuando existan).
- **Clips fuente**: `../../assets/arco-3/clips/` (por arco).
- **Off documental**: [../../planos/arco-3-off.md](../../planos/arco-3-off.md).

El montaje final (`montar_secuencia`) cae en esta carpeta.
