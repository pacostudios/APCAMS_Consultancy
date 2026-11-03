import "server-only";
import { db } from "@/db";
import { auditLog, type AuditAction, type UserRole } from "@/db/schema";

/** Whoever is making a change: a signed-in user, or the system itself (e.g. a Stripe webhook). */
export type Actor = { userId: string | null; name: string; role: UserRole | "system" };

export const SYSTEM_ACTOR: Actor = { userId: null, name: "System", role: "system" };

export const actorFrom = (u: { id: string; name: string; role?: string | null }): Actor => ({
  userId: u.id,
  name: u.name,
  role: (u.role as UserRole) ?? "client",
});

/** Appends one entry to the audit log. Synchronous, so it can run inside a booking transaction. */
export function logAudit(entry: {
  actor: Actor;
  action: AuditAction;
  summary: string;
  bookingId?: number | null;
  staffId?: number | null;
  details?: Record<string, unknown>;
}) {
  db.insert(auditLog)
    .values({
      bookingId: entry.bookingId ?? null,
      staffId: entry.staffId ?? null,
      actorUserId: entry.actor.userId,
      actorName: entry.actor.name,
      actorRole: entry.actor.role,
      action: entry.action,
      summary: entry.summary,
      details: entry.details ?? null,
    })
    .run();
}
