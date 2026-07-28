#!/bin/zsh
set -euo pipefail
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"
cd "/Users/danielserna/Desktop/TECH BUISNESS/APP/corevia-web"
mkdir -p /tmp/corevia-audit

echo "=== ROUTES ==="
for path in /en /es /en/services /en/work /en/company /en/contact /en/book-consultation /en/privacy /en/terms /en/referral /en/does-not-exist; do
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3002$path")
  echo "$code $path"
done

echo "=== BAKED CALENDLY ==="
/usr/bin/grep -RhoE 'calendly.com/danielserna_techsolutions/[A-Za-z0-9_-]+' .next 2>/dev/null | /usr/bin/sort | /usr/bin/uniq -c || true

echo "=== ASSETS ==="
for asset in \
  "/corevia-logo.png" \
  "/images/hero-devices.png" \
  "/images/hero-illustration.png" \
  "/images/work-financial-report.png" \
  "/images/work-vida-green-market.png" \
  "/images/work-property-portfolio.png" \
  "/icon-512.png" \
  "/logos/COREVIA%20FLAVICON%201200X630.png" \
  "/favicon.ico" \
  "/apple-touch-icon.png" \
  "/icons/icon-192.png"
do
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3002$asset")
  echo "$code $asset"
done

echo "=== META ==="
/usr/bin/curl -sL "http://127.0.0.1:3002/en" > /tmp/corevia-audit/home.html
/usr/bin/python3 - <<'PY'
import re
html=open("/tmp/corevia-audit/home.html").read()
for pat in [
    r"<title>[^<]+</title>",
    r"<meta[^>]+name=\"description\"[^>]*>",
    r"<meta[^>]+property=\"og:[^\"]+\"[^>]*>",
    r"<meta[^>]+name=\"twitter:[^\"]+\"[^>]*>",
    r"<link[^>]+rel=\"(?:icon|apple-touch-icon|shortcut icon)\"[^>]*>",
]:
  for m in re.finditer(pat, html, re.I):
    print(m.group(0)[:240])
print("=== IMG SRC ===")
for m in re.finditer(r"<img[^>]+>", html, re.I):
  tag=m.group(0)
  src=re.search(r"src=\"([^\"]+)\"", tag)
  alt=re.search(r"alt=\"([^\"]*)\"", tag)
  print((src.group(1) if src else "?")[:140], "| alt=", (alt.group(1) if alt else "MISSING")[:80])
PY
