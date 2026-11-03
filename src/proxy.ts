import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fast, optimistic gate: bounce visitors with no session cookie.
// The real checks happen in requireAdmin() (admin role), requireStaff() (staff role) and requireUser() (verified customer).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/dashboard/login") || getSessionCookie(request)) return NextResponse.next();

  if (pathname.startsWith("/account")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.redirect(new URL("/dashboard/login", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/staff/:path*", "/account/:path*"],
};
