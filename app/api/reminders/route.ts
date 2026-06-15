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

function getBookingDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00+02:00`);
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

  for (const booking of dueBookings) {
    const account = await findAccount(booking.accountId);

    if (!account) {
      continue;
    }

    await sendBookingReminderEmail(toPublicAccount(account), booking);
    await updateBooking({
      ...booking,
      reminderSentAt: new Date().toISOString(),
    });
    sent += 1;
  }

  return Response.json({ ok: true, sent });
}
