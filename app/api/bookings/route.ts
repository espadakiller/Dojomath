import { randomUUID } from "node:crypto";

import { upsertAccount } from "@/lib/account-store";
import { getAccountName, toPublicAccount } from "@/lib/accounts";
import {
  createBooking,
  readBookings,
  readBookingsByAccount,
  updateBooking,
} from "@/lib/booking-store";
import {
  bookingPlanRules,
  getBookingDays,
  getSlotsForPlan,
  type BookingRecord,
  type BookingRequest,
} from "@/lib/booking";
import {
  sendBookingChangeRequestEmail,
  sendBookingConfirmationEmail,
  sendTeacherBookingEmail,
} from "@/lib/email";
import { getCurrentAccount } from "@/lib/local-auth";
import { getBookingMeetLink } from "@/lib/meeting";
import type { PlanId } from "@/lib/pricing";
import {
  asBoundedText,
  assertSameOrigin,
  jsonError,
  rateLimit,
  readJsonBody,
} from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isPlanId(value: string): value is PlanId {
  return value in bookingPlanRules;
}

const allowedLevels = new Set([
  "6e",
  "5e",
  "4e",
  "3e",
  "Seconde",
  "Première",
  "Terminale",
  "Supérieur",
  "Remise à niveau",
]);

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return Response.json(
      { ok: false, message: "Connexion requise." },
      { status: 401 },
    );
  }

  const [bookings, allBookings] = await Promise.all([
    readBookingsByAccount(account.id),
    readBookings(),
  ]);

  return Response.json({
    ok: true,
    bookings,
    occupiedSlots: allBookings
      .filter((booking) => booking.status !== "cancelled")
      .map((booking) => ({
        id: booking.id,
        date: booking.date,
        time: booking.time,
      })),
  });
}

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = rateLimit(request, "bookings:create", 12, 10 * 60 * 1000);

  if (limited) {
    return limited;
  }

  const account = await getCurrentAccount();

  if (!account) {
    return jsonError("Connectez-vous avant de réserver.", 401);
  }

  const json = await readJsonBody<Partial<BookingRequest>>(
    request,
    8_192,
    "La réservation est illisible.",
  );

  if (!json.ok) {
    return json.response;
  }

  const planId = asBoundedText(json.data.planId, { max: 40 });
  const date = asBoundedText(json.data.date, { max: 10 });
  const time = asBoundedText(json.data.time, { max: 5 });
  const studentName = asBoundedText(json.data.studentName, { max: 80, min: 1 });
  const level = asBoundedText(json.data.level, { max: 40, min: 1 });
  const topic = asBoundedText(json.data.topic, { max: 160, min: 1 });
  const notes = asBoundedText(json.data.notes, { max: 1_000 });

  if (!isPlanId(planId) || !date || !time || !studentName || !level || !topic) {
    return jsonError("Tous les champs nécessaires sont obligatoires.", 400);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return jsonError("Date ou heure invalide.", 400);
  }

  if (!getBookingDays().includes(date)) {
    return jsonError("La date demandée n'est pas ouverte à la réservation.", 400);
  }

  if (!allowedLevels.has(level)) {
    return jsonError("Niveau invalide.", 400);
  }

  if (!getSlotsForPlan(planId, date).includes(time)) {
    return jsonError("Ce créneau n'est pas disponible pour cette formule.", 400);
  }

  const rule = bookingPlanRules[planId];

  if (account.tokens < rule.durationHours) {
    return jsonError("Solde de jetons insuffisant pour ce créneau.", 402);
  }

  const bookings = await readBookings();
  const isTaken = bookings.some(
    (booking) =>
      booking.date === date &&
      booking.time === time &&
      booking.status !== "cancelled",
  );

  if (isTaken) {
    return jsonError("Ce créneau vient d'être réservé.", 409);
  }

  const booking: BookingRecord = {
    id: randomUUID(),
    accountId: account.id,
    planId,
    planTitle: rule.title,
    date,
    time,
    durationHours: rule.durationHours,
    customerName: getAccountName(account),
    studentName,
    level,
    topic,
    notes,
    videoUrl: getBookingMeetLink(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const nextAccount = await upsertAccount({
    ...account,
    tokens: account.tokens - rule.durationHours,
    updatedAt: new Date().toISOString(),
  });

  try {
    await createBooking(booking);
  } catch (error) {
    await upsertAccount({
      ...account,
      updatedAt: new Date().toISOString(),
    });
    console.error("Booking creation failed after token debit", error);
    return jsonError(
      "Ce créneau vient d'être réservé ou la réservation a échoué. Aucun jeton n'a été débité.",
      409,
    );
  }

  const publicAccount = toPublicAccount(nextAccount);

  await sendBookingConfirmationEmail(publicAccount, booking);
  await sendTeacherBookingEmail(publicAccount, booking);

  return Response.json(
    { ok: true, booking, account: publicAccount },
    { status: 201 },
  );
}

export async function PATCH(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = rateLimit(request, "bookings:update", 20, 10 * 60 * 1000);

  if (limited) {
    return limited;
  }

  const account = await getCurrentAccount();

  if (!account) {
    return jsonError("Connectez-vous avant de modifier une reservation.", 401);
  }

  const json = await readJsonBody<{
    bookingId?: unknown;
    action?: unknown;
    message?: unknown;
    date?: unknown;
    time?: unknown;
  }>(request, 4_096, "La demande est illisible.");

  if (!json.ok) {
    return json.response;
  }

  const bookingId = asBoundedText(json.data.bookingId, { max: 120, min: 1 });
  const action = asBoundedText(json.data.action, { max: 30, min: 1 });

  if (!bookingId || !["cancel", "reschedule"].includes(action)) {
    return jsonError("Demande incomplete.", 400);
  }

  const bookings = await readBookingsByAccount(account.id);
  const booking = bookings.find((current) => current.id === bookingId);

  if (!booking) {
    return jsonError("Reservation introuvable.", 404);
  }

  if (action === "reschedule") {
    const date = asBoundedText(json.data.date, { max: 10 });
    const time = asBoundedText(json.data.time, { max: 5 });

    if (!date || !time) {
      return jsonError("Choisissez un nouveau creneau.", 400);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      return jsonError("Date ou heure invalide.", 400);
    }

    if (!getBookingDays().includes(date)) {
      return jsonError("La date demandee n'est pas ouverte a la reservation.", 400);
    }

    if (!getSlotsForPlan(booking.planId, date).includes(time)) {
      return jsonError("Ce creneau n'est pas disponible pour cette formule.", 400);
    }

    const allBookings = await readBookings();
    const isTaken = allBookings.some(
      (current) =>
        current.id !== booking.id &&
        current.date === date &&
        current.time === time &&
        current.status !== "cancelled",
    );

    if (isTaken) {
      return jsonError("Ce creneau vient d'etre reserve.", 409);
    }

    const nextBooking: BookingRecord = {
      ...booking,
      date,
      time,
      changeRequest: undefined,
    };

    await updateBooking(nextBooking);

    return Response.json({ ok: true, booking: nextBooking });
  }

  const message = asBoundedText(json.data.message, { max: 800, min: 3 });

  if (!message) {
    return jsonError("Expliquez brievement votre demande.", 400);
  }

  const nextBooking: BookingRecord = {
    ...booking,
    status: "cancel_requested",
    changeRequest: {
      type: "cancel",
      message,
      createdAt: new Date().toISOString(),
    },
  };

  await updateBooking(nextBooking);
  await sendBookingChangeRequestEmail(toPublicAccount(account), nextBooking);

  return Response.json({ ok: true, booking: nextBooking });
}
