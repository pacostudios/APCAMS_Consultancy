import type { Metadata } from "next";
import { requireStaff } from "@/lib/admin";
import Sidebar from "@/app/dashboard/(panel)/_components/Sidebar";

export const metadata: Metadata = {
  title: "Staff · APCAMS",
  robots: { index: false, follow: false },
};

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireStaff();

  return (
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-dm-sans)] lg:flex">
      <Sidebar adminName={user.name} adminEmail={user.email} portal="staff" />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
