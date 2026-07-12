#!/usr/bin/env bash
# Submits a ComfyUI API-format workflow JSON and waits for the output image(s).
# Usage: ./scripts/queue_workflow.sh workflows/foo.api.json [output-dir]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WF="${1:?workflow api json}"
OUT_DIR="${2:-$ROOT/ComfyUI/output}"
COMFY_URL="${COMFY_URL:-http://127.0.0.1:8188}"

cd "$ROOT"
# shellcheck disable=SC1091
source "$ROOT/ComfyUI/.venv/bin/activate"
python "$ROOT/scripts/queue_workflow.py" --url "$COMFY_URL" --workflow "$WF" --out-dir "$OUT_DIR"
