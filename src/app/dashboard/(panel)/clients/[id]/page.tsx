import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { booking, client } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { formatAUD, formatDate } from "@/lib/format";
import { listBookings } from "../../_lib/queries";
import BookingTable from "../../_components/BookingTable";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, EmptyState, PageHeader, buttonClass } from "../../_components/ui";
import { deleteClientAction, updateClientAction } from "../actions";
import ClientFields from "../_components/ClientFields";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  const c = db.select().from(client).where(eq(client.id, id)).get();
  if (!c) notFound();

  const bookings = listBookings({ where: eq(booking.clientId, id), order: "desc" });
  const paid = bookings.filter((b) => b.paymentStatus === "paid").reduce((t, b) => t + b.priceCents, 0);
  const attended = bookings.filter((b) => b.status === "completed").length;

  return (
    <>
      <Link href="/dashboard/clients" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} /> Clients
      </Link>
      <PageHeader
        title={c.name}
        description={`Client since ${formatDate(c.createdAt)} · ${bookings.length} bookings · ${attended} attended · ${formatAUD(paid)} paid`}
        actions={<Link href={`/dashboard/bookings/new?client=${c.id}`} className={buttonClass.primary}>New booking</Link>}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card title="Booking history" className="xl:col-span-3">
          {bookings.length ? (
            <div className="-mx-5 -my-5"><BookingTable rows={bookings} /></div>
          ) : (
            <EmptyState message="No bookings yet." />
          )}
        </Card>

        <div className="space-y-6 xl:col-span-2">
          <Card title="Details">
            <ActionForm action={updateClientAction} className="space-y-6">
              <input type="hidden" name="id" value={c.id} />
              <ClientFields client={c} />
              <div className="flex justify-end"><SubmitButton>Save</SubmitButton></div>
            </ActionForm>
          </Card>

          {bookings.length === 0 && (
            <Card title="Danger zone">
              <ActionForm action={deleteClientAction}>
                <input type="hidden" name="id" value={c.id} />
                <SubmitButton variant="danger" confirm={`Delete ${c.name}? This can't be undone.`}>Delete client</SubmitButton>
              </ActionForm>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
