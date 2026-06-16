import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { BookingRecord } from "@/lib/booking";
import {
  deleteRows,
  hasSupabaseStorage,
  selectRows,
  upsertRow,
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
  if (hasSupabaseStorage) {
    const rows = await selectRows<BookingRow>("dojomath_bookings", {});
    return rows.map((row) => row.data);
  }

  return readLocalBookings();
}

export async function readBookingsByAccount(accountId: string) {
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

export async function createBooking(booking: BookingRecord) {
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

export async function updateBooking(booking: BookingRecord) {
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
  await writeLocalBookings(
    bookings.map((current) => (current.id === booking.id ? booking : current)),
  );
  return booking;
}

export async function deleteBookingsByAccount(accountId: string) {
  if (hasSupabaseStorage) {
    await deleteRows("dojomath_bookings", { account_id: `eq.${accountId}` });
    return;
  }

  const bookings = await readLocalBookings();
  await writeLocalBookings(
    bookings.filter((booking) => booking.accountId !== accountId),
  );
}
