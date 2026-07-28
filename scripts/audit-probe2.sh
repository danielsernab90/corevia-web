#!/bin/zsh
set -euo pipefail
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"
cd "/Users/danielserna/Desktop/TECH BUISNESS/APP/corevia-web"

echo "=== ICON FILES ==="
for asset in "/favicon.ico" "/icon.png" "/apple-icon.png" "/icon-512.png"; do
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3002$asset")
  echo "$code $asset"
done

echo "=== ENV PUBLIC (names only + calendly/site) ==="
/usr/bin/grep -E '^(NEXT_PUBLIC_CALENDLY_URL|NEXT_PUBLIC_SITE_URL)=' .env.local || true

echo "=== APP ICON SOURCES ==="
/bin/ls -la app/icon.* app/apple-icon.* app/favicon.* 2>/dev/null || true
/bin/ls -la public/icons 2>/dev/null || true

echo "=== OLD CALENDLY HTTP ==="
/usr/bin/curl -sL -o /tmp/corevia-audit/cal_old.html -w "http:%{http_code}\n" "https://calendly.com/danielserna_techsolutions/30min"
/usr/bin/python3 - <<'PY'
html=open('/tmp/corevia-audit/cal_old.html').read()
print('old invalid', any(s in html for s in ['Page not found','This Calendly URL is not valid',"isn't a Calendly page"]))
PY
/usr/bin/curl -sL -o /tmp/corevia-audit/cal_new.html -w "http:%{http_code}\n" "https://calendly.com/danielserna_techsolutions/10-15min"
/usr/bin/python3 - <<'PY'
html=open('/tmp/corevia-audit/cal_new.html').read()
print('new invalid', any(s in html for s in ['Page not found','This Calendly URL is not valid',"isn't a Calendly page"]))
print('new has Consulta', 'Consulta' in html)
PY
