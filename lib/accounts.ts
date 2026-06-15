import type { PlanId } from "@/lib/pricing";

export type AccountRecord = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  passwordSalt: string;
  sessionTokenHash?: string;
  sessionExpiresAt?: string;
  stripeEventIds?: string[];
  tokens: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicAccount = Omit<
  AccountRecord,
  "passwordHash" | "passwordSalt" | "sessionTokenHash" | "sessionExpiresAt"
>;

export type AccountRequest = {
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  password?: unknown;
};

export type LoginRequest = {
  email?: unknown;
  password?: unknown;
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

export function getAccountName(account: Pick<AccountRecord, "firstName" | "lastName">) {
  return `${account.firstName} ${account.lastName}`.trim();
}

export function toPublicAccount(account: AccountRecord): PublicAccount {
  return {
    id: account.id,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    tokens: account.tokens,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
