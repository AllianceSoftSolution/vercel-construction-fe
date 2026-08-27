#!/usr/bin/env bash
# Build the Vite frontend and sync the output into both fe-dist folders
# used by AWS (construction-be/fe-dist) and the FE repo snapshot.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BE_FE_DIST="$(cd "$ROOT/../construction-be" && pwd)/fe-dist"
FE_FE_DIST="$ROOT/fe-dist"
DIST="$ROOT/dist"

echo "Building frontend..."
cd "$ROOT"
npm run build

echo "Syncing to construction-fe/fe-dist..."
rm -rf "$FE_FE_DIST"
cp -R "$DIST" "$FE_FE_DIST"

echo "Syncing to construction-be/fe-dist..."
rm -rf "$BE_FE_DIST"
cp -R "$DIST" "$BE_FE_DIST"

echo "Done."
echo "  FE: $FE_FE_DIST"
echo "  BE: $BE_FE_DIST"
echo "Remember to commit fe-dist in BOTH construction-fe and construction-be before AWS deploy."
