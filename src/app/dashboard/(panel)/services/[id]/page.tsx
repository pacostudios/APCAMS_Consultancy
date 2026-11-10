import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { service } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, PageHeader } from "../../_components/ui";
import { deleteServiceAction, updateServiceAction } from "../actions";
import ServiceFields from "../_components/ServiceFields";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const s = db.select().from(service).where(eq(service.id, Number((await params).id))).get();
  if (!s) notFound();

  return (
    <>
      <Link href="/dashboard/services" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} /> Services
      </Link>
      <PageHeader title={s.name} />
      <div className="max-w-3xl space-y-6">
        <Card>
          <ActionForm action={updateServiceAction} className="space-y-6">
            <input type="hidden" name="id" value={s.id} />
            <ServiceFields service={s} />
            <div className="flex justify-end"><SubmitButton>Save changes</SubmitButton></div>
          </ActionForm>
        </Card>
        <Card title="Delete service">
          <p className="mb-4 text-sm text-slate-500">Only services with no bookings can be deleted. To stop new bookings, untick “Active” instead.</p>
          <ActionForm action={deleteServiceAction}>
            <input type="hidden" name="id" value={s.id} />
            <SubmitButton variant="danger" confirm={`Delete ${s.name}?`}>Delete service</SubmitButton>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
