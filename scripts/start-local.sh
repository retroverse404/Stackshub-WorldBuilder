#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRIVY_DIR="$ROOT_DIR/PRIVY TEST/privy-stacks-integration-demo"

STATIC_PORT="${STATIC_PORT:-8091}"
PRIVY_PORT="${PRIVY_PORT:-3001}"
HOST="${HOST:-127.0.0.1}"

RUNTIME_DIR="/tmp/stackshub-local"
mkdir -p "$RUNTIME_DIR"

STATIC_PID_FILE="$RUNTIME_DIR/static-${STATIC_PORT}.pid"
PRIVY_PID_FILE="$RUNTIME_DIR/privy-${PRIVY_PORT}.pid"
STATIC_LOG="$RUNTIME_DIR/static-${STATIC_PORT}.log"
PRIVY_LOG="$RUNTIME_DIR/privy-${PRIVY_PORT}.log"

is_pid_running() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1
}

get_listener_pid() {
  local port="$1"
  ss -ltnp 2>/dev/null | awk -v p=":$port" '$4 ~ p"$" || $4 ~ p" " {print $NF}' | sed -E 's/.*pid=([0-9]+).*/\1/' | head -n1
}

ensure_port_free() {
  local port="$1"
  local pid
  pid="$(get_listener_pid "$port" || true)"
  if [[ -z "$pid" ]]; then
    return
  fi
  if kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid" >/dev/null 2>&1 || true
    sleep 0.3
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
  fi
}

start_static() {
  ensure_port_free "$STATIC_PORT"

  if [[ -f "$STATIC_PID_FILE" ]]; then
    local pid
    pid="$(cat "$STATIC_PID_FILE" 2>/dev/null || true)"
    if is_pid_running "$pid"; then
      echo "Static server already running on $HOST:$STATIC_PORT (pid $pid)"
      return
    fi
    rm -f "$STATIC_PID_FILE"
  fi

  (
    cd "$ROOT_DIR"
    setsid python3 -m http.server "$STATIC_PORT" --bind "$HOST" >"$STATIC_LOG" 2>&1 < /dev/null &
    echo $! > "$STATIC_PID_FILE"
  )
  echo "Started static server on http://$HOST:$STATIC_PORT (pid $(cat "$STATIC_PID_FILE"))"
}

start_privy() {
  ensure_port_free "$PRIVY_PORT"

  if [[ -f "$PRIVY_PID_FILE" ]]; then
    local pid
    pid="$(cat "$PRIVY_PID_FILE" 2>/dev/null || true)"
    if is_pid_running "$pid"; then
      echo "Privy app already running on $HOST:$PRIVY_PORT (pid $pid)"
      return
    fi
    rm -f "$PRIVY_PID_FILE"
  fi

  (
    cd "$PRIVY_DIR"
    setsid npm run dev:local >"$PRIVY_LOG" 2>&1 < /dev/null &
    echo $! > "$PRIVY_PID_FILE"
  )
  echo "Started Privy app on http://$HOST:$PRIVY_PORT (pid $(cat "$PRIVY_PID_FILE"))"
}

wait_for_http() {
  local url="$1"
  local attempts="${2:-40}"
  local sleep_s="${3:-0.5}"

  for _ in $(seq 1 "$attempts"); do
    local code
    code="$(curl -sS -o /dev/null -w "%{http_code}" "$url" || true)"
    if [[ "$code" == "200" || "$code" == "307" ]]; then
      echo "Ready: $url ($code)"
      return 0
    fi
    sleep "$sleep_s"
  done

  echo "Timeout waiting for $url"
  return 1
}

start_static
start_privy

wait_for_http "http://$HOST:$STATIC_PORT/" || true
wait_for_http "http://$HOST:$PRIVY_PORT/gate-overlay" || true

cat <<EOF

Local stack is up:
- Static site: http://$HOST:$STATIC_PORT/
- Privy app:   http://$HOST:$PRIVY_PORT/

Logs:
- $STATIC_LOG
- $PRIVY_LOG
EOF
