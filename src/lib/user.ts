import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/** The signed-in user (any role), or null. */
export async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** Returns the signed-in, email-verified user, or sends them to log in and come back to `next`. */
export async function requireUser(next = "/account") {
  const user = await getUser();
  if (!user || !user.emailVerified) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
