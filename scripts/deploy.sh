#!/usr/bin/env bash
# Deploy on the VPS.
#
# Usage:  bash scripts/deploy.sh [soft|hard|hard:db] [branch]   defaults: soft, master
#         npm run deploy           (soft)
#         npm run deploy:hard      (hard)
#         npm run deploy:hard:db   (hard + wipe the database)
#
#   soft     Everyday deploy. Pull, install dependencies only if package-lock.json changed,
#            back up + migrate the database, build, copy assets, zero-downtime `pm2 reload`.
#   hard     Clean rebuild. Deletes node_modules and .next, reinstalls everything, backs up +
#            migrates, builds, copies assets, full `pm2 restart`. Use it when soft deploys act
#            strange, after a Node upgrade, or when a native module (better-sqlite3, sharp) breaks.
#   hard:db  Same as hard, but ALSO DELETES ALL DATABASE DATA (bookings, clients, users...).
#            Backs up first, asks you to type DELETE, stops the app, recreates an empty database,
#            then runs `npm run seed` (admin user, services, working hours).
#            Non-interactive (CI): set CONFIRM_WIPE_DB=DELETE instead of typing it.
#
# soft and hard never delete data: the database lives in <app>/data/ (or DATABASE_PATH),
# outside the build folder, and is backed up to <db folder>/backups/ before every migration.
#
# If the build fails, the previous build is put back and the old version keeps running
# (in hard mode too, as long as a previous build existed).
set -euo pipefail

MODE="${1:-soft}"
BRANCH="${2:-master}"
APP_NAME="APCAMS"   # must match `name` in ecosystem.config.cjs
case "$MODE" in soft|hard|hard:db) ;; *) echo "Unknown mode '$MODE'. Use: soft | hard | hard:db"; exit 1 ;; esac

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

# Ask before anything else, so a wrong command costs nothing.
if [ "$MODE" = "hard:db" ]; then
  # Same path the running app uses (resolved in ecosystem.config.cjs).
  DB_PATH="$(node -e "console.log(require('./ecosystem.config.cjs').apps[0].env.DATABASE_PATH)")"
  printf '\n\033[1;31m!! hard:db will PERMANENTLY DELETE ALL DATA in %s\033[0m\n' "$DB_PATH"
  echo "   (bookings, clients, users, staff, settings). A backup is taken first."
  if [ "${CONFIRM_WIPE_DB:-}" != "DELETE" ]; then
    if [ ! -t 0 ]; then echo "Not a terminal and CONFIRM_WIPE_DB is not DELETE, so I'm stopping."; exit 1; fi
    read -r -p "Type DELETE to continue: " answer
    [ "$answer" = "DELETE" ] || { echo "Cancelled. Nothing was changed."; exit 1; }
  fi
fi

# Never deploy over uncommitted edits on the server (they'd block the pull or get mixed in).
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Uncommitted changes in $ROOT, so I'm stopping. Commit, stash or discard them first:"
  git status --short --untracked-files=no
  exit 1
fi

log "[$MODE] Pulling $BRANCH"
OLD_LOCK="$(git rev-parse HEAD:package-lock.json 2>/dev/null || echo none)"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
NEW_LOCK="$(git rev-parse HEAD:package-lock.json 2>/dev/null || echo none)"
git log -1 --oneline

# Dev dependencies are needed for the build and for tsx (migrations).
if [ "$MODE" != "soft" ]; then
  log "Clean install (removing node_modules)"
  rm -rf node_modules
  npm ci --include=dev
elif [ "$OLD_LOCK" != "$NEW_LOCK" ] || [ ! -d node_modules ]; then
  log "package-lock.json changed, installing dependencies"
  npm ci --include=dev
else
  log "Dependencies unchanged, skipping install"
fi

log "Backing up the database"
npm run db:backup

if [ "$MODE" = "hard:db" ]; then
  log "Stopping $APP_NAME and wiping the database"
  pm2 stop "$APP_NAME" >/dev/null 2>&1 || true   # nothing may hold the file open while it's deleted
  rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
fi

log "Running database migrations"
npm run db:migrate

if [ "$MODE" = "hard:db" ]; then
  log "Seeding the fresh database (admin user, services, working hours)"
  npm run seed
fi

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

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  if [ "$MODE" != "soft" ]; then
    log "Restarting PM2 ($APP_NAME)"
    pm2 restart ecosystem.config.cjs --update-env
  else
    log "Reloading PM2 ($APP_NAME)"
    pm2 reload ecosystem.config.cjs --update-env
  fi
else
  log "Starting PM2 ($APP_NAME)"
  pm2 start ecosystem.config.cjs
fi
pm2 save >/dev/null

rm -rf .next.bak
log "Deployed $(git rev-parse --short HEAD) ($MODE)"
pm2 status "$APP_NAME"
