import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/** Returns the signed-in admin, or redirects to the login page. Call at the top of every admin page and action. */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/dashboard/login");
  if (session.user.role !== "admin") redirect("/dashboard/login?error=forbidden");
  return session.user;
}
