import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import Sidebar from "./_components/Sidebar";

export const metadata: Metadata = {
  title: "Admin · Alchemetanoia",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-dm-sans)] lg:flex">
      <Sidebar adminName={admin.name} adminEmail={admin.email} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
