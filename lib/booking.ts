import type { PlanId } from "@/lib/pricing";

export type BookingStatus = "pending" | "confirmed";

export type BookingRecord = {
  id: string;
  accountId: string;
  planId: PlanId;
  planTitle: string;
  date: string;
  time: string;
  durationHours: number;
  customerName: string;
  studentName: string;
  level: string;
  topic: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

export type BookingRequest = Omit<
  BookingRecord,
  | "id"
  | "planTitle"
  | "durationHours"
  | "customerName"
  | "status"
  | "createdAt"
>;

export const bookingPlanRules = {
  liberte: {
    title: "Liberté",
    durationHours: 1,
    monthlyCredits: null,
    access: "Cours ponctuel",
    rhythm: "Un créneau libre, sans engagement.",
  },
  progression: {
    title: "Progression",
    durationHours: 1,
    monthlyCredits: 4,
    access: "4 crédits par mois",
    rhythm: "Priorité sur les créneaux réguliers.",
  },
  stage: {
    title: "Stage Vacances",
    durationHours: 3,
    monthlyCredits: null,
    access: "Bloc intensif",
    rhythm: "Créneaux longs dédiés aux vacances.",
  },
} satisfies Record<
  PlanId,
  {
    title: string;
    durationHours: number;
    monthlyCredits: number | null;
    access: string;
    rhythm: string;
  }
>;

const weekdaySlots = generateCourseSlots("16:30", "23:00", 65);
const saturdaySlots = ["09:30", "10:45", "12:00"];
const stageSlots = ["09:00", "14:00"];

const zoneCSchoolHolidays = [
  { startsAt: "2025-10-18", endsBefore: "2025-11-03" },
  { startsAt: "2025-12-20", endsBefore: "2026-01-05" },
  { startsAt: "2026-02-21", endsBefore: "2026-03-09" },
  { startsAt: "2026-04-18", endsBefore: "2026-05-04" },
  { startsAt: "2026-07-04", endsBefore: "2026-09-01" },
  { startsAt: "2026-10-17", endsBefore: "2026-11-02" },
  { startsAt: "2026-12-19", endsBefore: "2027-01-04" },
  { startsAt: "2027-02-06", endsBefore: "2027-02-22" },
  { startsAt: "2027-04-03", endsBefore: "2027-04-19" },
  { startsAt: "2027-07-03", endsBefore: "2027-09-01" },
];

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTimeLabel(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function generateCourseSlots(start: string, lastStart: string, stepMinutes: number) {
  const slots: string[] = [];

  for (
    let cursor = toMinutes(start);
    cursor <= toMinutes(lastStart);
    cursor += stepMinutes
  ) {
    slots.push(toTimeLabel(cursor));
  }

  return slots;
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getBookingDays(monthsAhead = 2) {
  const days: string[] = [];
  const cursor = new Date();
  const endDate = new Date(cursor);

  cursor.setHours(0, 0, 0, 0);
  endDate.setMonth(endDate.getMonth() + monthsAhead);
  endDate.setHours(0, 0, 0, 0);

  while (cursor < endDate) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();

    if (day !== 0) {
      days.push(toDateKey(cursor));
    }
  }

  return days;
}

export function isSchoolHoliday(dateKey: string) {
  return zoneCSchoolHolidays.some(
    ({ startsAt, endsBefore }) => dateKey >= startsAt && dateKey < endsBefore,
  );
}

export function getSlotsForPlan(planId: PlanId, dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  const day = date.getDay();

  if (Number.isNaN(date.getTime()) || day === 0) {
    return [];
  }

  if (planId === "stage") {
    return isSchoolHoliday(dateKey) && (day === 3 || day === 6) ? stageSlots : [];
  }

  if (day === 6) {
    return saturdaySlots;
  }

  return weekdaySlots;
}

export function formatDateLabel(dateKey: string, variant: "short" | "long") {
  const date = new Date(`${dateKey}T12:00:00`);

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: variant === "long" ? "long" : "short",
    day: "numeric",
    month: variant === "long" ? "long" : "short",
  }).format(date);
}

export function getMonthKey(dateKey: string) {
  return dateKey.slice(0, 7);
}
