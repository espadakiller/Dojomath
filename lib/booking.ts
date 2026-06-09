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

const weekdaySlots = ["17:00", "18:15", "19:30"];
const priorityWeekdaySlots = ["16:45", "18:00", "19:15"];
const saturdaySlots = ["09:30", "10:45", "12:00"];
const stageSlots = ["09:00", "14:00"];

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getBookingDays(count = 14) {
  const days: string[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();

    if (day !== 0) {
      days.push(toDateKey(cursor));
    }
  }

  return days;
}

export function getSlotsForPlan(planId: PlanId, dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  const day = date.getDay();

  if (Number.isNaN(date.getTime()) || day === 0) {
    return [];
  }

  if (planId === "stage") {
    return day === 3 || day === 6 ? stageSlots : [];
  }

  if (day === 6) {
    return saturdaySlots;
  }

  return planId === "progression" ? priorityWeekdaySlots : weekdaySlots;
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
