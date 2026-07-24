#!/usr/bin/env bash
# Start Corevia for Tailscale / LAN remote development.
# Fixed port: 3002 — binds 0.0.0.0 so MacBook browsers can connect.
set -euo pipefail
cd "$(dirname "$0")/.."
exec npm run dev:remote
