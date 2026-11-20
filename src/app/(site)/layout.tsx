import React from "react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { getLang } from "@/i18n/server";
import SiteShell from "./SiteShell";

// Reads the visitor's language cookie so pages are rendered in their language from the first paint.
export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <LanguageProvider initialLang={lang}>
      <SiteShell>{children}</SiteShell>
    </LanguageProvider>
  );
}
