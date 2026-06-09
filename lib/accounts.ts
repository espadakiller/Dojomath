import type { PlanId } from "@/lib/pricing";

export type AccountRecord = {
  id: string;
  firstName: string;
  lastName: string;
  tokens: number;
  createdAt: string;
  updatedAt: string;
};

export type AccountRequest = {
  firstName?: unknown;
  lastName?: unknown;
};

export const tokenPacks = {
  liberte: {
    tokens: 1,
    label: "1 jeton",
  },
  progression: {
    tokens: 4,
    label: "4 jetons",
  },
  stage: {
    tokens: 3,
    label: "3 jetons",
  },
} satisfies Record<PlanId, { tokens: number; label: string }>;

export function getAccountName(account: AccountRecord) {
  return `${account.firstName} ${account.lastName}`.trim();
}
