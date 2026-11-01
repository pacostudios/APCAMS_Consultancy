import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, PageHeader, buttonClass } from "../../_components/ui";
import { createClientAction } from "../actions";
import ClientFields from "../_components/ClientFields";

export default async function NewClientPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add client" actions={<Link href="/dashboard/clients" className={buttonClass.secondary}>Cancel</Link>} />
      <Card className="max-w-3xl">
        <ActionForm action={createClientAction} className="space-y-6">
          <ClientFields />
          <div className="flex justify-end"><SubmitButton>Add client</SubmitButton></div>
        </ActionForm>
      </Card>
    </>
  );
}
