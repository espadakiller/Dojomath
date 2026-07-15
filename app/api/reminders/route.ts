import { findAccount } from "@/lib/account-store";
import { toPublicAccount } from "@/lib/accounts";
import { readBookings, updateBooking } from "@/lib/booking-store";
import { sendBookingReminderEmail } from "@/lib/email";
import { hasValidAdminToken, jsonError } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function hasValidReminderSecret(request: Request) {
  const secret = process.env.REMINDER_SECRET;
  const provided = request.headers.get("x-dojomath-reminder-secret");

  return Boolean(secret && provided && secret === provided);
}

function getParisOffsetMs(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  const parisAsUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second,
  );

  return parisAsUtc - date.getTime();
}

function getBookingDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  return new Date(utcGuess.getTime() - getParisOffsetMs(utcGuess));
}

export async function POST(request: Request) {
  if (!hasValidReminderSecret(request) && !hasValidAdminToken(request)) {
    return jsonError("Acces rappel refuse.", 401);
  }

  const now = Date.now();
  const startsAfter = now + 20 * 60 * 60 * 1000;
  const startsBefore = now + 28 * 60 * 60 * 1000;
  const bookings = await readBookings();
  const dueBookings = bookings.filter((booking) => {
    const startsAt = getBookingDateTime(booking.date, booking.time).getTime();

    return (
      !booking.reminderSentAt &&
      ["pending", "confirmed"].includes(booking.status) &&
      startsAt >= startsAfter &&
      startsAt <= startsBefore
    );
  });

  let sent = 0;
  let failed = 0;

  for (const booking of dueBookings) {
    const account = await findAccount(booking.accountId);

    if (!account) {
      continue;
    }

    const emailResult = await sendBookingReminderEmail(
      toPublicAccount(account),
      booking,
    );

    if (!emailResult.ok) {
      failed += 1;
      continue;
    }

    await updateBooking({
      ...booking,
      reminderSentAt: new Date().toISOString(),
    });
    sent += 1;
  }

  return Response.json({ ok: failed === 0, sent, failed, due: dueBookings.length });
}
