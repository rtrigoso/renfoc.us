#!/usr/bin/env bash
set -euo pipefail

if ! command -v cwebp &>/dev/null; then
  echo "Error: cwebp is not installed." >&2
  exit 1
fi

PUBLIC_DIR="$(cd "$(dirname "$0")/../public" && pwd)"

find "$PUBLIC_DIR" -maxdepth 1 -type f -iname "*.webp" -delete

find "$PUBLIC_DIR" -maxdepth 1 -type f | while IFS= read -r img; do
  mime=$(file --mime-type -b "$img")
  case "$mime" in
    image/webp) continue ;;
    image/svg+xml) continue ;;
    image/*) ;;
    *) continue ;;
  esac

  base="${img%.*}"
  webp_out="${base}.webp"

  if [ -f "$webp_out" ]; then
    continue
  fi

  echo "Converting: $(basename "$img") -> $(basename "$webp_out")"
  cwebp -partition_limit 100 -psnr 1 -size 75 -m 3 -f 0 -q 0 -jpeg_like "$img" -o "$webp_out"
done

echo "Done."
