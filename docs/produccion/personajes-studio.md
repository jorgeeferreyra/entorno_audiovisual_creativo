# Personajes — fichas Character Studio

> Fichas listas para pegar en **Character Studio** (`/dashboard/characters`), campo por campo según la UI: `name`, `description`, `appearance`, `styleKeywords`, `visualTags`, `imageUrls`.
> Canon en [../biblia-serie.md](../biblia-serie.md) (no se duplica acá: estas fichas solo bajan el canon a inputs de la herramienta). Plantilla y convenciones en [pipeline-wind-comic.md](pipeline-wind-comic.md) §6.
> La biblioteca de personajes de wind-comic es **global** (cross-project): estas fichas sirven para todos los arcos.

**Voz:** wind-comic rutea voz por género/nombre del personaje (4 voces de catálogo) con override por personaje en la pestaña de QC del proyecto. En los arcos de redes la voz es **off documental grabada propia** (ver [pipeline-wind-comic.md](pipeline-wind-comic.md) §2), así que el campo Voz de cada ficha solo aplica si algún día un personaje habla en TTS.

---

## Charles Francis Jones (CFJ)

> **Guarda de canon — NUNCA de frente.** La imagen de referencia (`assets/fuentes/charles-jones-referencia.jpeg`) lo muestra de frente y se usa SOLO para identidad y vestuario. Todo plano generado va de espaldas, en silueta, o por manos/sombrero/objetos.
> Fuente del aspecto: `prompt_charles_jones.txt` (raíz del proyecto). Se toma solo el aspecto físico y el vestuario; el framing de ese prompt (fotorrealista 8K, atmósfera tipo The Revenant) **NO se adopta**: el registro del proyecto es teatro de sombras / silueta recortada ([biblia-visual.md](biblia-visual.md) §1), donde la regla "nunca de frente" se cumple por diseño.

```
- name: Charles Francis Jones
- description (EN): Legendary elderly British explorer, around 70 years old, who vanished while retracing Darwin's voyage. Conveys wisdom, obsession, exhaustion and mystery. Never shown from the front: always seen from behind, in silhouette, or through his hands and belongings.
- appearance (EN): Elderly man around 70 with a slightly forward posture. Long thick white beard reaching the upper chest, slightly unkempt; shoulder-length thin grey-white messy hair moved by the wind. Old dark brown distressed leather fedora, slightly asymmetrical. Long dark brown expedition coat, beige linen exploration vest, cream shirt, worn scarf around the neck, dark trousers, old leather belt, heavy muddy leather boots. Cracked dark brown leather satchel across the chest. Rough, aged, dirty hands. (Face reference only, never shown on screen: long weathered face, deep wrinkles, pale blue-grey tired eyes, prominent slightly crooked nose.)
- styleKeywords (EN): paper cutout silhouette, shadow puppet theater, victorian exploration
- visualTags (EN): explorer, victorian, white beard, fedora, leather satchel, seen from behind
- imageUrls: assets/fuentes/charles-jones-referencia.jpeg (subir y pegar la URL resultante)
- Voz: routing masculino mayor (narrador masculino) · override: —
```

---

## Arco 3 — Familia de ornitorrincos

Las imágenes madre (`a3-m01`–`a3-m03`) se generan primero con los prompts de [arco-3-planos.md](arco-3-planos.md) §1; recién entonces se completa `imageUrls`. Ninguno habla: la voz del arco es el off documental.

### Madre ornitorrinco

```
- name: Madre ornitorrinco
- description (EN): The mother platypus of the Arc 3 family. Tender and ritualistic; stays on the Patagonian side after the rift splits Pangea, and slowly declines as her environment dries out.
- appearance (EN): Black paper cutout silhouette of an adult female platypus, rounded gentle contour in expressive side profile, calm gentle movements, delicate cut-out inner details.
- styleKeywords (EN): paper cutout silhouette, shadow puppet theater
- visualTags (EN): platypus, mother, tender, prehistoric
- imageUrls: assets/arco-3/madre/a3-m01-madre-ornitorrinco.png (pendiente de generar)
- Voz: — (no habla)
```

### Cría de ornitorrinco

```
- name: Cría de ornitorrinco
- description (EN): The baby platypus of the Arc 3 family. Playful and curious; hatches on the Australian side of the rift and grows up thriving there.
- appearance (EN): Black paper cutout silhouette of a small baby platypus, tiny rounded contour clearly smaller than an adult, playful side profile with tail curled upward.
- styleKeywords (EN): paper cutout silhouette, shadow puppet theater
- visualTags (EN): platypus, baby, playful, prehistoric
- imageUrls: assets/arco-3/madre/a3-m02-cria-ornitorrinco.png (pendiente de generar)
- Voz: — (no habla)
```

### Padre ornitorrinco

```
- name: Padre ornitorrinco
- description (EN): The father platypus of the Arc 3 family. Ends up on the Australian side of the rift with the egg, and adapts to the thriving wetland.
- appearance (EN): Black paper cutout silhouette of an adult male platypus, larger and more angular contour than the mother, with a distinctive notch cut into the outline of its brow.
- styleKeywords (EN): paper cutout silhouette, shadow puppet theater
- visualTags (EN): platypus, father, scar, prehistoric
- imageUrls: assets/arco-3/madre/a3-m03-padre-ornitorrinco.png (pendiente de generar)
- Voz: — (no habla)
```

---

## Mano con cadenita (esqueleto — pendiente Arco 1)

Detalle de Fran ([biblia-serie.md](../biblia-serie.md) §3), no un personaje generable completo: se resuelve con prompt + primer frame (imagen madre "mano con cadenita" de [biblia-visual.md](biblia-visual.md) §Arco 1), probablemente sin ficha de Character Studio. Completar si hace falta al bajar el Arco 1 a planos.
