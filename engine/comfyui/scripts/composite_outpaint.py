#!/usr/bin/env python3
"""Composite generated outpaint over the pad using the hard mask; build audit triptych."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pad", required=True, type=Path)
    ap.add_argument("--generated", required=True, type=Path)
    ap.add_argument("--mask-hard", required=True, type=Path)
    ap.add_argument("--lock", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--triptych", required=True, type=Path)
    args = ap.parse_args()

    pad = Image.open(args.pad).convert("RGB")
    gen = Image.open(args.generated).convert("RGB").resize(pad.size, Image.Resampling.LANCZOS)
    hard = Image.open(args.mask_hard).convert("L").resize(pad.size, Image.Resampling.NEAREST)
    # hard: 255 = generated zone, 0 = keep original
    # Image.composite(image1, image2, mask) uses mask as alpha of image1
    composited = Image.composite(gen, pad, hard)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    composited.save(args.out)

    lock = Image.open(args.lock).convert("RGB")
    h = 512
    def fit(im: Image.Image) -> Image.Image:
        r = h / im.height
        return im.resize((max(1, int(im.width * r)), h), Image.Resampling.LANCZOS)

    a, b, c = fit(pad), fit(composited), fit(lock)
    gap = 16
    tri = Image.new("RGB", (a.width + b.width + c.width + 2 * gap, h), (24, 24, 24))
    x = 0
    for im in (a, b, c):
        tri.paste(im, (x, 0))
        x += im.width + gap
    args.triptych.parent.mkdir(parents=True, exist_ok=True)
    tri.save(args.triptych)
    print(f"wrote {args.out}")
    print(f"wrote {args.triptych}")


if __name__ == "__main__":
    main()
