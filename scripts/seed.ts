/**
 * Seeds the database.
 *
 *   npm run seed            → admin user, services, default working hours (safe to re-run)
 *   npm run seed -- --demo  → also adds demo staff, clients and bookings for trying the dashboard
 *
 * Admin credentials come from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME.
 */
import { randomBytes, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { fromZonedTime } from "date-fns-tz";
import { db } from "../src/db";
import { account, availability, booking, client, service, staff, staffHours, staffService, user } from "../src/db/schema";
import { HOME_SERVICES, SERVICE_CONTENT, SERVICE_SUMMARIES } from "./service-content";

const TZ = process.env.BUSINESS_TIMEZONE ?? "Australia/Sydney";

const SERVICES = [
  { slug: "psychotherapy", name: "Psychotherapy", summary: "Science-backed clinical healing.", priceCents: 18000, durationMins: 60 },
  { slug: "counselling-services", name: "Counselling Services", summary: "Supportive one-on-one counselling.", priceCents: 15000, durationMins: 60 },
  { slug: "meditation-programs", name: "Meditation Programs", summary: "Guided meditation and mindfulness.", priceCents: 9000, durationMins: 60 },
  { slug: "personal-growth", name: "Personal Growth", summary: "Coaching for purpose and direction.", priceCents: 14000, durationMins: 60 },
  { slug: "addiction-support", name: "Addiction Recovery Support", summary: "Structured recovery support.", priceCents: 16000, durationMins: 60 },
  { slug: "healing-recovery", name: "Healing & Recovery", summary: "Trauma-informed healing work.", priceCents: 16000, durationMins: 60 },
  { slug: "mediation", name: "Mediation & Out-of-Court Settlement", summary: "Facilitated dispute resolution.", priceCents: 25000, durationMins: 90 },
  { slug: "residential-couples-therapy", name: "Residential Couples Therapy", summary: "Intensive therapy for couples.", priceCents: 30000, durationMins: 120 },
];

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@alchemetanoia.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Alchemetanoia Admin";

  const existing = db.select().from(user).where(eq(user.email, email)).get();
  if (existing) {
    if (existing.role !== "admin") db.update(user).set({ role: "admin" }).where(eq(user.id, existing.id)).run();
    console.log(`✓ Admin exists: ${email}`);
    return;
  }
  if (!password || password.length < 8) {
    throw new Error("Set ADMIN_PASSWORD (min 8 chars) in .env.local before seeding.");
  }

  const id = randomUUID();
  db.insert(user).values({ id, name, email, emailVerified: true, role: "admin" }).run();
  db.insert(account)
    .values({ id: randomUUID(), accountId: id, providerId: "credential", userId: id, password: await hashPassword(password) })
    .run();
  console.log(`✓ Admin created: ${email}`);
}

function seedServices() {
  SERVICES.forEach((s, i) => {
    db.insert(service).values({ ...s, sortOrder: i }).onConflictDoNothing({ target: service.slug }).run();
  });

  // Fill page content (only where it's still empty, so edits made in the dashboard are kept).
  let filled = 0;
  for (const [slug, c] of Object.entries(SERVICE_CONTENT)) {
    const row = db.select().from(service).where(eq(service.slug, slug)).get();
    if (!row || row.tagline) continue;
    db.update(service)
      .set({
        summary: SERVICE_SUMMARIES[slug] ?? row.summary,
        tagline: c.tagline,
        description: c.description,
        includes: c.includes,
        dimensions: c.dimensions,
        icon: c.icon,
        imageUrl: c.image,
        imageAlt: c.imageAlt,
        emergencySupport: Boolean(c.emergencySupport),
        showOnHome: HOME_SERVICES.includes(slug),
        sortOrder: HOME_SERVICES.includes(slug) ? HOME_SERVICES.indexOf(slug) : row.sortOrder + 10,
      })
      .where(eq(service.id, row.id))
      .run();
    filled++;
  }
  console.log(`✓ Services: ${SERVICES.length}${filled ? ` (page content filled for ${filled})` : ""}`);
}

function seedAvailability() {
  if (db.select().from(availability).get()) return console.log("✓ Availability exists, skipped");
  // Mon–Fri 9:00–17:00, Sat 10:00–14:00
  const rows = [1, 2, 3, 4, 5].map((weekday) => ({ weekday, startTime: "09:00", endTime: "17:00" }));
  rows.push({ weekday: 6, startTime: "10:00", endTime: "14:00" });
  db.insert(availability).values(rows).run();
  console.log("✓ Default working hours: Mon–Fri 9–5, Sat 10–2");
}

const DEMO_STAFF_PASSWORD = "demo-staff-123";

/** Two demo practitioners splitting the services, with the default hours. Returns serviceId → staff ids. */
async function seedDemoStaff() {
  const people = [
    { name: "Dr Sarah Mitchell", email: "sarah@example.com", title: "Clinical Psychologist" },
    { name: "Daniel Chen", email: "daniel@example.com", title: "Counsellor & Mediator" },
  ];
  const services = db.select().from(service).all();
  const hours = db.select().from(availability).all();
  const byService = new Map<number, number[]>();

  for (const [i, p] of people.entries()) {
    let row = db.select({ id: staff.id }).from(staff).innerJoin(user, eq(user.id, staff.userId)).where(eq(user.email, p.email)).get();
    if (!row) {
      const id = randomUUID();
      db.insert(user).values({ id, name: p.name, email: p.email, emailVerified: true, role: "staff" }).run();
      db.insert(account)
        .values({ id: randomUUID(), accountId: id, providerId: "credential", userId: id, password: await hashPassword(DEMO_STAFF_PASSWORD) })
        .run();
      row = db.insert(staff).values({ userId: id, title: p.title }).returning({ id: staff.id }).get();
      // Each takes every other service; the first two services are shared so auto-assign has a choice.
      const mine = services.filter((s, n) => n < 2 || n % 2 === i);
      db.insert(staffService).values(mine.map((s) => ({ staffId: row!.id, serviceId: s.id }))).run();
      if (hours.length) db.insert(staffHours).values(hours.map((h) => ({ staffId: row!.id, weekday: h.weekday, startTime: h.startTime, endTime: h.endTime }))).run();
    }
    for (const link of db.select().from(staffService).where(eq(staffService.staffId, row.id)).all()) {
      byService.set(link.serviceId, [...(byService.get(link.serviceId) ?? []), row.id]);
    }
  }
  console.log(`✓ Demo staff: ${people.map((p) => p.email).join(", ")} (password ${DEMO_STAFF_PASSWORD})`);
  return byService;
}

async function seedDemo() {
  const staffByService = await seedDemoStaff();
  if (db.select().from(booking).get()) return console.log("✓ Bookings exist, demo skipped");

  const names = [
    "Olivia Smith", "Jack Wilson", "Charlotte Brown", "Noah Taylor", "Amelia Jones",
    "William Nguyen", "Isla Martin", "Thomas Lee", "Mia Anderson", "Lucas White",
    "Grace Thompson", "Henry Walker",
  ];
  const clients = names.map((name, i) =>
    db.insert(client)
      .values({
        name,
        email: name.toLowerCase().replace(" ", ".") + "@example.com",
        phone: `04${String(12345678 + i * 1111).slice(0, 8)}`,
        address: ["Sydney NSW", "Parramatta NSW", "Melbourne VIC", "Brisbane QLD"][i % 4],
      })
      .returning()
      .get(),
  );
  const services = db.select().from(service).all();

  const today = new Date();
  let created = 0;
  // ~4 months back, ~3 weeks ahead
  for (let dayOffset = -120; dayOffset <= 21; dayOffset++) {
    const d = new Date(today.getTime() + dayOffset * 86_400_000);
    const weekday = d.getDay();
    if (weekday === 0) continue;
    const perDay = (dayOffset + 300) % 3; // 0–2 bookings a day
    for (let n = 0; n < perDay; n++) {
      const hour = [10, 14, 11][n];
      const dateKey = d.toLocaleDateString("en-CA", { timeZone: TZ });
      const startsAt = fromZonedTime(`${dateKey}T${String(hour).padStart(2, "0")}:00:00`, TZ);
      const svc = services[(dayOffset + 120 + n * 3) % services.length];
      const c = clients[(dayOffset + 120 + n * 5) % clients.length];
      const past = startsAt < today;
      const roll = (dayOffset + 200 + n) % 10;
      const status = past
        ? roll === 0 ? "cancelled" : roll === 1 ? "no_show" : "completed"
        : roll < 3 ? "pending" : "confirmed";
      const candidates = staffByService.get(svc.id) ?? [];
      db.insert(booking)
        .values({
          reference: "APC-" + randomBytes(3).toString("hex").toUpperCase(),
          clientId: c.id,
          serviceId: svc.id,
          staffId: candidates.length ? candidates[(dayOffset + 120 + n) % candidates.length] : null,
          startsAt,
          endsAt: new Date(startsAt.getTime() + svc.durationMins * 60_000),
          status,
          mode: roll % 2 ? "online" : "in_person",
          priceCents: svc.priceCents,
          paymentStatus: status === "completed" ? "paid" : status === "confirmed" && roll > 5 ? "paid" : "unpaid",
        })
        .onConflictDoNothing()
        .run();
      created++;
    }
  }
  console.log(`✓ Demo data: ${clients.length} clients, ${created} bookings`);
}

async function main() {
  await seedAdmin();
  seedServices();
  seedAvailability();
  if (process.argv.includes("--demo")) await seedDemo();
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});
