"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";
import { useI18n } from "@/i18n/LanguageProvider";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t: tr } = useI18n();
  const t = tr.auth.reset;

  // Better Auth sends people here with ?error=INVALID_TOKEN when the link is expired or already used.
  if (!token || params.get("error")) {
    return (
      <div className="space-y-6 text-center">
        <FormMessage tone="error">{t.invalid}</FormMessage>
        <Link href="/forgot-password" className="inline-block font-bold text-teal-600 hover:underline text-sm">{t.requestNew}</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <FormMessage tone="success">{t.done}</FormMessage>
        <Link href="/login" className={`${authButton} block`}>{t.signIn}</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("password"));
    if (newPassword !== String(form.get("confirm"))) return setError(tr.auth.passwordsMismatch);
    setLoading(true);
    setError("");
    const { error } = await authClient.resetPassword({ newPassword, token: token! });
    setLoading(false);
    if (error) return setError(error.message ?? t.failed);
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="space-y-2">
        <label htmlFor="password" className={authLabel}>{t.newPassword}</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm" className={authLabel}>{t.confirmNew}</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
      </div>
      <p className="text-xs text-slate-400">{tr.auth.minLength}</p>
      <button type="submit" disabled={loading} className={authButton}>
        {loading ? t.saving : t.save}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { t } = useI18n();
  return (
    <AuthCard title={t.auth.reset.title} subtitle={t.auth.reset.subtitle}>
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}
