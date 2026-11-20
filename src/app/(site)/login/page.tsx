"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient, safeNext } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { fmt, rich } from "@/i18n/format";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { t: tr } = useI18n();
  const t = tr.auth.login;
  const [mode, setMode] = useState<"code" | "password">("code");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(m: "code" | "password") {
    setMode(m);
    setCodeSent(false);
    setError("");
    setNotice("");
  }

  async function sendCode() {
    setLoading(true);
    setError("");
    setNotice("");
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: "sign-in" });
    setLoading(false);
    if (error) return setError(error.status === 429 ? t.tooManyCodes : t.codeSendFailed);
    setCodeSent(true);
    setNotice(fmt(t.codeNotice, { email: email.trim() }));
  }

  async function onCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!codeSent) return sendCode();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    const { error } = await authClient.signIn.emailOtp({ email: email.trim(), otp: String(form.get("code")).trim() });
    setLoading(false);
    if (error) return setError(t.codeWrong);
    router.push(next);
    router.refresh();
  }

  async function onPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    setNotice("");
    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password: String(form.get("password")),
      callbackURL: next, // where the confirmation link lands if the email isn't verified yet
    });
    setLoading(false);
    if (error) {
      if (error.code === "EMAIL_NOT_VERIFIED" || error.status === 403) {
        return setNotice(t.confirmFirst);
      }
      return setError(error.message ?? t.failed);
    }
    router.push(next);
    router.refresh();
  }

  const emailField = (
    <div className="space-y-2">
      <label htmlFor="email" className={authLabel}>{tr.auth.email}</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setCodeSent(false);
        }}
        className={authInput}
      />
    </div>
  );

  return (
    <div className="space-y-5">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      {notice && <FormMessage tone="success">{notice}</FormMessage>}

      {mode === "code" ? (
        <form onSubmit={onCodeSubmit} className="space-y-5">
          {emailField}
          {codeSent && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="code" className={authLabel}>{t.code}</label>
                <button type="button" onClick={sendCode} disabled={loading} className="text-xs font-bold text-teal-600 hover:underline disabled:opacity-40">
                  {t.newCode}
                </button>
              </div>
              <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required className={`${authInput} tracking-[0.4em] font-bold`} />
            </div>
          )}
          <button type="submit" disabled={loading} className={authButton}>
            {loading ? (codeSent ? t.signingIn : t.sendingCode) : codeSent ? t.signIn : t.emailCode}
          </button>
        </form>
      ) : (
        <form onSubmit={onPasswordSubmit} className="space-y-5">
          {emailField}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={authLabel}>{tr.auth.password}</label>
              <Link href="/forgot-password" className="text-xs font-bold text-teal-600 hover:underline">{t.forgot}</Link>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" required className={authInput} />
          </div>
          <button type="submit" disabled={loading} className={authButton}>
            {loading ? t.signingIn : t.signIn}
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={() => switchMode(mode === "code" ? "password" : "code")}
        className="w-full text-center text-sm font-bold text-teal-600 hover:underline"
      >
        {mode === "code" ? t.usePassword : t.useCode}
      </button>
      <p className="text-center text-sm text-slate-500">
        {rich(t.newHere, {
          book: (
            <Link href="/book_appointment" className="font-bold text-teal-600 hover:underline">
              {t.bookSession}
            </Link>
          ),
          register: (
            <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-bold text-teal-600 hover:underline">
              {t.createAccount}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useI18n();
  return (
    <AuthCard title={t.auth.login.title} subtitle={t.auth.login.subtitle}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
