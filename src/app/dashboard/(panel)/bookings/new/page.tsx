import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { client, service } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { zoneLabel } from "@/lib/format";
import { Card, EmptyState, PageHeader, buttonClass } from "../../_components/ui";
import NewBookingForm from "../_components/NewBookingForm";

export const dynamic = "force-dynamic";

export default async function NewBookingPage({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  await requireAdmin();
  const { client: clientParam } = await searchParams;

  const clients = db.select({ id: client.id, name: client.name, email: client.email, phone: client.phone })
    .from(client).orderBy(asc(client.name)).all();
  const services = db.select({ id: service.id, name: service.name, priceCents: service.priceCents, durationMins: service.durationMins })
    .from(service).where(eq(service.active, true)).orderBy(asc(service.sortOrder)).all();

  return (
    <>
      <PageHeader
        title="New booking"
        description={`For phone or walk-in bookings. Times are in ${zoneLabel()}.`}
        actions={<Link href="/dashboard/bookings" className={buttonClass.secondary}>Cancel</Link>}
      />
      <Card className="max-w-3xl">
        {services.length ? (
          <NewBookingForm clients={clients} services={services} defaultClientId={Number(clientParam) || undefined} />
        ) : (
          <EmptyState
            message="Add an active service before creating bookings."
            action={<Link href="/dashboard/services/new" className={buttonClass.primary}>Add service</Link>}
          />
        )}
      </Card>
    </>
  );
}
