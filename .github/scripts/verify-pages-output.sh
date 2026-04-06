#!/usr/bin/env bash

set -euo pipefail

echo "Verifying static export artifacts"

test -d out
test -f out/index.html
test -f out/404.html
test -f out/robots.txt
test -f out/sitemap.xml

if [[ -n "${NEXT_PUBLIC_SITE_URL:-}" ]]; then
  normalized_site_url="${NEXT_PUBLIC_SITE_URL%/}"

  grep -Fq "${normalized_site_url}/sitemap.xml" out/robots.txt
  grep -Fq "${normalized_site_url}" out/sitemap.xml
fi

echo "Static export verification passed"
