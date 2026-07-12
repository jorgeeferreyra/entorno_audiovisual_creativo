#!/usr/bin/env bash
# Arranca ComfyUI en :8188 (no choca con wind-comic en :3000).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/ComfyUI"
VENV="$APP/.venv"

if [[ ! -d "$VENV" ]]; then
  echo "Falta venv en $VENV — ver README.md" >&2
  exit 1
fi

if lsof -nP -iTCP:8188 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "ComfyUI ya está escuchando en :8188"
  exit 0
fi

cd "$APP"
# shellcheck disable=SC1091
source "$VENV/bin/activate"
export PYTORCH_ENABLE_MPS_FALLBACK=1
exec python main.py --port 8188 --fp32-vae "$@"
