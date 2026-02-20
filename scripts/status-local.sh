#!/usr/bin/env bash
set -euo pipefail

STATIC_PORT="${STATIC_PORT:-8091}"
PRIVY_PORT="${PRIVY_PORT:-3001}"
HOST="${HOST:-127.0.0.1}"
RUNTIME_DIR="/tmp/stackshub-local"

STATIC_PID_FILE="$RUNTIME_DIR/static-${STATIC_PORT}.pid"
PRIVY_PID_FILE="$RUNTIME_DIR/privy-${PRIVY_PORT}.pid"

check_pid_file() {
  local label="$1"
  local pid_file="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo "$label: down (no pid file)"
    return
  fi
  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
    echo "$label: up (pid $pid)"
  else
    echo "$label: down (stale pid file)"
  fi
}

check_http() {
  local label="$1"
  local url="$2"
  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" "$url" || true)"
  echo "$label HTTP: $code $url"
}

check_pid_file "Static" "$STATIC_PID_FILE"
check_pid_file "Privy" "$PRIVY_PID_FILE"
check_http "Static" "http://$HOST:$STATIC_PORT/"
check_http "Privy" "http://$HOST:$PRIVY_PORT/gate-overlay"
