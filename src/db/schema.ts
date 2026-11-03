import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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

export const USER_ROLES = ["client", "staff", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/* ---------------------------------------------------------------- */
/* Better Auth tables                                                */
/* ---------------------------------------------------------------- */

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role", { enum: USER_ROLES }).notNull().default("client"),
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

export type ServiceDimension = { name: string; focus: string; method: string };

export const service = sqliteTable("service", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary"), // short text for cards (home, services page)
  // Content of the public service page.
  tagline: text("tagline"),
  description: text("description"),
  includes: text("includes", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  dimensions: text("dimensions", { mode: "json" }).$type<ServiceDimension[]>().notNull().default(sql`'[]'`),
  icon: text("icon").notNull().default("Sparkles"), // a name from SERVICE_ICONS
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  emergencySupport: integer("emergency_support", { mode: "boolean" }).notNull().default(false),
  showOnHome: integer("show_on_home", { mode: "boolean" }).notNull().default(false),
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

/** A practitioner who delivers services. Name, email and password live on the linked `user` (role "staff"). */
export const staff = sqliteTable("staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "restrict" }),
  title: text("title"), // e.g. "Clinical Psychologist"
  phone: text("phone"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

/** Which services each staff member provides. */
export const staffService = sqliteTable(
  "staff_service",
  {
    staffId: integer("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    serviceId: integer("service_id")
      .notNull()
      .references(() => service.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.staffId, t.serviceId] }), index("staff_service_service_idx").on(t.serviceId)],
);

/** A staff member's weekly working hours, in the business timezone. Several rows per day allow split shifts. */
export const staffHours = sqliteTable(
  "staff_hours",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    staffId: integer("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(), // 0 = Sunday … 6 = Saturday
    startTime: text("start_time").notNull(), // "09:00"
    endTime: text("end_time").notNull(), // "17:00"
  },
  (t) => [index("staff_hours_staff_idx").on(t.staffId)],
);

/** Whole days one staff member is away. Business-wide closures are in `blocked_date`. */
export const staffTimeOff = sqliteTable(
  "staff_time_off",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    staffId: integer("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // "YYYY-MM-DD" in the business timezone
    reason: text("reason"),
  },
  (t) => [uniqueIndex("staff_time_off_uq").on(t.staffId, t.date)],
);

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
    // Who delivers the session. Null only for bookings made before staff were introduced.
    staffId: integer("staff_id").references(() => staff.id, { onDelete: "restrict" }),
    startsAt: integer("starts_at", { mode: "timestamp_ms" }).notNull(),
    endsAt: integer("ends_at", { mode: "timestamp_ms" }).notNull(),
    status: text("status", { enum: BOOKING_STATUSES }).notNull().default("pending"),
    mode: text("mode", { enum: BOOKING_MODES }).notNull().default("in_person"),
    // Price is copied from the service at booking time so later price changes don't rewrite history.
    priceCents: integer("price_cents").notNull(),
    paymentStatus: text("payment_status", { enum: PAYMENT_STATUSES }).notNull().default("unpaid"),
    // Online bookings: the slot is held as "pending" until this time while the customer pays on Stripe.
    holdExpiresAt: integer("hold_expires_at", { mode: "timestamp_ms" }),
    stripeCheckoutSessionId: text("stripe_checkout_session_id").unique(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    // Payment record, copied from Stripe when the payment succeeds.
    amountPaidCents: integer("amount_paid_cents"),
    paidAt: integer("paid_at", { mode: "timestamp_ms" }),
    paymentMethod: text("payment_method"), // e.g. "Visa •••• 4242" or "Apple Pay · Visa •••• 4242"
    receiptUrl: text("receipt_url"),
    refundedAt: integer("refunded_at", { mode: "timestamp_ms" }),
    meetingUrl: text("meeting_url"),
    // Set when the meeting was created through the Zoom API, so it can be moved or deleted with the booking.
    zoomMeetingId: text("zoom_meeting_id"),
    clientNotes: text("client_notes"),
    adminNotes: text("admin_notes"),
    reminderSentAt: integer("reminder_sent_at", { mode: "timestamp_ms" }),
    ...timestamps,
  },
  (t) => [
    // One staff member can't have two active bookings starting at the same moment.
    uniqueIndex("booking_staff_start_uq").on(t.staffId, t.startsAt).where(sql`status <> 'cancelled'`),
    index("booking_staff_idx").on(t.staffId),
    index("booking_starts_idx").on(t.startsAt),
    index("booking_client_idx").on(t.clientId),
    index("booking_status_idx").on(t.status),
  ],
);

export const AUDIT_ACTIONS = [
  "created",
  "status_changed",
  "rescheduled",
  "reassigned",
  "updated",
  "refunded",
  "staff_created",
  "staff_updated",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/** Append-only record of who changed what, shown to admins. */
export const auditLog = sqliteTable(
  "audit_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bookingId: integer("booking_id").references(() => booking.id, { onDelete: "set null" }),
    // The staff member the event concerns (the booking's staff, or the staff profile that was edited).
    staffId: integer("staff_id").references(() => staff.id, { onDelete: "set null" }),
    actorUserId: text("actor_user_id").references(() => user.id, { onDelete: "set null" }),
    // Copied at write time so the log still reads correctly after accounts change or go.
    actorName: text("actor_name").notNull(),
    actorRole: text("actor_role", { enum: [...USER_ROLES, "system"] }).notNull(),
    action: text("action", { enum: AUDIT_ACTIONS }).notNull(),
    summary: text("summary").notNull(),
    details: text("details", { mode: "json" }).$type<Record<string, unknown>>(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("audit_booking_idx").on(t.bookingId),
    index("audit_staff_idx").on(t.staffId),
    index("audit_created_idx").on(t.createdAt),
  ],
);

/** Editable images on the public pages, keyed by slot (see SITE_IMAGE_SLOTS). Missing rows use the built-in default. */
export const siteImage = sqliteTable("site_image", {
  key: text("key").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt"),
  ...timestamps,
});

/** Admin-editable site settings as key/value pairs (see src/lib/site-settings.ts). Missing rows use the default. */
export const siteSetting = sqliteTable("site_setting", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  ...timestamps,
});

export type Service = typeof service.$inferSelect;
export type Client = typeof client.$inferSelect;
export type Booking = typeof booking.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type AuditEntry = typeof auditLog.$inferSelect;
