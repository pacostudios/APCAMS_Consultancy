import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// All timestamps are stored as UTC epoch milliseconds.
// Money is stored as integer cents (AUD).

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
};

/* ---------------------------------------------------------------- */
/* Better Auth tables                                                */
/* ---------------------------------------------------------------- */

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role", { enum: ["client", "admin"] }).notNull().default("client"),
  ...timestamps,
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  ...timestamps,
});

/* ---------------------------------------------------------------- */
/* App tables                                                        */
/* ---------------------------------------------------------------- */

export const service = sqliteTable("service", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary"),
  priceCents: integer("price_cents").notNull().default(0),
  durationMins: integer("duration_mins").notNull().default(60),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

/** A person who books. Guests get a row too; `userId` links it once they register. */
export const client = sqliteTable(
  "client",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .unique()
      .references(() => user.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").unique(),
    phone: text("phone"),
    address: text("address"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [index("client_phone_idx").on(t.phone)],
);

/** Weekly working hours, in the business timezone. Several rows per day allow split shifts. */
export const availability = sqliteTable("availability", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekday: integer("weekday").notNull(), // 0 = Sunday … 6 = Saturday
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "17:00"
});

/** Whole days the business is closed (holidays, leave). */
export const blockedDate = sqliteTable("blocked_date", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(), // "YYYY-MM-DD" in the business timezone
  reason: text("reason"),
});

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const;
export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;
export const BOOKING_MODES = ["in_person", "online"] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type BookingMode = (typeof BOOKING_MODES)[number];

export const booking = sqliteTable(
  "booking",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reference: text("reference").notNull().unique(),
    clientId: integer("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "restrict" }),
    serviceId: integer("service_id")
      .notNull()
      .references(() => service.id, { onDelete: "restrict" }),
    startsAt: integer("starts_at", { mode: "timestamp_ms" }).notNull(),
    endsAt: integer("ends_at", { mode: "timestamp_ms" }).notNull(),
    status: text("status", { enum: BOOKING_STATUSES }).notNull().default("pending"),
    mode: text("mode", { enum: BOOKING_MODES }).notNull().default("in_person"),
    // Price is copied from the service at booking time so later price changes don't rewrite history.
    priceCents: integer("price_cents").notNull(),
    paymentStatus: text("payment_status", { enum: PAYMENT_STATUSES }).notNull().default("unpaid"),
    meetingUrl: text("meeting_url"),
    clientNotes: text("client_notes"),
    adminNotes: text("admin_notes"),
    reminderSentAt: integer("reminder_sent_at", { mode: "timestamp_ms" }),
    ...timestamps,
  },
  (t) => [
    // Single consultant: no two active bookings may start at the same moment.
    uniqueIndex("booking_active_start_uq").on(t.startsAt).where(sql`status <> 'cancelled'`),
    index("booking_starts_idx").on(t.startsAt),
    index("booking_client_idx").on(t.clientId),
    index("booking_status_idx").on(t.status),
  ],
);

export type Service = typeof service.$inferSelect;
export type Client = typeof client.$inferSelect;
export type Booking = typeof booking.$inferSelect;
