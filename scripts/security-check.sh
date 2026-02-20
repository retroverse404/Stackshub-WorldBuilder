#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/PRIVY TEST/privy-stacks-integration-demo"

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Git repo not found at: $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

echo "Security check: tracked secret scan"

PATTERN='(privy_app_secret_[A-Za-z0-9]+|PRIVY_APP_SECRET=[^[:space:]]+|QUORUMS_PRIVATE_KEY=[^[:space:]]+|BEGIN PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|sk_live_[A-Za-z0-9]{10,})'

RAW_MATCHES="$(git grep -n -I -E "$PATTERN" -- . ':!*.example' ':!.env.local.example' || true)"
MATCHES="$(printf '%s\n' "$RAW_MATCHES" | rg -v 'your_privy_app_secret|your_quorum_private_key|PRIVY_APP_SECRET=\s*$|QUORUMS_PRIVATE_KEY=\s*$' || true)"

if [[ -n "$MATCHES" ]]; then
  echo "FAIL: potential secret-like values found in tracked files:"
  echo "$MATCHES"
  exit 1
fi

echo "PASS: no obvious secret-like values found in tracked files."

echo
echo "Security check: environment file policy"
if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
  echo "FAIL: .env.local is tracked (must be untracked)."
  exit 1
fi
echo "PASS: .env.local is not tracked."

echo
echo "Security check complete."
