import {
  deleteAccount,
  findAccount,
  findAccountByEmail,
  readAccounts,
  creditAccountTokens,
} from "@/lib/account-store";
import { tokenPacks, toPublicAccount } from "@/lib/accounts";
import {
  deleteBookingsByAccount,
  readBookings,
  updateBooking,
} from "@/lib/booking-store";
import type { BookingStatus } from "@/lib/booking";
import type { PlanId } from "@/lib/pricing";
import {
  asBoundedText,
  apiHandler,
  assertSameOrigin,
  hasValidAdminToken,
  jsonError,
  rateLimit,
  readJsonBody,
} from "@/lib/security";
import { isPlanId } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bookingStatuses = new Set<BookingStatus>([
  "pending",
  "confirmed",
  "reschedule_requested",
  "cancel_requested",
  "cancelled",
]);

function assertAdmin(request: Request) {
  if (!hasValidAdminToken(request)) {
    return jsonError("Acces admin refuse.", 401);
  }

  return null;
}

async function handleGET(request: Request) {
  const limited = await rateLimit(request, "admin:read", 60, 60 * 1000);
  if (limited) return limited;
  const adminError = assertAdmin(request);

  if (adminError) {
    return adminError;
  }

  const [accounts, bookings] = await Promise.all([readAccounts(), readBookings()]);
  const publicAccounts = accounts.map(toPublicAccount);
  const accountById = new Map(
    publicAccounts.map((account) => [account.id, account]),
  );

  return Response.json({
    ok: true,
    accounts: publicAccounts,
    bookings: bookings
      .map((booking) => ({
        ...booking,
        account: accountById.get(booking.accountId) ?? null,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  });
}

async function handlePATCH(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  const limited = await rateLimit(request, "admin:write", 30, 60 * 1000);
  if (limited) return limited;
  const adminError = assertAdmin(request);

  if (adminError) {
    return adminError;
  }

  const json = await readJsonBody<{
    action?: unknown;
    email?: unknown;
    planId?: unknown;
    accountId?: unknown;
    bookingId?: unknown;
    status?: unknown;
  }>(request, 4_096, "La demande admin est illisible.");

  if (!json.ok) {
    return json.response;
  }

  const action = asBoundedText(json.data.action, { max: 40, min: 1 });

  if (action === "credit_tokens") {
    const email = asBoundedText(json.data.email, { max: 254, min: 3 }).toLowerCase();
    const planId = asBoundedText(json.data.planId, { max: 40, min: 1 });

    if (!email || !isPlanId(planId)) {
      return jsonError("Email ou formule invalide.", 400);
    }

    const account = await findAccountByEmail(email);

    if (!account) {
      return jsonError("Compte introuvable.", 404);
    }

    const tokenPack = tokenPacks[planId as PlanId];
    const { account: nextAccount } = await creditAccountTokens(account.id, tokenPack.tokens);

    return Response.json({
      ok: true,
      account: toPublicAccount(nextAccount),
      tokensAdded: tokenPack.tokens,
    });
  }

  if (action === "update_booking_status") {
    const bookingId = asBoundedText(json.data.bookingId, { max: 120, min: 1 });
    const status = asBoundedText(json.data.status, { max: 40, min: 1 });

    if (!bookingId || !bookingStatuses.has(status as BookingStatus)) {
      return jsonError("Reservation ou statut invalide.", 400);
    }

    const bookings = await readBookings();
    const booking = bookings.find((current) => current.id === bookingId);

    if (!booking) {
      return jsonError("Reservation introuvable.", 404);
    }

    const nextBooking = await updateBooking(booking.id, {
      status: status as BookingStatus,
    }, "admin");

    return Response.json({ ok: true, booking: nextBooking });
  }

  if (action === "delete_account") {
    const accountId = asBoundedText(json.data.accountId, { max: 120, min: 1 });

    if (!accountId) {
      return jsonError("Compte invalide.", 400);
    }

    const account = await findAccount(accountId);

    if (!account) {
      return jsonError("Compte introuvable.", 404);
    }

    await deleteBookingsByAccount(account.id);
    await deleteAccount(account.id);

    return Response.json({
      ok: true,
      deletedAccountId: account.id,
    });
  }

  return jsonError("Action admin inconnue.", 400);
}

export const GET = apiHandler(handleGET);
export const PATCH = apiHandler(handlePATCH);
