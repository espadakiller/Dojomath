import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { bookingStartsAt, bookingsOverlap, type BookingRecord } from "@/lib/booking";
import { findAccount, upsertAccount } from "@/lib/account-store";
import { withLocalStoreLock } from "@/lib/local-store-lock";
import {
  assertStorageAvailable,
  callRpc,
  deleteRows,
  hasSupabaseStorage,
  selectRows,
  upsertRow,
  StorageError,
} from "@/lib/supabase-store";

type BookingRow = {
  id: string;
  account_id: string;
  date: string;
  time: string;
  data: BookingRecord;
};

const dataDirectory = path.join(process.cwd(), ".data");
const bookingsFile = path.join(dataDirectory, "bookings.json");

async function readLocalBookings() {
  try {
    const content = await readFile(bookingsFile, "utf8");
    return JSON.parse(content) as BookingRecord[];
  } catch {
    return [];
  }
}

async function writeLocalBookings(bookings: BookingRecord[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(bookingsFile, `${JSON.stringify(bookings, null, 2)}\n`, "utf8");
}

export async function readBookings() {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    const rows = await selectRows<BookingRow>("dojomath_bookings", {});
    return rows.map((row) => row.data);
  }

  return readLocalBookings();
}

export async function readBookingsByAccount(accountId: string) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    const rows = await selectRows<BookingRow>("dojomath_bookings", {
      account_id: `eq.${accountId}`,
      order: "created_at.desc",
    });
    return rows.map((row) => row.data);
  }

  const bookings = await readLocalBookings();
  return bookings.filter((booking) => booking.accountId === accountId);
}

async function createBooking(booking: BookingRecord) {
  if (hasSupabaseStorage) {
    await upsertRow("dojomath_bookings", {
      id: booking.id,
      account_id: booking.accountId,
      date: booking.date,
      time: booking.time,
      data: booking,
    });
    return booking;
  }

  const bookings = await readLocalBookings();
  await writeLocalBookings([booking, ...bookings]);
  return booking;
}

export async function updateBooking(
  bookingId: string,
  patch: Partial<BookingRecord>,
  action: "reschedule" | "cancel" | "admin" | "reminder",
  accountId?: string,
) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    return callRpc<BookingRecord>("dojomath_change_booking", {
      p_id: bookingId, p_patch: patch, p_action: action, p_account_id: accountId ?? null,
    });
  }
  return withLocalStoreLock(async () => {
    const bookings = await readLocalBookings();
    const current = bookings.find(booking => booking.id === bookingId);
    if (!current) throw new StorageError("Reservation introuvable.", 404, "PT404");
    if (action === "reschedule" || action === "cancel") {
      if (current.accountId !== accountId) throw new StorageError("Acces refuse.", 403, "PT403");
      if (!["pending", "confirmed"].includes(current.status) || bookingStartsAt(current.date, current.time) <= Date.now()) {
        throw new StorageError("Ce cours ne peut plus etre modifie.", 409, "PT409");
      }
    }
    const next = { ...current, ...patch };
    if (action === "reschedule") {
      delete next.changeRequest;
      delete next.reminderSentAt;
    }
    if (["reschedule", "admin"].includes(action) && next.status !== "cancelled" &&
      bookings.some(other => other.id !== next.id && other.status !== "cancelled" && bookingsOverlap(other, next))) {
      throw new StorageError("Ce creneau vient d'etre reserve.", 409, "PT409");
    }
    await writeLocalBookings(bookings.map(booking => booking.id === next.id ? next : booking));
    return next;
  });
}

export async function deleteBookingsByAccount(accountId: string) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    await deleteRows("dojomath_bookings", { account_id: `eq.${accountId}` });
    return;
  }

  const bookings = await readLocalBookings();
  await writeLocalBookings(
    bookings.filter((booking) => booking.accountId !== accountId),
  );
}

export async function reserveBooking(booking: BookingRecord) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    return callRpc<{ account: import("@/lib/accounts").AccountRecord; booking: BookingRecord }>(
      "dojomath_reserve_booking", { p_booking: booking },
    );
  }
  return withLocalStoreLock(async () => {
    const account = await findAccount(booking.accountId);
    if (!account) throw new StorageError("Compte introuvable.", 404, "PT404");
    if (account.tokens < booking.durationHours) throw new StorageError("Solde insuffisant.", 402, "PT402");
    if ((await readLocalBookings()).some(other => other.status !== "cancelled" && bookingsOverlap(other, booking))) {
      throw new StorageError("Ce creneau vient d'etre reserve.", 409, "PT409");
    }
    await createBooking(booking);
    const nextAccount = await upsertAccount({
      ...account, tokens: account.tokens - booking.durationHours, updatedAt: new Date().toISOString(),
    });
    return { account: nextAccount, booking };
  });
}
