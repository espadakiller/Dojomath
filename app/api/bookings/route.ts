import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { findAccount, upsertAccount } from "@/lib/account-store";
import { getAccountName } from "@/lib/accounts";
import {
  bookingPlanRules,
  getSlotsForPlan,
  type BookingRecord,
  type BookingRequest,
} from "@/lib/booking";
import type { PlanId } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dataDirectory = path.join(process.cwd(), ".data");
const bookingsFile = path.join(dataDirectory, "bookings.json");

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlanId(value: string): value is PlanId {
  return value in bookingPlanRules;
}

async function readBookings() {
  try {
    const content = await readFile(bookingsFile, "utf8");
    return JSON.parse(content) as BookingRecord[];
  } catch {
    return [];
  }
}

async function writeBookings(bookings: BookingRecord[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(bookingsFile, `${JSON.stringify(bookings, null, 2)}\n`, "utf8");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const accountId = asText(url.searchParams.get("accountId"));

  if (!accountId) {
    return Response.json(
      { ok: false, message: "Compte requis." },
      { status: 400 },
    );
  }

  const bookings = await readBookings();
  return Response.json({
    ok: true,
    bookings: bookings.filter((booking) => booking.accountId === accountId),
  });
}

export async function POST(request: Request) {
  let payload: Partial<BookingRequest>;

  try {
    payload = (await request.json()) as Partial<BookingRequest>;
  } catch {
    return Response.json(
      { ok: false, message: "La réservation est illisible." },
      { status: 400 },
    );
  }

  const accountId = asText(payload.accountId);
  const planId = asText(payload.planId);
  const date = asText(payload.date);
  const time = asText(payload.time);
  const studentName = asText(payload.studentName);
  const level = asText(payload.level);
  const topic = asText(payload.topic);
  const notes = asText(payload.notes);

  if (
    !accountId ||
    !isPlanId(planId) ||
    !date ||
    !time ||
    !studentName ||
    !level ||
    !topic
  ) {
    return Response.json(
      { ok: false, message: "Tous les champs nécessaires sont obligatoires." },
      { status: 400 },
    );
  }

  const account = await findAccount(accountId);

  if (!account) {
    return Response.json(
      { ok: false, message: "Créez un compte avant de réserver." },
      { status: 401 },
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
    accountId,
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

  await writeBookings([booking, ...bookings]);

  return Response.json({ ok: true, booking, account: nextAccount }, { status: 201 });
}
