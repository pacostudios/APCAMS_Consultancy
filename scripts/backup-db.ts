/**
 * Snapshots the SQLite database before a deploy: `npm run db:backup`.
 * Uses SQLite's online backup, so it is consistent even while the app is running (WAL mode).
 * Writes <db folder>/backups/app-<timestamp>.db and keeps the newest 10.
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve(process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db"));
const KEEP = 10;

async function main() {
  if (!fs.existsSync(dbPath)) {
    console.log(`No database at ${dbPath} yet, so there is nothing to back up.`);
    return;
  }
  const dir = path.join(path.dirname(dbPath), "backups");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dest = path.join(dir, `${path.basename(dbPath, ".db")}-${stamp}.db`);

  const sqlite = new Database(dbPath, { readonly: true, fileMustExist: true });
  await sqlite.backup(dest);
  sqlite.close();
  console.log(`✓ Backed up ${dbPath} → ${dest}`);

  const old = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".db"))
    .sort()
    .reverse()
    .slice(KEEP);
  for (const f of old) fs.rmSync(path.join(dir, f));
}

main().catch((e) => {
  console.error("✗ Database backup failed:", e);
  process.exit(1);
});
