#!/usr/bin/env bash
# Rebuild the archive's display covers from the JPEG masters.
#
# A cover is never drawn wider than 320 CSS px, so 640px covers 2x screens with
# room to spare. Serving the 1200x1500 masters meant ~1.8MB for six covers;
# these come to ~200KB with no visible difference at the size they render.
#
#   ./scripts/build-covers.sh      (or: npm run covers)
#
# Requires cwebp:  brew install webp
set -euo pipefail

cd "$(dirname "$0")/.."
src="public/covers"
out="$src/opt"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp not found — install it with:  brew install webp" >&2
  exit 1
fi

mkdir -p "$out"
before=0
after=0

for f in "$src"/*.jpg; do
  id=$(basename "$f" .jpg)
  cwebp -quiet -q 80 -resize 640 0 -m 6 -sharp_yuv -metadata icc "$f" -o "$out/$id.webp"
  b=$(stat -f%z "$f")
  a=$(stat -f%z "$out/$id.webp")
  before=$((before + b))
  after=$((after + a))
  printf "  %-18s %5s KB -> %4s KB\n" "$id" $((b / 1024)) $((a / 1024))
done

printf "\n  total %s KB -> %s KB\n" $((before / 1024)) $((after / 1024))
