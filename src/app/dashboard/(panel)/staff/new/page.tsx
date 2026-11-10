import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { service } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, PageHeader, buttonClass } from "../../_components/ui";
import StaffFields from "../_components/StaffFields";
import { createStaffAction } from "../actions";

export default async function NewStaffPage() {
  await requireAdmin();
  const services = db.select({ id: service.id, name: service.name, active: service.active }).from(service).orderBy(asc(service.sortOrder)).all();

  return (
    <>
      <PageHeader
        title="Add staff"
        description="Creates their sign-in for the staff portal. Their weekly hours start as the default hours; adjust them on the next page."
        actions={<Link href="/dashboard/staff" className={buttonClass.secondary}>Cancel</Link>}
      />
      <Card className="max-w-3xl">
        <ActionForm action={createStaffAction} className="space-y-6">
          <StaffFields services={services} withPassword />
          <div className="flex justify-end"><SubmitButton>Add staff member</SubmitButton></div>
        </ActionForm>
      </Card>
    </>
  );
}
