#!/usr/bin/env bash
# Deploy on the VPS: pull, install, migrate, build, copy assets into the standalone build, reload PM2.
# Usage (from anywhere):  bash scripts/deploy.sh [branch]      default branch: master
# If the build fails, the previous build is put back and the old version keeps running.
set -euo pipefail

BRANCH="${1:-master}"
APP_NAME="APCAMS"   # must match `name` in ecosystem.config.cjs
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

# Never deploy over uncommitted edits on the server (they'd block the pull or get mixed in).
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Uncommitted changes in $ROOT, so I'm stopping. Commit, stash or discard them first:"
  git status --short --untracked-files=no
  exit 1
fi

log "Pulling $BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
git log -1 --oneline

log "Installing dependencies"
# Dev dependencies are needed for the build and for tsx (migrations).
npm ci --include=dev

log "Running database migrations"
npm run db:migrate

log "Building"
rm -rf .next.bak
[ -d .next ] && mv .next .next.bak
if ! npm run build; then
  echo "Build failed. Restoring the previous build."
  rm -rf .next
  [ -d .next.bak ] && mv .next.bak .next
  exit 1
fi

log "Copying public/ and static assets into the standalone build"
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/

log "Reloading PM2 ($APP_NAME)"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save >/dev/null

rm -rf .next.bak
log "Deployed $(git rev-parse --short HEAD)"
pm2 status "$APP_NAME"
