"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { booking } from "@/db/schema";
import { actorFrom } from "@/lib/audit";
import { clientForUser, setBookingStatus, syncZoomMeeting } from "@/lib/bookings";
import { BUSINESS } from "@/lib/config";
import { fulfilCheckout, refundBooking, releaseCheckout, stripe } from "@/lib/payments";
import { notifyStaff } from "@/lib/staff";
import { requireUser } from "@/lib/user";

async function myBooking(formData: FormData) {
  const user = await requireUser();
  const me = clientForUser(user);
  const id = Number(formData.get("id"));
  return db.select().from(booking).where(and(eq(booking.id, id), eq(booking.clientId, me.id))).get();
}

function refresh() {
  revalidatePath("/account");
  revalidatePath("/dashboard", "layout");
}

/**
 * A customer cancels one of their own sessions. Unpaid holds can always be dropped; paid sessions
 * need the notice period and are refunded in full.
 */
export async function cancelMyBookingAction(formData: FormData) {
  const b = await myBooking(formData);
  if (!b || (b.status !== "pending" && b.status !== "confirmed")) return;

  if (b.paymentStatus === "unpaid" && b.stripeCheckoutSessionId) {
    await releaseCheckout(b.stripeCheckoutSessionId);
    return refresh();
  }

  if (b.startsAt.getTime() - Date.now() < BUSINESS.cancelNoticeHours * 3_600_000) return;

  if (b.paymentStatus === "paid") {
    try {
      await refundBooking(b.id);
    } catch (e) {
      console.error(`[payments] Refund for booking ${b.id} failed:`, e);
      redirect("/account?cancel=failed"); // keep the booking; nothing was changed
    }
  }

  if ("error" in setBookingStatus(b.id, "cancelled", actorFrom(await requireUser()))) return refresh();
  await syncZoomMeeting(b.id);
  await notifyStaff(b.id, "cancelled");
  refresh();
}

/** Back to Stripe Checkout for a booking whose payment wasn't finished. */
export async function resumePaymentAction(formData: FormData) {
  const b = await myBooking(formData);
  if (!b?.stripeCheckoutSessionId || b.status !== "pending" || b.paymentStatus !== "unpaid") return refresh();

  const session = await stripe().checkout.sessions.retrieve(b.stripeCheckoutSessionId);
  if (session.status === "open" && session.url) redirect(session.url);

  // Paid but not yet recorded (webhook pending): confirm it now. Otherwise it has expired: free the slot.
  if (session.payment_status === "paid") await fulfilCheckout(b.stripeCheckoutSessionId);
  else await releaseCheckout(b.stripeCheckoutSessionId);
  refresh();
}
