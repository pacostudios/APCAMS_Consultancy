"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient, safeNext } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { rich } from "@/i18n/format";

function RegisterForm() {
  const next = safeNext(useSearchParams().get("next"));
  const { t: tr } = useI18n();
  const t = tr.auth.register;
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) return setError(tr.auth.passwordsMismatch);

    setLoading(true);
    setError("");
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")).trim(),
      email,
      password,
      callbackURL: next, // the confirmation link signs them in and lands here
    });
    setLoading(false);
    if (error) return setError(error.message ?? t.failed);
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <div className="space-y-6 text-center">
        <FormMessage tone="success">
          {rich(t.sent, { email: <strong>{sentTo}</strong> })}
        </FormMessage>
        <p className="text-sm text-slate-500">
          {rich(t.didntGet, {
            link: (
              <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-teal-600 hover:underline">
                {t.signInLower}
              </Link>
            ),
          })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="space-y-2">
        <label htmlFor="name" className={authLabel}>{t.fullName}</label>
        <input id="name" name="name" autoComplete="name" required maxLength={100} className={authInput} />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className={authLabel}>{tr.auth.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={authInput} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="password" className={authLabel}>{tr.auth.password}</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirm" className={authLabel}>{t.confirm}</label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
        </div>
      </div>
      <p className="text-xs text-slate-400">{tr.auth.minLength}</p>
      <button type="submit" disabled={loading} className={authButton}>
        {loading ? t.creating : t.create}
      </button>
      <p className="text-center text-sm text-slate-500">
        {rich(t.already, {
          link: (
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-teal-600 hover:underline">
              {tr.auth.signInLink}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}

export default function RegisterPage() {
  const { t } = useI18n();
  return (
    <AuthCard title={t.auth.register.title} subtitle={t.auth.register.subtitle}>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
