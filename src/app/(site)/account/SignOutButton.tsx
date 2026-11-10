"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:border-teal-600 hover:text-teal-600 transition-colors"
    >
      <LogOut size={14} /> Sign out
    </button>
  );
}
