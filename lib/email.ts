import type { PublicAccount } from "@/lib/accounts";
import type { BookingRecord } from "@/lib/booking";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function sendEmail(payload: EmailPayload) {
  if (!resendApiKey || !emailFrom) {
    console.warn("DojoMath email skipped: RESEND_API_KEY or EMAIL_FROM is missing.");
    return { ok: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": payload.idempotencyKey,
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend email failed: ${message}`);
  }

  return { ok: true, skipped: false };
}

async function safelySendEmail(payload: EmailPayload) {
  try {
    return await sendEmail(payload);
  } catch (error) {
    console.error(error);
    return { ok: false, skipped: false };
  }
}

function baseTemplate(title: string, content: string) {
  return `
    <div style="margin:0;background:#f6f3ed;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1b1b1b;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e8dfd2;border-radius:8px;overflow:hidden;">
        <div style="padding:24px 28px;background:#12302a;color:#ffffff;">
          <div style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;">DojoMath</div>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">${title}</h1>
        </div>
        <div style="padding:28px;font-size:16px;line-height:1.55;">
          ${content}
          <p style="margin:28px 0 0;color:#5b5b5b;font-size:14px;">A tres vite,<br />DojoMath</p>
        </div>
      </div>
    </div>
  `;
}

export function sendWelcomeEmail(account: PublicAccount) {
  const firstName = escapeHtml(account.firstName);

  return safelySendEmail({
    to: account.email,
    subject: "Bienvenue chez DojoMath",
    idempotencyKey: `welcome-${account.id}`,
    text: `Bonjour ${account.firstName}, votre compte DojoMath a bien ete cree. Vous pouvez maintenant acheter des jetons et reserver vos cours depuis votre espace reservation.`,
    html: baseTemplate(
      "Bienvenue chez DojoMath",
      `
        <p>Bonjour ${firstName},</p>
        <p>Votre compte DojoMath a bien &eacute;t&eacute; cr&eacute;&eacute;. Vous pouvez maintenant acheter des jetons puis r&eacute;server vos cours depuis votre espace de r&eacute;servation.</p>
        <p style="margin:20px 0 0;"><strong>Email du compte :</strong> ${escapeHtml(account.email)}</p>
      `,
    ),
  });
}

export function sendBookingConfirmationEmail(
  account: PublicAccount,
  booking: BookingRecord,
) {
  const dateLabel = formatDate(booking.date);

  return safelySendEmail({
    to: account.email,
    subject: "Reservation confirmee - DojoMath",
    idempotencyKey: `booking-${booking.id}`,
    text: `Bonjour ${account.firstName}, votre reservation DojoMath est bien enregistree pour le ${dateLabel} a ${booking.time}. Eleve: ${booking.studentName}. Niveau: ${booking.level}. Objectif: ${booking.topic}.`,
    html: baseTemplate(
      "Reservation confirmee",
      `
        <p>Bonjour ${escapeHtml(account.firstName)},</p>
        <p>Votre r&eacute;servation DojoMath est bien enregistr&eacute;e.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tbody>
            <tr><td style="padding:8px 0;color:#666;">Formule</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.planTitle)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Date</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(dateLabel)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Heure</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.time)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Eleve</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.studentName)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Niveau</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.level)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Objectif</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.topic)}</strong></td></tr>
          </tbody>
        </table>
        <p>Vous recevrez les informations pratiques du cours si un lien ou une precision supplementaire est necessaire.</p>
      `,
    ),
  });
}
