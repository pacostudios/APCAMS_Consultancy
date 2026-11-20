"use client";

import React from "react";
import V2Navbar from "./components/Navbar";
import V2Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/LanguageProvider";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lang } = useI18n();
  // Force solid navbar for service detail pages
  const isServiceDetailPage = pathname.startsWith("/service/");

  return (
    <div lang={lang} className="v2-redesign min-h-screen flex flex-col font-[family-name:var(--font-dm-sans)]">
      <ScrollToTop />
      <V2Navbar forceSolid={isServiceDetailPage} />
      <main className="flex-grow">
        {children}
      </main>
      <V2Footer />
    </div>
  );
}
