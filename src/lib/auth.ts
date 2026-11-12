import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { codeEmail, sendEmail, simpleEmail } from "./email";

// Extra origins allowed to call the auth API besides BETTER_AUTH_URL (e.g. www vs apex domain, a LAN IP in dev).
// Comma-separated in BETTER_AUTH_TRUSTED_ORIGINS.
const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

export const auth = betterAuth({
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Customers must click the link in their inbox before they can sign in (and therefore book).
    requireEmailVerification: true,
    // Registering an email that's already taken shows the same "check your inbox" screen (so strangers can't
    // probe which emails have accounts); the real owner gets this email instead of silence.
    onExistingUserSignUp: async ({ user }) => {
      const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
      const { html, text } = simpleEmail({
        heading: "You already have an Alchemetanoia account",
        body: user.emailVerified
          ? "Someone (hopefully you) tried to register with this email, but it already has an account. Sign in instead, or ignore this email if it wasn't you."
          : "This email already has an account that hasn't been confirmed yet. Sign in and we'll send you a fresh confirmation link. Forgotten the password? Use \"Forgot password?\" on the sign-in page.",
        cta: "Sign in",
        url: `${base}/login`,
      });
      void sendEmail({ to: user.email, subject: "You already have an Alchemetanoia account", html, text }).catch(console.error);
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const { html, text } = simpleEmail({
        heading: "Reset your password",
        body: "We received a request to reset the password for your Alchemetanoia account. The link is valid for 1 hour. If you didn't ask for this, you can ignore this email.",
        cta: "Choose a new password",
        url,
      });
      void sendEmail({ to: user.email, subject: "Reset your Alchemetanoia password", html, text }).catch(console.error);
    },
    // The reset link was opened from their inbox, which proves they own the email.
    onPasswordReset: async ({ user }) => {
      if (!user.emailVerified) {
        db.update(schema.user).set({ emailVerified: true }).where(eq(schema.user.id, user.id)).run();
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true, // resend the link if an unverified user tries to sign in
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours
    sendVerificationEmail: async ({ user, url }) => {
      const { html, text } = simpleEmail({
        heading: `Welcome, ${user.name}`,
        body: "Please confirm your email address to finish creating your Alchemetanoia account. You can then book and manage your sessions online.",
        cta: "Confirm email",
        url,
      });
      // Not awaited, so response time doesn't reveal whether the email was sent.
      void sendEmail({ to: user.email, subject: "Confirm your Alchemetanoia account", html, text }).catch(console.error);
    },
  },
  user: {
    additionalFields: {
      // Never settable from sign-up; admins are created by the seed script, staff by an admin.
      role: { type: "string", defaultValue: "client", input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  plugins: [
    // Customers sign in (or sign up, when booking for the first time) with a 6-digit code emailed to them.
    // The code proves they own the email, so OTP accounts are created already verified.
    emailOTP({
      otpLength: 6,
      expiresIn: 60 * 10, // 10 minutes
      allowedAttempts: 5,
      storeOTP: "hashed",
      async sendVerificationOTP({ email, otp, type }) {
        if (type !== "sign-in") return;
        // Admin and staff keep password-only sign-in. Skip silently so the response doesn't reveal the role.
        const existing = db.select({ role: schema.user.role }).from(schema.user).where(eq(schema.user.email, email.toLowerCase())).get();
        if (existing && existing.role !== "client") return;
        const { html, text } = codeEmail({
          heading: "Your Alchemetanoia sign-in code",
          body: "Enter this code to continue. It expires in 10 minutes.",
          code: otp,
        });
        // Not awaited, so response time doesn't reveal whether the email was sent.
        void sendEmail({ to: email, subject: `${otp} is your Alchemetanoia sign-in code`, html, text }).catch(console.error);
      },
    }),
    nextCookies(), // must stay last
  ],
});

export type Session = typeof auth.$Infer.Session;
