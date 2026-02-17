#!/bin/bash
# sync-golems-docs.sh — Copy docs from golems monorepo (source of truth)
#
# Usage:
#   ./scripts/sync-golems-docs.sh              # default: ~/Gits/golems
#   ./scripts/sync-golems-docs.sh /path/to/golems
#   ./scripts/sync-golems-docs.sh --dry-run    # show what would change

set -euo pipefail

GOLEMS_ROOT="${1:-$HOME/Gits/golems}"
DRY_RUN=""

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN="--dry-run"; shift ;;
  esac
done

SOURCE="$GOLEMS_ROOT/packages/dashboard/content/docs/"
TARGET="$(cd "$(dirname "$0")/.." && pwd)/content/golems/"

if [ ! -d "$SOURCE" ]; then
  echo "Error: Source not found: $SOURCE"
  echo "Clone golems repo first: git clone https://github.com/EtanHey/golems.git ~/Gits/golems"
  exit 1
fi

echo "Syncing golems docs..."
echo "  From: $SOURCE"
echo "  To:   $TARGET"
[ -n "$DRY_RUN" ] && echo "  (dry run)"

rsync -av --delete $DRY_RUN "$SOURCE" "$TARGET"

echo ""
echo "Done. Review changes with: git diff --stat"
