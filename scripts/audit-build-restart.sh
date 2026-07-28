#!/bin/zsh
set -euo pipefail
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin"
cd "/Users/danielserna/Desktop/TECH BUISNESS/APP/corevia-web"
echo "=== npm run build ==="
npm run build
echo "=== BUILD EXIT $? ==="
echo "=== verify baked calendly ==="
/usr/bin/grep -RhoE 'calendly.com/danielserna_techsolutions/[A-Za-z0-9_-]+' .next 2>/dev/null | /usr/bin/sort | /usr/bin/uniq -c || true
echo "=== pm2 restart ==="
pm2 restart corevia-web
sleep 2
pm2 show corevia-web | /usr/bin/head -30
/usr/bin/curl -s -o /dev/null -w "home:%{http_code}\n" http://127.0.0.1:3002/en
