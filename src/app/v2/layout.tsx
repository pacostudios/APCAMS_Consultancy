"use client";

import React from "react";
import V2Navbar from "./components/Navbar";
import V2Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { usePathname } from "next/navigation";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Force solid navbar for service detail pages
  const isServiceDetailPage = pathname.startsWith("/v2/service/");

  return (
    <div className="v2-redesign min-h-screen flex flex-col font-[family-name:var(--font-dm-sans)]">
      <ScrollToTop />
      <V2Navbar forceSolid={isServiceDetailPage} />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <V2Footer />
    </div>
  );
}
