#!/usr/bin/env bash
# Arranca ComfyUI en :8188 (no choca con wind-comic en :3000).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/ComfyUI"
VENV="$APP/.venv"
LOG="$ROOT/comfyui.log"
PIDFILE="$ROOT/comfyui.pid"

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
export PYTHONUNBUFFERED=1

nohup python -u main.py --port 8188 --fp32-vae "$@" >"$LOG" 2>&1 &
echo $! >"$PIDFILE"
echo "ComfyUI arrancando (pid $(cat "$PIDFILE")) — log: $LOG"

for i in $(seq 1 90); do
  if curl -sf http://127.0.0.1:8188/system_stats >/dev/null 2>&1; then
    echo "Listo: http://127.0.0.1:8188"
    exit 0
  fi
  # Si el proceso murió, fallar ya
  if ! kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    echo "ComfyUI murió al arrancar — ver $LOG" >&2
    tail -40 "$LOG" >&2 || true
    exit 1
  fi
  sleep 1
done
echo "Timeout esperando :8188 — ver $LOG" >&2
exit 1
