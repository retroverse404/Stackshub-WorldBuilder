#!/usr/bin/env bash
set -euo pipefail

STATIC_PORT="${STATIC_PORT:-8091}"
PRIVY_PORT="${PRIVY_PORT:-3001}"
HOST="${HOST:-127.0.0.1}"

STATIC_BASE="http://$HOST:$STATIC_PORT"
PRIVY_BASE="http://$HOST:$PRIVY_PORT"

fail=0

check() {
  local url="$1"
  local expected="${2:-200}"
  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" "$url" || true)"
  if [[ "$code" == "$expected" ]]; then
    echo "PASS $code $url"
  else
    echo "FAIL expected=$expected got=$code $url"
    fail=1
  fi
}

echo "Smoke test: static routes"
check "$STATIC_BASE/" 200
check "$STATIC_BASE/GATES/stacks-hub-welcome.html" 200
check "$STATIC_BASE/GATES/login-email.html" 200
check "$STATIC_BASE/PAGES/single-scroll.html" 200
check "$STATIC_BASE/SPACES/OPEN%20AREA/greenland_1_a%20(3)/index.html" 200
check "$STATIC_BASE/SPACES/OPEN%20AREA/greenland_1_a%20(3)/public/scene.splinecode" 200
check "$STATIC_BASE/SPACES/VR%20Tour/3D%20publish/index.htm" 200
check "$STATIC_BASE/SPACES/VR%20Tour/3D%20publish/script.js" 200

echo "Smoke test: privy routes"
check "$PRIVY_BASE/" 307
check "$PRIVY_BASE/gate-overlay" 200
check "$PRIVY_BASE/gate-overlay?forceLogin=1" 200
check "$PRIVY_BASE/gates-login" 200
check "$PRIVY_BASE/gates-login?forceLogin=1" 200

if [[ "$fail" -ne 0 ]]; then
  echo "Smoke test failed."
  exit 1
fi

echo "Smoke test passed."
