"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, CalendarClock, CalendarDays, Briefcase, History, LayoutDashboard, LogOut, Menu, Settings, UserCog, Users, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV = {
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/dashboard/clients", label: "Clients", icon: Users },
    { href: "/dashboard/staff", label: "Staff", icon: UserCog },
    { href: "/dashboard/services", label: "Services", icon: Briefcase },
    { href: "/dashboard/availability", label: "Availability", icon: CalendarClock },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    { href: "/dashboard/audit", label: "Audit log", icon: History },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  staff: [
    { href: "/staff", label: "My bookings", icon: CalendarDays },
    { href: "/staff/schedule", label: "My hours", icon: CalendarClock },
  ],
};

export default function Sidebar({ adminName, adminEmail, portal = "admin" }: { adminName: string; adminEmail: string; portal?: "admin" | "staff" }) {
  const home = portal === "admin" ? "/dashboard" : "/staff";
  const badge = portal === "admin" ? "Admin" : "Staff";
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === home ? pathname === href || (portal === "staff" && pathname.startsWith("/staff/bookings")) : pathname.startsWith(href));

  async function signOut() {
    await authClient.signOut();
    router.push("/dashboard/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#2B6F6F] px-4 py-3 text-white lg:hidden">
        <span className="font-bold">ALCHEMETANOIA {badge}</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded p-1 hover:bg-white/10">
          <Menu size={22} />
        </button>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-[#43A3A3] to-[#2B6F6F] text-white shadow-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <Link href={home} className="text-xl font-extrabold tracking-wide">
            ALCHEMETANOIA
            <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider">{badge}</span>
          </Link>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded p-1 hover:bg-white/10 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {NAV[portal].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition",
                isActive(href) ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 px-4 py-4">
          <p className="truncate text-sm font-semibold">{adminName}</p>
          <p className="truncate text-xs text-white/70">{adminEmail}</p>
          <div className="mt-3 flex gap-2">
            <Link href="/" className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center text-xs font-medium hover:bg-white/20">
              View site
            </Link>
            <button onClick={signOut} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/20">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
