"use client";

import React from "react";
import V2Navbar from "./components/Navbar";
import V2Footer from "./components/Footer";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2-redesign min-h-screen flex flex-col font-[family-name:var(--font-dm-sans)]">
      <V2Navbar />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <V2Footer />
    </div>
  );
}
