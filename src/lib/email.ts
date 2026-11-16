import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { BUSINESS, siteUrl } from "./config";

type Email = { to: string; subject: string; html: string; text: string };

const from = () => process.env.EMAIL_FROM ?? "Alchemetanoia Consultancy <no-reply@alchemetanoia.com>";

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

// ---------- Branded templates ----------
// Table layout with inline styles: the only thing Gmail, Outlook and Apple Mail all render the same way.

const BRAND = {
  name: "Alchemetanoia",
  tagline: "Psychotherapy · Counselling · Mediation",
  teal: "#0d9488",
  ink: "#0f172a",
  body: "#475569",
  muted: "#94a3b8",
  line: "#e2e8f0",
  bg: "#f1f5f9",
  font: "'Helvetica Neue',Helvetica,Arial,sans-serif",
};

/** One row in a details table, e.g. { label: "When", value: "Mon 3 Mar, 10:00 AEDT" }. `href` makes the value a link. */
export type EmailDetail = { label: string; value: string; href?: string };

/** Wraps content in the branded shell: header, white card, footer. `preheader` is the inbox preview line. */
function layout({ preheader, content }: { preheader: string; content: string }) {
  const site = siteUrl();
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(BRAND.name)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.bg}">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
    <tr><td align="center" style="padding:0 0 20px;font-family:${BRAND.font}">
      <a href="${escape(site)}" style="text-decoration:none;color:${BRAND.ink};font-size:22px;font-weight:bold;letter-spacing:0.5px">${escape(BRAND.name)}</a>
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.teal};padding-top:4px">${escape(BRAND.tagline)}</div>
    </td></tr>
    <tr><td style="background:#ffffff;border:1px solid ${BRAND.line};border-top:4px solid ${BRAND.teal};border-radius:12px;padding:36px 32px;font-family:${BRAND.font};color:${BRAND.ink}">
      ${content}
    </td></tr>
    <tr><td align="center" style="padding:24px 16px 0;font-family:${BRAND.font};font-size:12px;line-height:1.6;color:${BRAND.muted}">
      ${escape(BUSINESS.name)}<br>
      <a href="${escape(site)}" style="color:${BRAND.muted};text-decoration:underline">${escape(site.replace(/^https?:\/\//, ""))}</a><br>
      If you are in crisis or your life is in danger, call <a href="tel:000" style="color:${BRAND.muted}">000</a>, or Lifeline on <a href="tel:131114" style="color:${BRAND.muted}">13 11 14</a>.
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

const heading = (s: string) =>
  `<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:bold;color:${BRAND.ink}">${escape(s)}</h1>`;
const paragraph = (s: string) =>
  `<p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:${BRAND.body}">${escape(s)}</p>`;
const smallPrint = (s: string) =>
  `<p style="margin:24px 0 0;padding-top:20px;border-top:1px solid ${BRAND.line};font-size:12px;line-height:1.6;color:${BRAND.muted}">${s}</p>`;

function detailsTable(rows: EmailDetail[]) {
  if (!rows.length) return "";
  const cells = rows
    .map((r, i) => {
      const value = r.href
        ? `<a href="${escape(r.href)}" style="color:${BRAND.teal};text-decoration:underline;word-break:break-all">${escape(r.value)}</a>`
        : escape(r.value);
      const border = i < rows.length - 1 ? `border-bottom:1px solid ${BRAND.line};` : "";
      return `<tr>
        <td style="${border}padding:12px 16px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};white-space:nowrap;vertical-align:top;width:1%">${escape(r.label)}</td>
        <td style="${border}padding:12px 16px;font-size:15px;line-height:1.5;color:${BRAND.ink};vertical-align:top">${value}</td>
      </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;background:#f8fafc;border:1px solid ${BRAND.line};border-radius:8px">${cells}</table>`;
}

const button = (label: string, url: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px"><tr>
    <td style="background:${BRAND.teal};border-radius:999px">
      <a href="${escape(url)}" style="display:inline-block;padding:14px 32px;font-family:${BRAND.font};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none">${escape(label)}</a>
    </td></tr></table>`;

const detailsText = (rows: EmailDetail[]) =>
  rows.length ? rows.map((r) => `${r.label}: ${r.value}${r.href && r.href !== r.value ? ` (${r.href})` : ""}`).join("\n") + "\n\n" : "";

/** Email carrying a one-time sign-in code instead of a link. */
export function codeEmail({ heading: title, body, code }: { heading: string; body: string; code: string }) {
  const content = `${heading(title)}${paragraph(body)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px"><tr>
      <td align="center" style="background:#f0fdfa;border:1px dashed ${BRAND.teal};border-radius:10px;padding:20px">
        <span style="font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:bold;letter-spacing:10px;padding-left:10px;color:${BRAND.ink}">${escape(code)}</span>
      </td></tr></table>
    ${smallPrint("For your security, never share this code. Our team will never ask you for it. If you didn't request it, you can safely ignore this email.")}`;
  return {
    html: layout({ preheader: `Your code is ${code}. ${body}`, content }),
    text: `${title}\n\n${body}\n\n${code}\n\nNever share this code. If you didn't request it, you can ignore this email.\n\n${BUSINESS.name}\n${siteUrl()}`,
  };
}

/** Branded email: heading, paragraph, optional details table, one button, optional note. */
export function simpleEmail({
  heading: title,
  body,
  cta,
  url,
  details = [],
  note,
}: {
  heading: string;
  body: string;
  cta: string;
  url: string;
  details?: EmailDetail[];
  /** Short line shown under the button, e.g. the cancellation policy. */
  note?: string;
}) {
  const content = `${heading(title)}${paragraph(body)}${detailsTable(details)}${button(cta, url)}
    ${note ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${BRAND.body}">${escape(note)}</p>` : ""}
    ${smallPrint(`If the button doesn't work, copy this link into your browser:<br><a href="${escape(url)}" style="color:${BRAND.muted};word-break:break-all">${escape(url)}</a>`)}`;
  return {
    html: layout({ preheader: body, content }),
    text: `${title}\n\n${body}\n\n${detailsText(details)}${cta}: ${url}\n${note ? `\n${note}\n` : ""}\n${BUSINESS.name}\n${siteUrl()}`,
  };
}
