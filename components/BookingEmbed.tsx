"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  LogOut,
  RefreshCw,
  ShieldCheck,
  User,
  Video,
  XCircle,
} from "lucide-react";

import { getAccountName, type PublicAccount } from "@/lib/accounts";
import {
  bookingPlanRules,
  bookingsOverlap,
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
  | { ok: true; account: PublicAccount | null; message?: string }
  | { ok: false; message: string };

type BookingResponse =
  | { ok: true; booking: BookingRecord; account: PublicAccount }
  | { ok: false; message: string };

type ChangeBookingResponse =
  | { ok: true; booking: BookingRecord }
  | { ok: false; message: string };

type OccupiedSlot = {
  id: string;
  date: string;
  time: string;
  durationHours?: number;
};

function firstAvailableDate(planId: PlanId, days: string[]) {
  return days.find((day) => getSlotsForPlan(planId, day).length > 0) ?? days[0];
}

function getPlan(planId: PlanId) {
  return pricingPlans.find((plan) => plan.id === planId) ?? pricingPlans[0];
}

function getPaymentHref(planHref: string, account: PublicAccount, planId: PlanId) {
  const url = new URL(planHref);
  url.searchParams.set("client_reference_id", `${account.id}_${planId}`);
  url.searchParams.set("prefilled_email", account.email);
  return url.toString();
}

function getBookingStatusLabel(status: BookingRecord["status"]) {
  const labels = {
    pending: "En attente",
    confirmed: "Confirmée",
    reschedule_requested: "Déplacement demandé",
    cancel_requested: "Annulation demandée",
    cancelled: "Annulée",
  } satisfies Record<BookingRecord["status"], string>;

  return labels[status];
}

const daysPerPage = 12;

type ApiFailure = { ok: false; message: string };

async function apiRequest<T extends { ok: boolean }>(
  input: string,
  init?: RequestInit,
  fallbackMessage = "Le service est momentanément indisponible. Réessayez dans quelques instants.",
): Promise<T | ApiFailure> {
  try {
    const response = await fetch(input, init);
    const data = (await response.json().catch(() => null)) as T | null;

    if (!data || typeof data !== "object" || !("ok" in data)) {
      return { ok: false, message: fallbackMessage };
    }

    return data;
  } catch {
    return { ok: false, message: fallbackMessage };
  }
}

export default function BookingEmbed() {
  const days = useMemo(() => getBookingDays(), []);
  const [account, setAccount] = useState<PublicAccount | null>(null);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  const [reschedulingBookingId, setReschedulingBookingId] = useState<
    string | null
  >(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(
    null,
  );
  const [cancellationReason, setCancellationReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [authNotice, setAuthNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [changeStatus, setChangeStatus] = useState<{
    bookingId: string;
    message: string;
    type: "success" | "error";
  } | null>(null);

  const selectedPlan = getPlan(selectedPlanId);
  const selectedRule = bookingPlanRules[selectedPlanId];
  const reschedulingBooking =
    bookings.find((booking) => booking.id === reschedulingBookingId) ?? null;
  const availableSlots = getSlotsForPlan(selectedPlanId, selectedDate);
  const totalDayPages = Math.max(1, Math.ceil(days.length / daysPerPage));
  const displayedDays = days.slice(
    dayPage * daysPerPage,
    dayPage * daysPerPage + daysPerPage,
  );
  const hasEnoughTokens = (account?.tokens ?? 0) >= selectedRule.durationHours;
  const paymentHref = account
    ? getPaymentHref(selectedPlan.stripeHref, account, selectedPlanId)
    : "";
  const progressSteps = [
    { label: "Compte", done: Boolean(account) },
    { label: "Heures", done: hasEnoughTokens },
    { label: "Créneau", done: Boolean(selectedSlot) },
    {
      label: "Infos",
      done: Boolean(studentName.trim() && level && topic.trim()),
    },
  ];

  async function loadBookings() {
    const data = await apiRequest<{
      ok: boolean;
      message?: string;
      bookings?: BookingRecord[];
      occupiedSlots?: OccupiedSlot[];
    }>("/api/bookings", { cache: "no-store" });

    if (!data.ok) {
      setStatus("error");
      setMessage(data.message ?? "Impossible de charger les réservations.");
      return;
    }

    setBookings(data.bookings ?? []);
    setOccupiedSlots(data.occupiedSlots ?? []);
  }

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const data = await apiRequest<AccountResponse>("/api/accounts", {
        cache: "no-store",
      });

      if (!active) {
        return;
      }

      if (!data.ok) {
        setStatus("error");
        setAuthNotice({ type: "error", message: data.message });
        return;
      }

      setAccount(data.account);
      if (data.account) {
        setFirstName(data.account.firstName);
        setLastName(data.account.lastName);
        setEmail(data.account.email);
        void loadBookings();
      }
    }

    void loadAccount();

    return () => {
      active = false;
    };
  }, []);

  function selectPlan(planId: PlanId) {
    setSelectedPlanId(planId);
    setSelectedDate(firstAvailableDate(planId, days));
    setSelectedSlot("");
    setDayPage(0);
  }

  async function submitAccount() {
    setStatus("loading");
    setMessage("");
    setAuthNotice(null);

    const data = await apiRequest<AccountResponse>("/api/accounts", {
      method: authMode === "signup" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!data.ok || !data.account) {
      setStatus("error");
      setMessage(data.ok ? "Compte introuvable." : data.message);
      setAuthNotice({
        type: "error",
        message: data.ok ? "Compte introuvable." : data.message,
      });
      return;
    }

    setAccount(data.account);
    void loadBookings();
    setStatus("success");
    setAuthNotice({
      type: "success",
      message:
        data.message ??
        (authMode === "signup"
          ? "Compte créé. Un email de confirmation vient d'être envoyé."
          : "Connexion réussie. Vous êtes bien connecté."),
    });
    setMessage("");
  }

  async function logout() {
    const data = await apiRequest<{ ok: boolean; message?: string }>(
      "/api/accounts",
      { method: "DELETE" },
    );

    if (!data.ok) {
      setAuthNotice({
        type: "error",
        message: data.message ?? "La déconnexion a échoué.",
      });
      return;
    }

    setAccount(null);
    setBookings([]);
    setPassword("");
    setStatus("idle");
    setMessage("");
    setAuthNotice(null);
  }

  async function submitBooking() {
    if (!account) {
      setStatus("error");
      setMessage("Créez un compte avant de réserver.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const data = await apiRequest<BookingResponse>("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: selectedPlanId,
        date: selectedDate,
        time: selectedSlot,
        studentName,
        level,
        topic,
        notes,
      }),
    });

    if (!data.ok) {
      setStatus("error");
      setMessage(data.message);
      return;
    }

    setAccount(data.account);
    setBookings((current) => [data.booking, ...current]);
    setOccupiedSlots((current) => [
      { id: data.booking.id, date: data.booking.date, time: data.booking.time, durationHours: data.booking.durationHours },
      ...current,
    ]);
    setStatus("success");
    setMessage("Créneau réservé. Le crédit d'heures a été débité du compte.");
    setSelectedSlot("");
    setTopic("");
    setNotes("");
  }

  function startReschedule(booking: BookingRecord) {
    setSelectedPlanId(booking.planId);
    setSelectedDate(booking.date);
    setSelectedSlot("");
    setDayPage(
      Math.max(0, Math.floor(days.indexOf(booking.date) / daysPerPage)),
    );
    setReschedulingBookingId(booking.id);
    setCancellingBookingId(null);
    setCancellationReason("");
    setChangeStatus(null);
    setMessage(
      "Choisissez un nouveau créneau disponible dans le calendrier, puis confirmez le déplacement.",
    );
  }

  async function submitReschedule() {
    if (!reschedulingBooking || !selectedSlot) {
      setStatus("error");
      setMessage("Choisissez un nouveau créneau pour déplacer le cours.");
      return;
    }

    setStatus("loading");
    setMessage("");
    setChangeStatus(null);

    const data = await apiRequest<ChangeBookingResponse>("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: reschedulingBooking.id,
        action: "reschedule",
        date: selectedDate,
        time: selectedSlot,
      }),
    });

    if (!data.ok) {
      setStatus("error");
      setMessage(data.message);
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === data.booking.id ? data.booking : booking,
      ),
    );
    setOccupiedSlots((current) => [
      { id: data.booking.id, date: data.booking.date, time: data.booking.time, durationHours: data.booking.durationHours },
      ...current.filter((slot) => slot.id !== data.booking.id),
    ]);
    setReschedulingBookingId(null);
    setSelectedSlot("");
    setStatus("success");
    setMessage("Cours déplacé. Le nouveau créneau est bien réservé.");
  }

  async function requestBookingCancellation(bookingId: string) {
    const requestMessage = cancellationReason.trim();

    if (requestMessage.length < 3) {
      setChangeStatus({
        bookingId,
        type: "error",
        message: "Indiquez brièvement la raison de l'annulation.",
      });
      return;
    }

    setStatus("loading");
    setChangeStatus(null);

    const data = await apiRequest<ChangeBookingResponse>("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        action: "cancel",
        message: requestMessage,
      }),
    });

    if (!data.ok) {
      setStatus("error");
      setChangeStatus({
        bookingId,
        type: "error",
        message: data.message,
      });
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === data.booking.id ? data.booking : booking,
      ),
    );
    setCancellingBookingId(null);
    setCancellationReason("");
    setStatus("success");
    setChangeStatus({
      bookingId,
      type: "success",
      message: "Demande envoyée. Elle sera traitée rapidement.",
    });
  }

  const canCreateAccount =
    email.trim() &&
    password.trim() &&
    (authMode === "login" || (firstName.trim() && lastName.trim())) &&
    status !== "loading";
  const canSubmit =
    account &&
    !reschedulingBooking &&
    hasEnoughTokens &&
    selectedSlot &&
    studentName.trim() &&
    level &&
    topic.trim() &&
    status !== "loading";
  const canReschedule = Boolean(
    reschedulingBooking &&
    selectedSlot &&
    status !== "loading" &&
    (selectedDate !== reschedulingBooking.date ||
      selectedSlot !== reschedulingBooking.time),
  );
  const isSlotTaken = (time: string) =>
    occupiedSlots.some(
      (slot) =>
        slot.id !== reschedulingBookingId &&
        bookingsOverlap({ ...slot, durationHours: slot.durationHours ?? 1 }, {
          date: selectedDate, time, durationHours: selectedRule.durationHours,
        }),
    );

  return (
    <div className="glass mx-auto max-w-7xl rounded-[2rem] p-4 shadow-xl shadow-[#6f1022]/8 md:p-8">
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid gap-2 sm:grid-cols-4">
          {progressSteps.map((step, index) => (
            <div
              key={step.label}
              className={`flex min-h-12 items-center gap-3 rounded-full border px-4 text-sm font-semibold ${
                step.done
                  ? "border-[#245447]/20 bg-[#f4fbf7] text-[#245447]"
                  : "border-[#b88a3b]/25 bg-[#fffaf6] text-[#645c58]"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                  step.done
                    ? "bg-[#245447] text-[#fffaf3]"
                    : "bg-[#f1e5d5] text-[#6f1022]"
                }`}
              >
                {step.done ? <Check size={15} /> : index + 1}
              </span>
              {step.label}
            </div>
          ))}
        </div>
        {account && (
          <div className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-5 text-sm font-semibold text-[#fffaf3] shadow-md shadow-[#6f1022]/15">
            <BadgeCheck size={17} />
            {account.tokens} h disponible
            {account.tokens > 1 ? "s" : ""}
          </div>
        )}
      </div>

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
                Identifiez-vous avec un email et un mot de passe.
              </p>
            </div>
          </div>

          {account && (
            <div className="rounded-[1.35rem] border border-[#245447]/20 bg-[#f4fbf7] p-5 text-[#171313] shadow-sm shadow-[#245447]/8">
              <div className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-full bg-[#245447] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#fffaf3]">
                <Check size={16} />
                Connecté
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                {getAccountName(account)}
              </h3>
              <p className="mt-1 text-sm text-[#645c58]">{account.email}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#245447]/15 bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#245447]">
                    Solde
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#171313]">
                    {account.tokens} h
                  </p>
                </div>
                <div className="rounded-xl border border-[#245447]/15 bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#245447]">
                    Statut
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#171313]">
                    Session active
                  </p>
                </div>
              </div>

              {authNotice && (
                <p
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
                    authNotice.type === "error"
                      ? "border-[#d14f72]/25 bg-[#fffaf6] text-[#6f1022]"
                      : "border-[#245447]/20 bg-white/70 text-[#245447]"
                  }`}
                >
                  {authNotice.message}
                </p>
              )}

              <button
                type="button"
                onClick={logout}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#245447]/25 bg-white/70 px-5 text-sm font-semibold text-[#245447] transition hover:border-[#245447]"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}

          {!account && (
            <>
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-[#b88a3b]/25 bg-[#fffaf6] p-1">
                {(["signup", "login"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setAuthMode(mode);
                      setMessage("");
                      setAuthNotice(null);
                    }}
                    className={`min-h-10 rounded-full px-4 text-sm font-semibold transition ${
                      authMode === mode
                        ? "bg-[#6f1022] text-[#fffaf3]"
                        : "text-[#6f1022] hover:bg-[#fffaf3]"
                    }`}
                  >
                    {mode === "signup" ? "Créer un compte" : "Se connecter"}
                  </button>
                ))}
              </div>

              {authMode === "signup" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#171313]">
                      Prénom
                    </span>
                    <input
                      type="text"
                      autoComplete="given-name"
                      maxLength={80}
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
                      type="text"
                      autoComplete="family-name"
                      maxLength={80}
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
                      placeholder="Nom"
                    />
                  </label>
                </div>
              )}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#171313]">
                    Email
                  </span>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
                    placeholder="parent@email.fr"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#171313]">
                    Mot de passe
                  </span>
                  <input
                    type="password"
                    autoComplete={
                      authMode === "signup" ? "new-password" : "current-password"
                    }
                    minLength={8}
                    maxLength={128}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
                    placeholder="8 caractères minimum"
                  />
                </label>
              </div>

              {authNotice && (
                <p
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
                    authNotice.type === "error"
                      ? "border-[#d14f72]/25 bg-[#fffaf6] text-[#6f1022]"
                      : "border-[#245447]/20 bg-[#f4fbf7] text-[#245447]"
                  }`}
                >
                  {authNotice.message}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={!canCreateAccount}
                  onClick={submitAccount}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 py-3 text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check size={18} />
                  {authMode === "signup" ? "Créer le compte" : "Se connecter"}
                </button>
              </div>
            </>
          )}
        </section>

        <section className="rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3]">
              <Coins size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171313]">
                Crédit d&apos;heures
              </h2>
              <p className="mt-1 text-sm text-[#645c58]">
                Une heure achetée permet de réserver une heure de cours.
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
                  disabled={Boolean(reschedulingBooking)}
                  onClick={() => selectPlan(plan.id)}
                  className={`flex min-h-[210px] flex-col rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-1 ${
                    active
                      ? "border-[#6f1022] bg-[#6f1022] text-[#fffaf3] shadow-lg shadow-[#6f1022]/18"
                      : "border-[#b88a3b]/25 bg-[#fffaf6] text-[#171313] hover:border-[#b88a3b]/70"
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  <span
                    className={`mb-4 flex min-h-11 w-full max-w-[10.75rem] items-center justify-center rounded-full border px-3 py-2 text-center text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.12em] ${
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
                      active ? "text-[#fffaf3]/82" : "text-[#5b514c]"
                    }`}
                  >
                    Réservation débitée selon la durée du cours.
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {account ? (
              <a
                href={paymentHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#b88a3b]/40 bg-[#fffaf6] px-6 py-3 text-sm font-semibold text-[#6f1022] transition hover:scale-[1.02] hover:border-[#6f1022]"
              >
                <CreditCard size={18} />
                Paiement {selectedPlan.title}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#b88a3b]/25 bg-[#fffaf6] px-6 py-3 text-sm font-semibold text-[#645c58] opacity-70"
              >
                <ShieldCheck size={18} />
                Connectez-vous pour payer
              </button>
            )}
            <div className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 py-3 text-center text-sm font-semibold text-[#fffaf3]">
              <Coins size={18} />
              Crédit automatique après paiement
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#645c58]">
            Le paiement est lié au compte connecté. Dès que Stripe confirme le
            règlement, les heures sont ajoutées automatiquement.
          </p>
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
                Deux mois de disponibilités · {selectedPlan.title} ·{" "}
                {selectedRule.durationHours} h
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
                disabled={dayPage >= totalDayPages - 1}
                onClick={() =>
                  setDayPage((current) =>
                    Math.min(current + 1, totalDayPages - 1),
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
              {formatDateLabel(selectedDate, "long")} · {availableSlots.length}{" "}
              créneau{availableSlots.length > 1 ? "x" : ""}
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
                    {taken ? "Pris" : `${selectedRule.durationHours} h`}
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

          {reschedulingBooking && (
            <div className="mb-5 rounded-[1.15rem] border border-[#245447]/20 bg-[#f4fbf7] p-4">
              <p className="text-sm font-semibold text-[#245447]">
                Déplacement en cours
              </p>
              <p className="mt-1 text-sm leading-6 text-[#645c58]">
                Cours de {reschedulingBooking.studentName} prévu le{" "}
                {formatDateLabel(reschedulingBooking.date, "long")} à{" "}
                {reschedulingBooking.time}. Choisissez un nouveau créneau libre
                dans le calendrier.
              </p>
              <button
                type="button"
                onClick={() => {
                  setReschedulingBookingId(null);
                  setSelectedSlot("");
                  setMessage("");
                }}
                className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full border border-[#245447]/25 bg-white px-4 text-xs font-semibold text-[#245447]"
              >
                Annuler le déplacement
              </button>
            </div>
          )}

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
                {selectedRule.durationHours} h
                {selectedRule.durationHours > 1 ? "s" : ""}
              </p>
            </div>
            <div className="rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f1022]">
                Solde
              </p>
              <p className="mt-1 font-semibold text-[#171313]">
                {account?.tokens ?? 0} h
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#171313]">
                Élève
              </span>
              <input
                type="text"
                autoComplete="off"
                maxLength={80}
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
              type="text"
              maxLength={160}
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
              maxLength={1000}
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
            disabled={reschedulingBooking ? !canReschedule : !canSubmit}
            onClick={reschedulingBooking ? submitReschedule : submitBooking}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 py-3 text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={18} />
            {status === "loading"
              ? reschedulingBooking
                ? "Déplacement..."
                : "Réservation..."
              : reschedulingBooking
                ? "Confirmer le déplacement"
                : !account
                  ? "Compte requis"
                  : !hasEnoughTokens
                    ? "Crédit d'heures insuffisant"
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
                    {getBookingStatusLabel(booking.status)}
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
                {cancellingBookingId === booking.id && (
                  <div className="mt-4 rounded-xl border border-[#b88a3b]/30 bg-white p-3">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-[#171313]">
                        Motif de l’annulation
                      </span>
                      <textarea
                        value={cancellationReason}
                        onChange={(event) =>
                          setCancellationReason(event.target.value)
                        }
                        rows={3}
                        maxLength={800}
                        className="w-full resize-none rounded-lg border border-[#b88a3b]/30 bg-[#fffaf6] px-3 py-2 text-sm text-[#171313] outline-none transition focus:border-[#6f1022]"
                        placeholder="Expliquez brièvement votre demande..."
                      />
                    </label>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCancellingBookingId(null);
                          setCancellationReason("");
                          setChangeStatus(null);
                        }}
                        className="min-h-10 rounded-full border border-[#b88a3b]/35 px-3 text-xs font-semibold text-[#645c58] transition hover:border-[#6f1022]"
                      >
                        Retour
                      </button>
                      <button
                        type="button"
                        disabled={
                          cancellationReason.trim().length < 3 ||
                          status === "loading"
                        }
                        onClick={() => requestBookingCancellation(booking.id)}
                        className="min-h-10 rounded-full bg-[#6f1022] px-3 text-xs font-semibold text-[#fffaf3] transition hover:bg-[#8a1730] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Confirmer
                      </button>
                    </div>
                  </div>
                )}
                {changeStatus?.bookingId === booking.id && (
                  <p
                    className={`mt-3 rounded-xl border px-3 py-2 text-xs font-semibold ${
                      changeStatus.type === "error"
                        ? "border-[#d14f72]/25 bg-white text-[#6f1022]"
                        : "border-[#245447]/20 bg-[#f4fbf7] text-[#245447]"
                    }`}
                  >
                    {changeStatus.message}
                  </p>
                )}
                {!["cancel_requested", "reschedule_requested", "cancelled"].includes(
                  booking.status,
                ) && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => startReschedule(booking)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#b88a3b]/35 bg-white px-3 text-xs font-semibold text-[#6f1022] transition hover:border-[#6f1022]"
                    >
                      <RefreshCw size={14} />
                      Déplacer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCancellingBookingId(booking.id);
                        setCancellationReason("");
                        setChangeStatus(null);
                      }}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#b88a3b]/35 bg-white px-3 text-xs font-semibold text-[#6f1022] transition hover:border-[#6f1022]"
                    >
                      <XCircle size={14} />
                      Annuler
                    </button>
                  </div>
                )}
                {booking.videoUrl && (
                  <a
                    href={booking.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#6f1022] px-4 text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730]"
                  >
                    <Video size={16} />
                    Rejoindre la visio
                  </a>
                )}
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
