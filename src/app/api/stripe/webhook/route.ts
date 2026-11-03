import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { fulfilCheckout, releaseCheckout, stripe } from "@/lib/payments";

export const dynamic = "force-dynamic";

/**
 * Stripe → us. Confirms bookings even if the customer closed the tab before returning to the site.
 * Register in Stripe (Developers → Webhooks) with the events below, and put its signing secret in STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (e) {
    console.error("[stripe] Webhook signature check failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const { outcome, reference } = await fulfilCheckout(event.data.object.id);
        console.log(`[stripe] ${event.type} ${reference}: ${outcome}`);
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        await releaseCheckout(event.data.object.id);
        break;
    }
  } catch (e) {
    console.error(`[stripe] Handling ${event.type} failed:`, e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 }); // Stripe retries
  }
  return NextResponse.json({ received: true });
}
