import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

type Email = { to: string; subject: string; html: string; text: string };

const from = () => process.env.EMAIL_FROM ?? "APCAMS Consultancy <no-reply@apcams.com.au>";

let smtp: Transporter | null = null;
function smtpTransport() {
  smtp ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465, // 465 = TLS from the start, 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  return smtp;
}

/**
 * Sends an email through SMTP (e.g. Gmail) if SMTP_HOST is set, otherwise Resend's HTTP API.
 * With neither configured (local development) the email is printed to the server console instead.
 */
export async function sendEmail({ to, subject, html, text }: Email) {
  if (process.env.SMTP_HOST) {
    console.log(`[email] SMTP ${process.env.SMTP_HOST} as ${process.env.SMTP_USER} → ${to} "${subject}"`);
    try {
      const info = await smtpTransport().sendMail({ from: from(), to, subject, html, text });
      console.log(`[email] ✓ sent to ${to} (id ${info.messageId}, server said: ${info.response})`);
      if (info.rejected?.length) console.warn(`[email] ⚠ rejected recipients: ${info.rejected.join(", ")}`);
    } catch (e) {
      console.error(`[email] ✗ SMTP send to ${to} failed:`, e);
      throw e;
    }
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`\n✉️  [email not sent: no SMTP_HOST or RESEND_API_KEY]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  console.log(`[email] Resend → ${to} "${subject}"`);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: from(), to, subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[email] ✗ Resend send to ${to} failed (${res.status}): ${body}`);
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
  console.log(`[email] ✓ sent to ${to} via Resend: ${await res.text()}`);
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Minimal branded email: a heading, a paragraph and one button. */
/** Email carrying a one-time sign-in code instead of a link. */
export function codeEmail({ heading, body, code }: { heading: string; body: string; code: string }) {
  const html = `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
  <h1 style="font-size:20px;margin:0 0 12px">${escape(heading)}</h1>
  <p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 24px">${escape(body)}</p>
  <p style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:0 0 24px">${escape(code)}</p>
  <p style="font-size:12px;color:#94a3b8;margin:0">If you didn't ask for this code, you can ignore this email.</p>
</div>`;
  return { html, text: `${heading}\n\n${body}\n\n${code}\n\nIf you didn't ask for this code, you can ignore this email.` };
}

export function simpleEmail({ heading, body, cta, url }: { heading: string; body: string; cta: string; url: string }) {
  const html = `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
  <h1 style="font-size:20px;margin:0 0 12px">${escape(heading)}</h1>
  <p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 24px">${escape(body)}</p>
  <a href="${escape(url)}" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:999px">${escape(cta)}</a>
  <p style="font-size:12px;color:#94a3b8;margin:24px 0 0">If the button doesn't work, paste this link into your browser:<br>${escape(url)}</p>
</div>`;
  return { html, text: `${heading}\n\n${body}\n\n${cta}: ${url}` };
}
