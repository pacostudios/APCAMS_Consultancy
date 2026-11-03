import { NextResponse, type NextRequest } from "next/server";
import { fulfilCheckout } from "@/lib/payments";

export const dynamic = "force-dynamic";

/** Stripe sends the customer here after paying. Confirm straight away rather than waiting for the webhook. */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url), 303);
  if (!sessionId) return to("/account");

  try {
    const { outcome, reference } = await fulfilCheckout(sessionId);
    if (outcome === "refunded") return to("/account?payment=refunded");
    if (outcome === "unpaid") return to("/account?payment=processing");
    return to(reference ? `/account?booked=${encodeURIComponent(reference)}` : "/account");
  } catch (e) {
    console.error("[payments] Success redirect could not confirm the booking:", e);
    // The webhook will still confirm it; tell the customer it's being processed.
    return to("/account?payment=processing");
  }
}
