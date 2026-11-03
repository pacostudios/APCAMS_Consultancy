"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient, safeNext } from "@/lib/auth-client";
import { AuthCard, FormMessage, authButton, authInput, authLabel } from "../components/AuthCard";

function RegisterForm() {
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) return setError("Passwords don't match.");

    setLoading(true);
    setError("");
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")).trim(),
      email,
      password,
      callbackURL: next, // the confirmation link signs them in and lands here
    });
    setLoading(false);
    if (error) return setError(error.message ?? "Couldn't create your account.");
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <div className="space-y-6 text-center">
        <FormMessage tone="success">
          We&apos;ve sent a confirmation link to <strong>{sentTo}</strong>. Click it to activate your account. It&apos;s valid for 24 hours.
        </FormMessage>
        <p className="text-sm text-slate-500">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-teal-600 hover:underline">
            sign in
          </Link>{" "}
          to get a new link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="space-y-2">
        <label htmlFor="name" className={authLabel}>Full name</label>
        <input id="name" name="name" autoComplete="name" required maxLength={100} className={authInput} />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className={authLabel}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={authInput} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="password" className={authLabel}>Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirm" className={authLabel}>Confirm</label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={authInput} />
        </div>
      </div>
      <p className="text-xs text-slate-400">At least 8 characters.</p>
      <button type="submit" disabled={loading} className={authButton}>
        {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-teal-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthCard title="Create your account" subtitle="Book sessions, get your Zoom links and see your schedule in one place.">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
