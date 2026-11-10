import "server-only";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { staff } from "@/db/schema";
import { auth } from "./auth";

/** Returns the signed-in admin, or redirects to the login page. Call at the top of every admin page and action. */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/dashboard/login");
  if (session.user.role === "staff") redirect("/staff");
  if (session.user.role !== "admin") redirect("/dashboard/login?error=forbidden");
  return session.user;
}

/**
 * Returns the signed-in staff member (their user and staff profile), or redirects.
 * Call at the top of every staff page and action.
 */
export async function requireStaff() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/dashboard/login");
  if (session.user.role === "admin") redirect("/dashboard");
  const member = session.user.role === "staff" ? db.select().from(staff).where(eq(staff.userId, session.user.id)).get() : undefined;
  if (!member) redirect("/dashboard/login?error=forbidden");
  if (!member.active) redirect("/dashboard/login?error=inactive");
  return { user: session.user, staff: member };
}
