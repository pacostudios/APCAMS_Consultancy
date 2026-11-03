import { requireAdmin } from "@/lib/admin";
import { SITE_SETTING_DEFAULTS, getSiteSetting } from "@/lib/site-settings";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, Field, PageHeader, inputClass } from "../_components/ui";
import { saveHotlineAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const hotline = getSiteSetting("suicideHotlinePhone");

  return (
    <>
      <PageHeader title="Settings" description="Content on the public website that you can change here." />
      <div className="max-w-xl">
        <Card title="Suicide prevention hotline">
          <ActionForm action={saveHotlineAction} className="space-y-4">
            <Field
              label="Phone number"
              htmlFor="suicideHotlinePhone"
              hint={`Shown in the red hotline section on the home page; tapping it opens the phone's dialler. Default: ${SITE_SETTING_DEFAULTS.suicideHotlinePhone}. Include the country code for overseas numbers.`}
            >
              <input id="suicideHotlinePhone" name="suicideHotlinePhone" type="tel" defaultValue={hotline} required className={inputClass} />
            </Field>
            <div className="flex justify-end"><SubmitButton>Save number</SubmitButton></div>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
