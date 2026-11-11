"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const reason = useSearchParams().get("error");
  const [error, setError] = useState(
    reason === "forbidden" ? "This account doesn't have admin or staff access."
      : reason === "inactive" ? "This staff account has been deactivated. Please contact the admin."
      : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setLoading(false);
    if (error) return setError(error.message ?? "Sign in failed.");
    router.push("/dashboard"); // staff are sent on to /staff
    router.refresh();
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#43A3A3] focus:outline-none focus:ring-2 focus:ring-[#43A3A3]/30";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={input} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#2B6F6F] py-2.5 text-sm font-semibold text-white transition hover:bg-[#245d5d] disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#D6EBE2] to-[#F9FCFB] px-4 font-[family-name:var(--font-dm-sans)]">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 rounded-full bg-[#43A3A3]/10 p-3 text-[#2B6F6F]">
            <Lock size={22} />
          </span>
          <h1 className="text-xl font-bold text-slate-900">Alchemetanoia Team</h1>
          <p className="mt-1 text-sm text-slate-500">Admin and staff sign in</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
