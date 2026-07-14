#!/usr/bin/env bash
# Detiene ComfyUI en :8188.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
PIDFILE="$ROOT/comfyui.pid"

PIDS="$(lsof -nP -iTCP:8188 -sTCP:LISTEN -t 2>/dev/null || true)"
if [[ -z "$PIDS" && -f "$PIDFILE" ]]; then
  PIDS="$(cat "$PIDFILE" 2>/dev/null || true)"
fi
if [[ -z "${PIDS:-}" ]]; then
  echo "Nada escuchando en :8188"
  rm -f "$PIDFILE"
  exit 0
fi
echo "Matando PID(s): $PIDS"
kill $PIDS 2>/dev/null || true
sleep 1
PIDS2="$(lsof -nP -iTCP:8188 -sTCP:LISTEN -t 2>/dev/null || true)"
if [[ -n "${PIDS2:-}" ]]; then
  kill -9 $PIDS2 2>/dev/null || true
fi
rm -f "$PIDFILE"
echo "ComfyUI detenido"
