"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { rich } from "@/i18n/format";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t: tr } = useI18n();
  const t = tr.auth.forgot;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    setLoading(true);
    setError("");
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setLoading(false);
    if (error) return setError(error.message ?? t.failed);
    setSentTo(email);
  }

  return (
    <AuthCard title={t.title} subtitle={t.subtitle}>
      {sentTo ? (
        <div className="space-y-6 text-center">
          {/* Same message whether or not the account exists, so the form can't be used to look up emails. */}
          <FormMessage tone="success">
            {rich(t.sent, { email: <strong>{sentTo}</strong> })}
          </FormMessage>
          <Link href="/login" className="inline-block font-bold text-teal-600 hover:underline text-sm">{t.backToSignIn}</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {error && <FormMessage tone="error">{error}</FormMessage>}
          <div className="space-y-2">
            <label htmlFor="email" className={authLabel}>{tr.auth.email}</label>
            <input id="email" name="email" type="email" autoComplete="email" required className={authInput} />
          </div>
          <button type="submit" disabled={loading} className={authButton}>
            {loading ? t.sending : t.send}
          </button>
          <p className="text-center text-sm text-slate-500">
            {rich(t.remembered, {
              link: (
                <Link href="/login" className="font-bold text-teal-600 hover:underline">
                  {tr.auth.signInLink}
                </Link>
              ),
            })}
          </p>
        </form>
      )}
    </AuthCard>
  );
}
