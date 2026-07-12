#!/usr/bin/env bash
# Detiene ComfyUI en :8188.
set -euo pipefail
PIDS="$(lsof -nP -iTCP:8188 -sTCP:LISTEN -t 2>/dev/null || true)"
if [[ -z "$PIDS" ]]; then
  echo "Nada escuchando en :8188"
  exit 0
fi
echo "Matando PID(s) en :8188: $PIDS"
kill $PIDS
sleep 1
PIDS2="$(lsof -nP -iTCP:8188 -sTCP:LISTEN -t 2>/dev/null || true)"
if [[ -n "$PIDS2" ]]; then
  kill -9 $PIDS2
fi
echo "ComfyUI detenido"
