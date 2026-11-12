# Alchemetanoia Consultancy

Booking website and admin dashboard for Alchemetanoia Consultancy (Sydney, Australia).

**Stack:** Next.js 16 · SQLite (better-sqlite3, WAL) · Drizzle ORM · Better Auth · Tailwind CSS

- Public site: `src/app/(site)`
- Admin dashboard: `src/app/dashboard` (sign in at `/dashboard/login`)
- Database schema: `src/db/schema.ts`. Booking rules: `src/lib/bookings.ts`

All times are stored in UTC and shown in the business timezone (`Australia/Sydney` by default). Prices are stored in AUD cents.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in BETTER_AUTH_SECRET and ADMIN_PASSWORD
npm run db:migrate           # creates ./data/app.db
npm run seed                 # admin user, services, default working hours
npm run seed -- --demo       # optional: demo clients and bookings
npm run dev
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run db:generate` | Create a migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations (run on every deploy) |
| `npm run db:studio` | Browse the database in the browser |
| `npm run seed` | Create the admin account, services and working hours (safe to re-run) |

## Deploying (VPS)

The build is `standalone`. On the server:

```bash
git pull && npm ci && npm run db:migrate && npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
pm2 reload alchemetanoia || pm2 start .next/standalone/server.js --name alchemetanoia
```

- Set `BETTER_AUTH_URL` to the public site URL (e.g. `https://alchemetanoia.com`). Sign-in is rejected from any other origin unless it's listed (comma-separated) in `BETTER_AUTH_TRUSTED_ORIGINS`, e.g. `https://www.alchemetanoia.com`.
- Keep `DATABASE_PATH` outside the app folder (e.g. `/var/lib/alchemetanoia/app.db`) and back it up off the server (Litestream or a nightly `sqlite3 .backup`).
