/** Applies pending SQL migrations from ./drizzle. Run on every deploy: `npm run db:migrate`. */
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "../src/db";

migrate(db, { migrationsFolder: "./drizzle" });
console.log("✓ Database migrated");
