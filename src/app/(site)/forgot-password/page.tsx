"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    setLoading(true);
    setError("");
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setLoading(false);
    if (error) return setError(error.message ?? "Something went wrong. Please try again.");
    setSentTo(email);
  }

  return (
    <AuthCard title="Forgot your password?" subtitle="Enter your email and we'll send you a link to choose a new one.">
      {sentTo ? (
        <div className="space-y-6 text-center">
          {/* Same message whether or not the account exists, so the form can't be used to look up emails. */}
          <FormMessage tone="success">
            If <strong>{sentTo}</strong> has an account, a reset link is on its way. It&apos;s valid for 1 hour.
          </FormMessage>
          <Link href="/login" className="inline-block font-bold text-teal-600 hover:underline text-sm">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {error && <FormMessage tone="error">{error}</FormMessage>}
          <div className="space-y-2">
            <label htmlFor="email" className={authLabel}>Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className={authInput} />
          </div>
          <button type="submit" disabled={loading} className={authButton}>
            {loading ? "SENDING…" : "SEND RESET LINK"}
          </button>
          <p className="text-center text-sm text-slate-500">
            Remembered it?{" "}
            <Link href="/login" className="font-bold text-teal-600 hover:underline">Sign in</Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
