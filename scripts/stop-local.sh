#!/usr/bin/env bash
set -euo pipefail

STATIC_PORT="${STATIC_PORT:-8091}"
PRIVY_PORT="${PRIVY_PORT:-3001}"
RUNTIME_DIR="/tmp/stackshub-local"

STATIC_PID_FILE="$RUNTIME_DIR/static-${STATIC_PORT}.pid"
PRIVY_PID_FILE="$RUNTIME_DIR/privy-${PRIVY_PORT}.pid"

stop_pid_file() {
  local label="$1"
  local pid_file="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo "$label: no pid file"
    return
  fi

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [[ -z "$pid" ]]; then
    echo "$label: empty pid file"
    rm -f "$pid_file"
    return
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid" >/dev/null 2>&1 || true
    sleep 0.3
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
    echo "$label: stopped pid $pid"
  else
    echo "$label: pid $pid not running"
  fi
  rm -f "$pid_file"
}

stop_listener_port() {
  local label="$1"
  local port="$2"
  local pid
  pid="$(ss -ltnp 2>/dev/null | awk -v p=":$port" '$4 ~ p"$" || $4 ~ p" " {print $NF}' | sed -E 's/.*pid=([0-9]+).*/\1/' | head -n1)"
  if [[ -z "$pid" ]]; then
    return
  fi
  if kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid" >/dev/null 2>&1 || true
    sleep 0.3
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
    echo "$label: freed port $port (pid $pid)"
  fi
}

stop_pid_file "Static" "$STATIC_PID_FILE"
stop_pid_file "Privy" "$PRIVY_PID_FILE"
stop_listener_port "Static" "$STATIC_PORT"
stop_listener_port "Privy" "$PRIVY_PORT"
