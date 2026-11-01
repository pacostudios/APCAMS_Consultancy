import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fast, optimistic gate: bounce visitors with no session cookie.
// The real check (valid session + admin role) happens in requireAdmin().
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard/login")) return NextResponse.next();

  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
