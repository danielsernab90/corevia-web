#!/usr/bin/env bash
# Start Corevia for LAN remote development (binds 0.0.0.0:3002).
set -euo pipefail
cd "$(dirname "$0")/.."
exec npm run dev:remote
