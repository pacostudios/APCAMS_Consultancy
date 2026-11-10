"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient, safeNext } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
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
    if (error) return setError(error.status === 429 ? "Too many codes requested. Please wait a minute and try again." : "We couldn't send a code. Please check your email address.");
    setCodeSent(true);
    setNotice(`If ${email.trim()} can sign in with a code, it's on its way. It expires in 10 minutes.`);
  }

  async function onCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!codeSent) return sendCode();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    const { error } = await authClient.signIn.emailOtp({ email: email.trim(), otp: String(form.get("code")).trim() });
    setLoading(false);
    if (error) return setError("That code isn't right or has expired. Check your email or send a new code.");
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
        return setNotice("Please confirm your email first. We've just sent you a new confirmation link.");
      }
      return setError(error.message ?? "Sign in failed.");
    }
    router.push(next);
    router.refresh();
  }

  const emailField = (
    <div className="space-y-2">
      <label htmlFor="email" className={authLabel}>Email</label>
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
                <label htmlFor="code" className={authLabel}>6-digit code</label>
                <button type="button" onClick={sendCode} disabled={loading} className="text-xs font-bold text-teal-600 hover:underline disabled:opacity-40">
                  Send a new code
                </button>
              </div>
              <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required className={`${authInput} tracking-[0.4em] font-bold`} />
            </div>
          )}
          <button type="submit" disabled={loading} className={authButton}>
            {loading ? (codeSent ? "SIGNING IN…" : "SENDING CODE…") : codeSent ? "SIGN IN" : "EMAIL ME A CODE"}
          </button>
        </form>
      ) : (
        <form onSubmit={onPasswordSubmit} className="space-y-5">
          {emailField}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={authLabel}>Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-teal-600 hover:underline">Forgot password?</Link>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" required className={authInput} />
          </div>
          <button type="submit" disabled={loading} className={authButton}>
            {loading ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={() => switchMode(mode === "code" ? "password" : "code")}
        className="w-full text-center text-sm font-bold text-teal-600 hover:underline"
      >
        {mode === "code" ? "Use a password instead" : "Email me a code instead"}
      </button>
      <p className="text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/book_appointment" className="font-bold text-teal-600 hover:underline">
          Book a session
        </Link>{" "}
        or{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-bold text-teal-600 hover:underline">
          create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to see your bookings or book again.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
