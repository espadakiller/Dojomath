import { randomUUID } from "node:crypto";

import type { PublicAccount } from "@/lib/accounts";
import type { BookingRecord } from "@/lib/booking";
import type { PlanId } from "@/lib/pricing";

type EmailPayload = {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  replyTo?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const teacherEmail =
  process.env.TEACHER_EMAIL ??
  process.env.CONTACT_TO_EMAIL ??
  "mkkurban9@gmail.com";

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
  const from = payload.from ?? emailFrom;

  if (!resendApiKey || !from) {
    console.warn("DojoMath email skipped: RESEND_API_KEY or sender is missing.");
    return { ok: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    signal: AbortSignal.timeout(10_000),
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": payload.idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
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

export function sendTeacherSignupEmail(account: PublicAccount) {
  return safelySendEmail({
    to: teacherEmail,
    subject: "Nouvelle inscription - DojoMath",
    idempotencyKey: `teacher-signup-${account.id}`,
    text: [
      "Un nouveau compte a ete cree sur DojoMath.",
      `Nom : ${account.firstName} ${account.lastName}`,
      `Email : ${account.email}`,
      "Cette inscription ne constitue ni un paiement ni une reservation.",
    ].join("\n"),
    html: baseTemplate(
      "Nouvelle inscription",
      `<p>Un nouveau compte a &eacute;t&eacute; cr&eacute;&eacute; sur DojoMath.</p>
       <p><strong>Nom :</strong> ${escapeHtml(account.firstName)} ${escapeHtml(account.lastName)}<br />
       <strong>Email :</strong> ${escapeHtml(account.email)}</p>
       <p>Cette inscription ne constitue ni un paiement ni une r&eacute;servation.</p>`,
    ),
  });
}

export function sendContactEmail(details: {
  name: string;
  email: string;
  message: string;
}) {
  const recipient =
    process.env.CONTACT_TO_EMAIL ??
    process.env.TEACHER_EMAIL ??
    "mkkurban9@gmail.com";
  const sender = process.env.CONTACT_FROM_EMAIL ?? emailFrom;
  const safeMessage = escapeHtml(details.message).replace(/\n/g, "<br />");

  return safelySendEmail({
    from: sender,
    to: recipient,
    replyTo: details.email,
    subject: `Nouveau message DojoMath - ${details.name}`,
    idempotencyKey: `contact-${randomUUID()}`,
    text: [
      "Nouveau message depuis le site DojoMath",
      "",
      `Nom : ${details.name}`,
      `Email : ${details.email}`,
      "",
      "Message :",
      details.message,
    ].join("\n"),
    html: baseTemplate(
      "Nouveau message",
      `
        <p><strong>Nom :</strong> ${escapeHtml(details.name)}<br />
        <strong>Email :</strong> <a href="mailto:${escapeHtml(details.email)}">${escapeHtml(details.email)}</a></p>
        <p style="margin-top:22px;"><strong>Message :</strong></p>
        <p style="white-space:normal;">${safeMessage}</p>
      `,
    ),
  });
}

export function sendBookingConfirmationEmail(
  account: PublicAccount,
  booking: BookingRecord,
) {
  const dateLabel = formatDate(booking.date);
  const videoText = booking.videoUrl
    ? ` Lien visio Google Meet: ${booking.videoUrl}.`
    : "";
  const videoHtml = booking.videoUrl
    ? `
        <p style="margin:22px 0 0;">
          <a href="${escapeHtml(booking.videoUrl)}" style="display:inline-block;background:#7a1028;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:bold;">Rejoindre la visio Google Meet</a>
        </p>
        <p style="margin:12px 0 0;color:#666;font-size:14px;">Ce lien est aussi disponible dans votre espace de r&eacute;servation DojoMath.</p>
      `
    : `
        <p style="margin:20px 0 0;color:#666;">Le lien visio vous sera transmis avant le cours.</p>
      `;

  return safelySendEmail({
    to: account.email,
    subject: "Reservation confirmee - DojoMath",
    idempotencyKey: `booking-${booking.id}`,
    text: `Bonjour ${account.firstName}, votre reservation DojoMath est bien enregistree pour le ${dateLabel} a ${booking.time}. Eleve: ${booking.studentName}. Niveau: ${booking.level}. Objectif: ${booking.topic}.${videoText}`,
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
        ${videoHtml}
      `,
    ),
  });
}

export function sendTeacherBookingEmail(
  account: PublicAccount,
  booking: BookingRecord,
) {
  const dateLabel = formatDate(booking.date);
  const videoLine = booking.videoUrl ? `\nLien visio: ${booking.videoUrl}` : "";

  return safelySendEmail({
    to: teacherEmail,
    subject: `Nouvelle reservation DojoMath - ${dateLabel} ${booking.time}`,
    idempotencyKey: `teacher-booking-${booking.id}`,
    text: [
      "Nouvelle reservation DojoMath",
      "",
      `Parent: ${account.firstName} ${account.lastName}`,
      `Email: ${account.email}`,
      `Formule: ${booking.planTitle}`,
      `Date: ${dateLabel}`,
      `Heure: ${booking.time}`,
      `Eleve: ${booking.studentName}`,
      `Niveau: ${booking.level}`,
      `Objectif: ${booking.topic}`,
      `Notes: ${booking.notes || "-"}`,
      videoLine,
    ].join("\n"),
    html: baseTemplate(
      "Nouvelle reservation",
      `
        <p><strong>Parent :</strong> ${escapeHtml(account.firstName)} ${escapeHtml(account.lastName)}<br />
        <strong>Email :</strong> ${escapeHtml(account.email)}</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tbody>
            <tr><td style="padding:8px 0;color:#666;">Formule</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.planTitle)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Date</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(dateLabel)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Heure</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.time)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Eleve</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.studentName)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Niveau</td><td style="padding:8px 0;text-align:right;"><strong>${escapeHtml(booking.level)}</strong></td></tr>
          </tbody>
        </table>
        <p><strong>Objectif :</strong> ${escapeHtml(booking.topic)}</p>
        <p><strong>Notes :</strong> ${escapeHtml(booking.notes || "-")}</p>
        ${
          booking.videoUrl
            ? `<p><a href="${escapeHtml(booking.videoUrl)}">Ouvrir la visio</a></p>`
            : ""
        }
      `,
    ),
  });
}

export function sendPaymentCreditsEmail(
  account: PublicAccount,
  details: { planId: PlanId; label: string; tokens: number; eventId: string },
) {
  return safelySendEmail({
    to: account.email,
    subject: "Jetons ajoutes - DojoMath",
    idempotencyKey: `credits-${account.id}-${details.eventId}`,
    text: `Bonjour ${account.firstName}, votre paiement a ete confirme. ${details.label} ont ete ajoutes a votre compte DojoMath. Nouveau solde: ${account.tokens} jeton(s).`,
    html: baseTemplate(
      "Jetons ajoutes",
      `
        <p>Bonjour ${escapeHtml(account.firstName)},</p>
        <p>Votre paiement a bien &eacute;t&eacute; confirm&eacute;. <strong>${escapeHtml(details.label)}</strong> ont &eacute;t&eacute; ajout&eacute;s &agrave; votre compte.</p>
        <p style="margin:20px 0 0;"><strong>Nouveau solde :</strong> ${account.tokens} jeton${account.tokens > 1 ? "s" : ""}</p>
      `,
    ),
  });
}

export function sendBookingChangeRequestEmail(
  account: PublicAccount,
  booking: BookingRecord,
) {
  const dateLabel = formatDate(booking.date);
  const request = booking.changeRequest;

  if (!request) {
    return Promise.resolve({ ok: false, skipped: true });
  }

  return safelySendEmail({
    to: teacherEmail,
    subject:
      request.type === "cancel"
        ? `Demande d'annulation - ${dateLabel} ${booking.time}`
        : `Demande de deplacement - ${dateLabel} ${booking.time}`,
    idempotencyKey: `booking-change-${booking.id}-${request.createdAt}`,
    text: [
      request.type === "cancel"
        ? "Demande d'annulation"
        : "Demande de deplacement",
      "",
      `Parent: ${account.firstName} ${account.lastName}`,
      `Email: ${account.email}`,
      `Cours: ${dateLabel} a ${booking.time}`,
      `Eleve: ${booking.studentName}`,
      "",
      "Message:",
      request.message,
    ].join("\n"),
    html: baseTemplate(
      request.type === "cancel"
        ? "Demande d'annulation"
        : "Demande de deplacement",
      `
        <p><strong>Parent :</strong> ${escapeHtml(account.firstName)} ${escapeHtml(account.lastName)}<br />
        <strong>Email :</strong> ${escapeHtml(account.email)}</p>
        <p><strong>Cours :</strong> ${escapeHtml(dateLabel)} &agrave; ${escapeHtml(booking.time)}<br />
        <strong>Eleve :</strong> ${escapeHtml(booking.studentName)}</p>
        <p><strong>Message :</strong><br />${escapeHtml(request.message)}</p>
      `,
    ),
  });
}

export function sendBookingReminderEmail(
  account: PublicAccount,
  booking: BookingRecord,
) {
  const dateLabel = formatDate(booking.date);
  const videoText = booking.videoUrl
    ? ` Lien visio: ${booking.videoUrl}.`
    : "";
  const videoHtml = booking.videoUrl
    ? `<p style="margin:22px 0 0;"><a href="${escapeHtml(booking.videoUrl)}" style="display:inline-block;background:#7a1028;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:bold;">Rejoindre la visio</a></p>`
    : "";

  return safelySendEmail({
    to: account.email,
    subject: "Rappel de cours - DojoMath",
    idempotencyKey: `booking-reminder-${booking.id}`,
    text: `Bonjour ${account.firstName}, rappel: votre cours DojoMath est prevu le ${dateLabel} a ${booking.time}.${videoText}`,
    html: baseTemplate(
      "Rappel de cours",
      `
        <p>Bonjour ${escapeHtml(account.firstName)},</p>
        <p>Petit rappel : votre cours DojoMath est pr&eacute;vu le <strong>${escapeHtml(dateLabel)}</strong> &agrave; <strong>${escapeHtml(booking.time)}</strong>.</p>
        ${videoHtml}
      `,
    ),
  });
}
