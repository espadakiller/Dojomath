"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Coins,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import type { PublicAccount } from "@/lib/accounts";
import type { BookingRecord, BookingStatus } from "@/lib/booking";
import { formatDateLabel } from "@/lib/booking";
import type { PlanId } from "@/lib/pricing";

type AdminBooking = BookingRecord & {
  account: PublicAccount | null;
};

type AdminData = {
  ok: true;
  accounts: PublicAccount[];
  bookings: AdminBooking[];
};

type AdminError = {
  ok: false;
  message: string;
};

const planLabels = {
  liberte: "Liberté",
  progression: "Progression",
  stage: "Stage Vacances",
} satisfies Record<PlanId, string>;

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  reschedule_requested: "Déplacement demandé",
  cancel_requested: "Annulation demandée",
  cancelled: "Annulée",
} satisfies Record<BookingStatus, string>;

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [message, setMessage] = useState("");
  const [creditEmail, setCreditEmail] = useState("");
  const [creditPlan, setCreditPlan] = useState<PlanId>("progression");
  const [loading, setLoading] = useState(false);

  const stats = useMemo(
    () => ({
      accounts: data?.accounts.length ?? 0,
      bookings: data?.bookings.length ?? 0,
      pending:
        data?.bookings.filter((booking) =>
          ["pending", "reschedule_requested", "cancel_requested"].includes(
            booking.status,
          ),
        ).length ?? 0,
    }),
    [data],
  );

  async function api<T>(init?: RequestInit) {
    const response = await fetch("/api/admin", {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-dojomath-admin-token": token,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    return (await response.json()) as T;
  }

  async function loadAdminData() {
    setLoading(true);
    setMessage("");
    const result = await api<AdminData | AdminError>();
    setLoading(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setData(result);
    setMessage("Espace admin chargé.");
  }

  async function creditTokens() {
    setLoading(true);
    setMessage("");
    const result = await api<{ ok: true } | AdminError>({
      method: "PATCH",
      body: JSON.stringify({
        action: "credit_tokens",
        email: creditEmail,
        planId: creditPlan,
      }),
    });
    setLoading(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage("Jetons ajoutés.");
    await loadAdminData();
  }

  async function updateStatus(bookingId: string, status: BookingStatus) {
    setLoading(true);
    setMessage("");
    const result = await api<{ ok: true } | AdminError>({
      method: "PATCH",
      body: JSON.stringify({
        action: "update_booking_status",
        bookingId,
        status,
      }),
    });
    setLoading(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage("Statut mis à jour.");
    await loadAdminData();
  }

  async function deleteAccountById(account: PublicAccount) {
    const confirmed = window.confirm(
      `Supprimer le compte ${account.email} et ses réservations ?`,
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");
    const result = await api<{ ok: true } | AdminError>({
      method: "PATCH",
      body: JSON.stringify({
        action: "delete_account",
        accountId: account.id,
      }),
    });
    setLoading(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage("Compte supprimé.");
    await loadAdminData();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section className="glass rounded-[2rem] p-5 shadow-xl shadow-[#6f1022]/8 md:p-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-[#6f1022]">Admin</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#171313] md:text-6xl">
              Pilotage DojoMath
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[#645c58]">
              Suivi des comptes, réservations, crédits et demandes clients.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[520px]">
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              type="password"
              className="min-h-12 flex-1 rounded-full border border-[#b88a3b]/30 bg-[#fffaf6] px-5 outline-none focus:border-[#6f1022]"
              placeholder="Token admin"
            />
            <button
              type="button"
              onClick={loadAdminData}
              disabled={!token || loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 text-sm font-semibold text-[#fffaf3] disabled:opacity-50"
            >
              <ShieldCheck size={17} />
              Ouvrir
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-5 rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-sm font-semibold text-[#6f1022]">
            {message}
          </p>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { icon: UserRound, label: "Comptes", value: stats.accounts },
            { icon: CalendarDays, label: "Réservations", value: stats.bookings },
            { icon: RefreshCw, label: "À traiter", value: stats.pending },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.25rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5"
            >
              <item.icon className="text-[#6f1022]" size={22} />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#6f1022]">
                {item.label}
              </p>
              <p className="mt-1 text-3xl font-semibold text-[#171313]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {data && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="glass rounded-[2rem] p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Coins className="text-[#6f1022]" />
              <h2 className="text-2xl font-semibold text-[#171313]">
                Crédit manuel
              </h2>
            </div>
            <div className="grid gap-3">
              <input
                value={creditEmail}
                onChange={(event) => setCreditEmail(event.target.value)}
                className="min-h-12 rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 outline-none focus:border-[#6f1022]"
                placeholder="email du compte"
              />
              <select
                value={creditPlan}
                onChange={(event) => setCreditPlan(event.target.value as PlanId)}
                className="min-h-12 rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 outline-none focus:border-[#6f1022]"
              >
                {Object.entries(planLabels).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={creditTokens}
                disabled={!creditEmail || loading}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#6f1022] px-5 text-sm font-semibold text-[#fffaf3] disabled:opacity-50"
              >
                Ajouter les jetons
              </button>
            </div>

            <h2 className="mt-8 text-2xl font-semibold text-[#171313]">
              Comptes
            </h2>
            <div className="mt-4 grid gap-3">
              {data.accounts.map((account) => (
                <article
                  key={account.id}
                  className="rounded-[1.1rem] border border-[#b88a3b]/25 bg-[#fffaf6] p-4"
                >
                  <p className="font-semibold text-[#171313]">
                    {account.firstName} {account.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[#645c58]">{account.email}</p>
                  <p className="mt-2 text-sm font-semibold text-[#6f1022]">
                    {account.tokens} jeton{account.tokens > 1 ? "s" : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteAccountById(account)}
                    disabled={loading}
                    className="mt-4 inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-[#d14f72]/25 bg-white px-4 text-xs font-semibold text-[#6f1022] transition hover:border-[#6f1022] disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="glass rounded-[2rem] p-5 md:p-6">
            <h2 className="text-2xl font-semibold text-[#171313]">
              Réservations
            </h2>
            <div className="mt-4 grid gap-3">
              {data.bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[1.1rem] border border-[#b88a3b]/25 bg-[#fffaf6] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#171313]">
                        {booking.planTitle} · {booking.studentName}
                      </p>
                      <p className="mt-1 text-sm text-[#645c58]">
                        {formatDateLabel(booking.date, "long")} à {booking.time}
                      </p>
                      <p className="mt-1 text-sm text-[#645c58]">
                        {booking.account?.email ?? booking.customerName}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#6f1022] px-3 py-1 text-xs font-semibold text-[#fffaf3]">
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#171313]">{booking.topic}</p>
                  {booking.changeRequest && (
                    <p className="mt-3 rounded-xl border border-[#b88a3b]/25 bg-white px-3 py-2 text-sm text-[#645c58]">
                      {booking.changeRequest.message}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(["confirmed", "cancelled"] as BookingStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateStatus(booking.id, status)}
                          className="min-h-9 rounded-full border border-[#b88a3b]/35 bg-white px-4 text-xs font-semibold text-[#6f1022] transition hover:border-[#6f1022]"
                        >
                          {statusLabels[status]}
                        </button>
                      ),
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
