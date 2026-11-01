import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, PageHeader, buttonClass } from "../../_components/ui";
import { createServiceAction } from "../actions";
import ServiceFields from "../_components/ServiceFields";

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add service" actions={<Link href="/dashboard/services" className={buttonClass.secondary}>Cancel</Link>} />
      <Card className="max-w-3xl">
        <ActionForm action={createServiceAction} className="space-y-6">
          <ServiceFields />
          <div className="flex justify-end"><SubmitButton>Add service</SubmitButton></div>
        </ActionForm>
      </Card>
    </>
  );
}
