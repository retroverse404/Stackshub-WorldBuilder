#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$ROOT_DIR/PRIVY TEST/privy-stacks-integration-demo/public"

DRY_RUN="${DRY_RUN:-0}"
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

if [[ ! -d "$PUBLIC_DIR" ]]; then
  echo "Public mirror not found: $PUBLIC_DIR"
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required but not installed."
  exit 1
fi

RSYNC_FLAGS=(-av --delete)
if [[ "$DRY_RUN" == "1" ]]; then
  RSYNC_FLAGS+=(-n)
  echo "Running in dry-run mode."
fi

sync_dir() {
  local src="$1"
  local dest="$2"
  echo "Syncing: $src -> $dest"
  rsync "${RSYNC_FLAGS[@]}" \
    --exclude ".git/" \
    --exclude ".next/" \
    --exclude "node_modules/" \
    "$src/" "$dest/"
}

mkdir -p "$PUBLIC_DIR/GATES" "$PUBLIC_DIR/PAGES"

sync_dir "$ROOT_DIR/GATES" "$PUBLIC_DIR/GATES"
sync_dir "$ROOT_DIR/PAGES" "$PUBLIC_DIR/PAGES"

cat <<EOF
Mirror sync complete.
- Source: $ROOT_DIR/{GATES,PAGES}
- Target: $PUBLIC_DIR/{GATES,PAGES}
EOF
