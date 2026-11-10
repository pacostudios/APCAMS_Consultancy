import { getSiteSetting, toTelHref } from "@/lib/site-settings";
import HomePage from "./HomePage";

// Re-rendered on each request so a hotline number saved in Dashboard → Settings shows straight away.
export const dynamic = "force-dynamic";

export default function Page() {
  const hotlinePhone = getSiteSetting("suicideHotlinePhone");
  return <HomePage hotlinePhone={hotlinePhone} hotlineTel={toTelHref(hotlinePhone)} />;
}
