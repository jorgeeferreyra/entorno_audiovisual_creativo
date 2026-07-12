#!/usr/bin/env python3
"""Queue a ComfyUI API-format workflow and copy output images to --out-dir."""
from __future__ import annotations

import argparse
import json
import shutil
import time
import urllib.request
import uuid
from pathlib import Path


def http_json(method: str, url: str, payload: dict | None = None) -> dict:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={"Content-Type": "application/json"} if data else {},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://127.0.0.1:8188")
    ap.add_argument("--workflow", required=True, type=Path)
    ap.add_argument("--out-dir", required=True, type=Path)
    ap.add_argument("--timeout", type=int, default=1800)
    args = ap.parse_args()

    workflow = json.loads(args.workflow.read_text())
    client_id = str(uuid.uuid4())
    queued = http_json(
        "POST",
        f"{args.url}/prompt",
        {"prompt": workflow, "client_id": client_id},
    )
    prompt_id = queued["prompt_id"]
    print(f"queued prompt_id={prompt_id}")

    t0 = time.time()
    history = None
    while time.time() - t0 < args.timeout:
        hist = http_json("GET", f"{args.url}/history/{prompt_id}")
        if prompt_id in hist:
            history = hist[prompt_id]
            break
        time.sleep(2)
    if history is None:
        raise SystemExit(f"timeout waiting for {prompt_id}")

    status = history.get("status", {})
    if status.get("status_str") == "error" or status.get("completed") is False:
        raise SystemExit(f"workflow failed: {json.dumps(status, indent=2)[:2000]}")

    args.out_dir.mkdir(parents=True, exist_ok=True)
    outputs = history.get("outputs", {})
    copied: list[Path] = []
    for node_out in outputs.values():
        for img in node_out.get("images", []):
            filename = img["filename"]
            subfolder = img.get("subfolder", "")
            img_type = img.get("type", "output")
            src = (
                Path(__file__).resolve().parents[1]
                / "ComfyUI"
                / img_type
                / subfolder
                / filename
            )
            if not src.exists():
                # fallback: fetch via /view
                view_url = (
                    f"{args.url}/view?filename={filename}"
                    f"&subfolder={subfolder}&type={img_type}"
                )
                dest = args.out_dir / filename
                with urllib.request.urlopen(view_url, timeout=120) as resp:
                    dest.write_bytes(resp.read())
                copied.append(dest)
                print(f"saved {dest}")
                continue
            dest = args.out_dir / filename
            shutil.copy2(src, dest)
            copied.append(dest)
            print(f"copied {src} -> {dest}")

    if not copied:
        raise SystemExit(f"no images in history outputs: {json.dumps(outputs)[:1000]}")
    print(f"done in {time.time() - t0:.1f}s — {len(copied)} image(s)")


if __name__ == "__main__":
    main()
