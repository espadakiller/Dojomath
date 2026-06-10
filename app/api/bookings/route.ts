import { randomUUID } from "node:crypto";

import { upsertAccount } from "@/lib/account-store";
import { getAccountName, toPublicAccount } from "@/lib/accounts";
import {
  createBooking,
  readBookings,
  readBookingsByAccount,
} from "@/lib/booking-store";
import {
  bookingPlanRules,
  getSlotsForPlan,
  type BookingRecord,
  type BookingRequest,
} from "@/lib/booking";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { getCurrentAccount } from "@/lib/local-auth";
import type { PlanId } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlanId(value: string): value is PlanId {
  return value in bookingPlanRules;
}

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return Response.json(
      { ok: false, message: "Connexion requise." },
      { status: 401 },
    );
  }

  const bookings = await readBookingsByAccount(account.id);
  return Response.json({
    ok: true,
    bookings,
  });
}

export async function POST(request: Request) {
  const account = await getCurrentAccount();

  if (!account) {
    return Response.json(
      { ok: false, message: "Connectez-vous avant de réserver." },
      { status: 401 },
    );
  }

  let payload: Partial<BookingRequest>;

  try {
    payload = (await request.json()) as Partial<BookingRequest>;
  } catch {
    return Response.json(
      { ok: false, message: "La réservation est illisible." },
      { status: 400 },
    );
  }

  const planId = asText(payload.planId);
  const date = asText(payload.date);
  const time = asText(payload.time);
  const studentName = asText(payload.studentName);
  const level = asText(payload.level);
  const topic = asText(payload.topic);
  const notes = asText(payload.notes);

  if (!isPlanId(planId) || !date || !time || !studentName || !level || !topic) {
    return Response.json(
      { ok: false, message: "Tous les champs nécessaires sont obligatoires." },
      { status: 400 },
    );
  }

  if (!getSlotsForPlan(planId, date).includes(time)) {
    return Response.json(
      { ok: false, message: "Ce créneau n'est pas disponible pour cette formule." },
      { status: 400 },
    );
  }

  const rule = bookingPlanRules[planId];

  if (account.tokens < rule.durationHours) {
    return Response.json(
      { ok: false, message: "Solde de jetons insuffisant pour ce créneau." },
      { status: 402 },
    );
  }

  const bookings = await readBookings();
  const isTaken = bookings.some(
    (booking) => booking.date === date && booking.time === time,
  );

  if (isTaken) {
    return Response.json(
      { ok: false, message: "Ce créneau vient d'être réservé." },
      { status: 409 },
    );
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
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const nextAccount = await upsertAccount({
    ...account,
    tokens: account.tokens - rule.durationHours,
    updatedAt: new Date().toISOString(),
  });

  await createBooking(booking);
  const publicAccount = toPublicAccount(nextAccount);

  await sendBookingConfirmationEmail(publicAccount, booking);

  return Response.json(
    { ok: true, booking, account: publicAccount },
    { status: 201 },
  );
}
