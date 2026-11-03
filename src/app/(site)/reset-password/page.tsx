"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Better Auth sends people here with ?error=INVALID_TOKEN when the link is expired or already used.
  if (!token || params.get("error")) {
    return (
      <div className="space-y-6 text-center">
        <FormMessage tone="error">This reset link is invalid or has expired.</FormMessage>
        <Link href="/forgot-password" className="inline-block font-bold text-teal-600 hover:underline text-sm">Request a new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <FormMessage tone="success">Your password has been changed. You can now sign in.</FormMessage>
        <Link href="/login" className={`${authButton} block`}>SIGN IN</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("password"));
    if (newPassword !== String(form.get("confirm"))) return setError("Passwords don't match.");
    setLoading(true);
    setError("");
    const { error } = await authClient.resetPassword({ newPassword, token: token! });
    setLoading(false);
    if (error) return setError(error.message ?? "Couldn't reset your password. The link may have expired.");
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="space-y-2">
        <label htmlFor="password" className={authLabel}>New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm" className={authLabel}>Confirm new password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
      </div>
      <p className="text-xs text-slate-400">At least 8 characters.</p>
      <button type="submit" disabled={loading} className={authButton}>
        {loading ? "SAVING…" : "SET NEW PASSWORD"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Choose a new password" subtitle="Pick something you haven't used here before.">
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}
