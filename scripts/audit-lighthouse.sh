#!/bin/zsh
set -euo pipefail
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"
cd "/Users/danielserna/Desktop/TECH BUISNESS/APP/corevia-web"
mkdir -p /tmp/corevia-audit
CHROME="/var/folders/6p/lxhmbp093xd62mxggcq8dds00000gn/T/cursor-sandbox-cache/ca3c35da2edae2ef5312e4fae975641e/puppeteer/chrome/mac_arm-148.0.7778.97/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
export CHROME_PATH="$CHROME"
# Launch chrome manually then attach? Use lighthouse with --port after launching
"$CHROME" --headless=new --remote-debugging-port=9222 --disable-gpu about:blank >/tmp/corevia-audit/chrome.log 2>&1 &
CHROME_PID=$!
sleep 2
npx --yes lighthouse http://127.0.0.1:3002/en --port=9222 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/tmp/corevia-audit/lh-home-after.json --quiet
npx --yes lighthouse http://127.0.0.1:3002/en/services --port=9222 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/tmp/corevia-audit/lh-services-after.json --quiet
kill $CHROME_PID 2>/dev/null || true
python3 <<'PY'
import json, pathlib
for name in ["lh-home-after.json","lh-services-after.json"]:
  p=pathlib.Path("/tmp/corevia-audit")/name
  if not p.exists():
    print(name, "MISSING"); continue
  d=json.loads(p.read_text())
  print(name)
  for k,v in d.get("categories",{}).items():
    score=v.get("score") or 0
    print(" ", k + ":", round(score*100))
  audits=d.get("audits",{})
  for k in ["largest-contentful-paint","cumulative-layout-shift","total-blocking-time","interactive","first-contentful-paint","speed-index"]:
    a=audits.get(k,{})
    print(" ", k + ":", a.get("displayValue"))
PY
