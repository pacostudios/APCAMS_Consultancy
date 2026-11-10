import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");

function createConnection() {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL"); // concurrent reads while writing
  sqlite.pragma("busy_timeout = 5000"); // wait instead of failing on a locked write
  sqlite.pragma("synchronous = NORMAL"); // safe with WAL, much faster
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { db?: ReturnType<typeof createConnection> };

export const db = globalForDb.db ?? createConnection();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export { schema };
