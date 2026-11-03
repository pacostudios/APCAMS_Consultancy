import { NextResponse, type NextRequest } from "next/server";
import { releaseCheckout } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Customer pressed "back" on Stripe Checkout: free their held slot immediately. */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (sessionId) await releaseCheckout(sessionId);
  return NextResponse.redirect(new URL("/book_appointment?payment=cancelled", request.url), 303);
}
