"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  User,
  Video,
} from "lucide-react";

import { getAccountName, type AccountRecord } from "@/lib/accounts";
import {
  bookingPlanRules,
  formatDateLabel,
  getBookingDays,
  getSlotsForPlan,
  type BookingRecord,
} from "@/lib/booking";
import { pricingPlans, type PlanId } from "@/lib/pricing";

const levels = [
  "6e",
  "5e",
  "4e",
  "3e",
  "Seconde",
  "Première",
  "Terminale",
  "Supérieur",
  "Remise à niveau",
];

const planBadges = {
  liberte: "Le plus basique",
  progression: "Le plus choisi",
  stage: "Vacances scolaires uniquement",
} satisfies Record<PlanId, string>;

type AccountResponse =
  | { ok: true; account: AccountRecord; message?: string }
  | { ok: false; message: string };

type BookingResponse =
  | { ok: true; booking: BookingRecord; account: AccountRecord }
  | { ok: false; message: string };

function firstAvailableDate(planId: PlanId, days: string[]) {
  return days.find((day) => getSlotsForPlan(planId, day).length > 0) ?? days[0];
}

function getPlan(planId: PlanId) {
  return pricingPlans.find((plan) => plan.id === planId) ?? pricingPlans[0];
}

function readStoredAccountId() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem("dojomath-account-id") ?? "";
}

export default function BookingEmbed() {
  const days = useMemo(() => getBookingDays(18), []);
  const [storedAccountId] = useState(readStoredAccountId);
  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("progression");
  const [selectedDate, setSelectedDate] = useState(() =>
    firstAvailableDate("progression", days),
  );
  const [selectedSlot, setSelectedSlot] = useState("");
  const [dayPage, setDayPage] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [level, setLevel] = useState("3e");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const selectedPlan = getPlan(selectedPlanId);
  const selectedRule = bookingPlanRules[selectedPlanId];
  const availableSlots = getSlotsForPlan(selectedPlanId, selectedDate);
  const displayedDays = days.slice(dayPage * 6, dayPage * 6 + 12);
  const hasEnoughTokens = (account?.tokens ?? 0) >= selectedRule.durationHours;

  async function loadBookings(accountId: string) {
    const response = await fetch(`/api/bookings?accountId=${accountId}`, {
      cache: "no-store",
    });
    const data = (await response.json()) as {
      ok: boolean;
      bookings?: BookingRecord[];
    };

    if (data.ok) {
      setBookings(data.bookings ?? []);
    }
  }

  useEffect(() => {
    if (!storedAccountId) {
      return;
    }

    let active = true;

    async function loadAccount() {
      const response = await fetch(`/api/accounts?accountId=${storedAccountId}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as AccountResponse;

      if (!active) {
        return;
      }

      if (data.ok) {
        setAccount(data.account);
        setFirstName(data.account.firstName);
        setLastName(data.account.lastName);
        void loadBookings(data.account.id);
      } else {
        window.localStorage.removeItem("dojomath-account-id");
      }
    }

    void loadAccount();

    return () => {
      active = false;
    };
  }, [storedAccountId]);

  function selectPlan(planId: PlanId) {
    setSelectedPlanId(planId);
    setSelectedDate(firstAvailableDate(planId, days));
    setSelectedSlot("");
    setDayPage(0);
  }

  async function createAccount() {
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    });
    const data = (await response.json()) as AccountResponse;

    if (!data.ok) {
      setStatus("error");
      setMessage(data.message);
      return;
    }

    window.localStorage.setItem("dojomath-account-id", data.account.id);
    setAccount(data.account);
    setBookings([]);
    setStatus("success");
    setMessage("Compte créé. Vous pouvez maintenant ajouter des jetons.");
  }

  async function addTokens(planId: PlanId) {
    if (!account) {
      setStatus("error");
      setMessage("Créez un compte avant d'ajouter des jetons.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: account.id, planId }),
    });
    const data = (await response.json()) as AccountResponse;

    if (!data.ok) {
      setStatus("error");
      setMessage(data.message);
      return;
    }

    setAccount(data.account);
    setStatus("success");
    setMessage(data.message ?? "Jetons ajoutés.");
  }

  async function submitBooking() {
    if (!account) {
      setStatus("error");
      setMessage("Créez un compte avant de réserver.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: account.id,
        planId: selectedPlanId,
        date: selectedDate,
        time: selectedSlot,
        studentName,
        level,
        topic,
        notes,
      }),
    });
    const data = (await response.json()) as BookingResponse;

    if (!data.ok) {
      setStatus("error");
      setMessage(data.message);
      return;
    }

    setAccount(data.account);
    setBookings((current) => [data.booking, ...current]);
    setStatus("success");
    setMessage("Créneau réservé. Les jetons ont été débités du compte.");
    setSelectedSlot("");
    setTopic("");
    setNotes("");
  }

  const canCreateAccount =
    firstName.trim() && lastName.trim() && status !== "loading";
  const canSubmit =
    account &&
    hasEnoughTokens &&
    selectedSlot &&
    studentName.trim() &&
    level &&
    topic.trim() &&
    status !== "loading";
  const isSlotTaken = (time: string) =>
    bookings.some(
      (booking) => booking.date === selectedDate && booking.time === time,
    );

  return (
    <div className="glass mx-auto max-w-7xl rounded-[2rem] p-4 shadow-xl shadow-[#6f1022]/8 md:p-8">
      <div className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3]">
              <User size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171313]">
                Compte DojoMath
              </h2>
              <p className="mt-1 text-sm text-[#645c58]">
                Créez un compte avec un nom et un prénom.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#171313]">
                Prénom
              </span>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
                placeholder="Prénom"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#171313]">
                Nom
              </span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
                placeholder="Nom"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!canCreateAccount}
              onClick={createAccount}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 py-3 text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={18} />
              {account ? "Créer un autre compte" : "Créer le compte"}
            </button>
            {account && (
              <div className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#b88a3b]/35 bg-[#fffaf6] px-6 text-sm font-semibold text-[#6f1022]">
                <Coins size={18} />
                {account.tokens} jeton{account.tokens > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {account && (
            <p className="mt-4 rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-sm text-[#645c58]">
              Compte actif : <span className="font-semibold text-[#171313]">{getAccountName(account)}</span>
            </p>
          )}
        </section>

        <section className="rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3]">
              <Coins size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171313]">
                Jetons de réservation
              </h2>
              <p className="mt-1 text-sm text-[#645c58]">
                Un jeton correspond à une heure de cours.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {pricingPlans.map((plan) => {
              const active = selectedPlanId === plan.id;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => selectPlan(plan.id)}
                  className={`min-h-[178px] rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-1 ${
                    active
                      ? "border-[#6f1022] bg-[#6f1022] text-[#fffaf3] shadow-lg shadow-[#6f1022]/18"
                      : "border-[#b88a3b]/25 bg-[#fffaf6] text-[#171313] hover:border-[#b88a3b]/70"
                  }`}
                >
                  <span
                    className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${
                      active
                        ? "border-[#fffaf3]/30 text-[#f7dfb2]"
                        : "border-[#b88a3b]/35 text-[#6f1022]"
                    }`}
                  >
                    {planBadges[plan.id]}
                  </span>
                  <span className="block text-lg font-semibold">{plan.title}</span>
                  <span className="mt-2 block text-2xl font-semibold">
                    {plan.price}
                  </span>
                  <span
                    className={`mt-3 block text-sm leading-5 ${
                      active ? "text-[#fffaf3]/78" : "text-[#645c58]"
                    }`}
                  >
                    Réservation débitée selon la durée du cours.
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={selectedPlan.stripeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#b88a3b]/40 bg-[#fffaf6] px-6 py-3 text-sm font-semibold text-[#6f1022] transition hover:scale-[1.02] hover:border-[#6f1022]"
            >
              <CreditCard size={18} />
              Paiement {selectedPlan.title}
            </a>
            <button
              type="button"
              disabled={!account || status === "loading"}
              onClick={() => addTokens(selectedPlanId)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 py-3 text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Coins size={18} />
              Ajouter les jetons
            </button>
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171313]">
                Calendrier
              </h2>
              <p className="mt-1 text-sm text-[#645c58]">
                {selectedPlan.title} · {selectedRule.durationHours} jeton
                {selectedRule.durationHours > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={dayPage === 0}
                onClick={() => setDayPage((current) => Math.max(current - 1, 0))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b88a3b]/35 bg-[#fffaf6] text-[#6f1022] disabled:opacity-40"
                aria-label="Semaine précédente"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                disabled={dayPage >= Math.ceil(days.length / 6) - 2}
                onClick={() =>
                  setDayPage((current) =>
                    Math.min(current + 1, Math.ceil(days.length / 6) - 2),
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b88a3b]/35 bg-[#fffaf6] text-[#6f1022] disabled:opacity-40"
                aria-label="Semaine suivante"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {displayedDays.map((day) => {
              const hasSlots = getSlotsForPlan(selectedPlanId, day).length > 0;
              const active = selectedDate === day;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={!hasSlots}
                  onClick={() => {
                    setSelectedDate(day);
                    setSelectedSlot("");
                  }}
                  className={`min-h-20 rounded-[1.15rem] border px-3 py-3 text-left transition ${
                    active
                      ? "border-[#6f1022] bg-[#6f1022] text-[#fffaf3]"
                      : "border-[#b88a3b]/25 bg-[#fffaf6] text-[#171313] hover:border-[#b88a3b]/70"
                  } disabled:cursor-not-allowed disabled:opacity-35`}
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em]">
                    {formatDateLabel(day, "short").split(" ")[0]}
                  </span>
                  <span className="mt-2 block text-lg font-semibold">
                    {formatDateLabel(day, "short").replace(".", "")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#171313]">
              <Clock size={17} />
              {formatDateLabel(selectedDate, "long")}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {availableSlots.map((slot) => {
                const taken = isSlotTaken(slot);
                const active = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={taken}
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex min-h-14 items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "border-[#6f1022] bg-[#6f1022] text-[#fffaf3]"
                        : "border-[#b88a3b]/25 bg-[#fffaf6] text-[#171313] hover:border-[#6f1022]"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    <span>{slot}</span>
                    {taken ? "Pris" : `${selectedRule.durationHours} jeton`}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3]">
              <CalendarDays size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171313]">
                Réservation
              </h2>
              <p className="mt-1 text-sm text-[#645c58]">
                {selectedSlot
                  ? `${formatDateLabel(selectedDate, "long")} à ${selectedSlot}`
                  : "Choisissez un créneau pour finaliser."}
              </p>
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f1022]">
                Formule
              </p>
              <p className="mt-1 font-semibold text-[#171313]">{selectedPlan.title}</p>
            </div>
            <div className="rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f1022]">
                Coût
              </p>
              <p className="mt-1 font-semibold text-[#171313]">
                {selectedRule.durationHours} jeton
                {selectedRule.durationHours > 1 ? "s" : ""}
              </p>
            </div>
            <div className="rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f1022]">
                Solde
              </p>
              <p className="mt-1 font-semibold text-[#171313]">
                {account?.tokens ?? 0} jeton{(account?.tokens ?? 0) > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#171313]">
                Élève
              </span>
              <input
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
                placeholder="Nom de l'élève"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#171313]">
                Niveau
              </span>
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition focus:border-[#6f1022]"
              >
                {levels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-[#171313]">
              Objectif du cours
            </span>
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
              placeholder="Contrôle, chapitre, brevet, bac..."
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-[#171313]">
              Notes utiles
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
              placeholder="Difficultés, disponibilités récurrentes, informations parents..."
            />
          </label>

          {message && (
            <p
              className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
                status === "error"
                  ? "border border-[#d14f72]/25 bg-[#fffaf6] text-[#6f1022]"
                  : "border border-[#b88a3b]/25 bg-[#fffaf6] text-[#245447]"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="button"
            disabled={!canSubmit}
            onClick={submitBooking}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 py-3 text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={18} />
            {status === "loading"
              ? "Réservation..."
              : !account
                ? "Compte requis"
                : !hasEnoughTokens
                  ? "Jetons insuffisants"
                  : "Confirmer le créneau"}
          </button>
        </section>
      </div>

      <section className="mt-5 rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3]">
            <Video size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171313]">
              Mes réservations
            </h2>
            <p className="mt-1 text-sm text-[#645c58]">
              Les créneaux liés au compte actif apparaissent ici.
            </p>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {bookings.slice(0, 6).map((booking) => (
              <article
                key={booking.id}
                className="rounded-[1.15rem] border border-[#b88a3b]/25 bg-[#fffaf6] p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#171313]">{booking.planTitle}</p>
                  <span className="rounded-full bg-[#6f1022] px-3 py-1 text-xs font-semibold text-[#fffaf3]">
                    En attente
                  </span>
                </div>
                <p className="flex items-center gap-2 text-sm text-[#645c58]">
                  <CalendarDays size={16} />
                  {formatDateLabel(booking.date, "long")} · {booking.time}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#645c58]">
                  <Video size={16} />
                  {booking.studentName} · {booking.level}
                </p>
                <p className="mt-3 text-sm font-medium text-[#171313]">
                  {booking.topic}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-sm text-[#645c58]">
            Aucune réservation pour ce compte.
          </p>
        )}
      </section>
    </div>
  );
}
