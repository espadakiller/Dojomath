import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AccountRecord } from "@/lib/accounts";
import { withLocalStoreLock } from "@/lib/local-store-lock";
import {
  assertStorageAvailable,
  callRpc,
  deleteRows,
  hasSupabaseStorage,
  insertRow,
  selectRows,
  StorageError,
  upsertRow,
} from "@/lib/supabase-store";

type AccountRow = {
  id: string;
  email: string;
  session_token_hash: string | null;
  data: AccountRecord;
};

const dataDirectory = path.join(process.cwd(), ".data");
const accountsFile = path.join(dataDirectory, "accounts.json");

export async function readAccounts() {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    const rows = await selectRows<AccountRow>("dojomath_accounts", {});
    return rows.map((row) => row.data);
  }

  try {
    const content = await readFile(accountsFile, "utf8");
    return JSON.parse(content) as AccountRecord[];
  } catch {
    return [];
  }
}

export async function writeAccounts(accounts: AccountRecord[]) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    await Promise.all(accounts.map((account) => upsertAccount(account)));
    return;
  }

  await mkdir(dataDirectory, { recursive: true });
  await writeFile(accountsFile, `${JSON.stringify(accounts, null, 2)}\n`, "utf8");
}

export async function findAccount(accountId: string) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    const rows = await selectRows<AccountRow>("dojomath_accounts", {
      id: `eq.${accountId}`,
      limit: 1,
    });
    return rows[0]?.data ?? null;
  }

  const accounts = await readAccounts();
  return accounts.find((account) => account.id === accountId) ?? null;
}

export async function findAccountByEmail(email: string) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    const rows = await selectRows<AccountRow>("dojomath_accounts", {
      email: `eq.${email.toLowerCase()}`,
      limit: 1,
    });
    return rows[0]?.data ?? null;
  }

  const accounts = await readAccounts();
  return accounts.find((account) => account.email === email.toLowerCase()) ?? null;
}

export async function findAccountBySessionToken(sessionTokenHash: string) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    const rows = await selectRows<AccountRow>("dojomath_accounts", {
      session_token_hash: `eq.${sessionTokenHash}`,
      limit: 1,
    });
    return rows[0]?.data ?? null;
  }

  const accounts = await readAccounts();
  return (
    accounts.find((account) => account.sessionTokenHash === sessionTokenHash) ??
    null
  );
}

export async function upsertAccount(account: AccountRecord) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    await upsertRow("dojomath_accounts", {
      id: account.id,
      email: account.email,
      session_token_hash: account.sessionTokenHash ?? null,
      data: account,
    });

    return account;
  }

  const accounts = await readAccounts();
  const nextAccounts = [
    account,
    ...accounts.filter((current) => current.id !== account.id),
  ];

  await writeAccounts(nextAccounts);
  return account;
}

export async function deleteAccount(accountId: string) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    await deleteRows("dojomath_accounts", { id: `eq.${accountId}` });
    return;
  }

  const accounts = await readAccounts();
  await writeAccounts(accounts.filter((account) => account.id !== accountId));
}

export async function createAccount(account: AccountRecord) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    await insertRow("dojomath_accounts", {
      id: account.id,
      email: account.email,
      session_token_hash: null,
      data: account,
    });
    return account;
  }
  return withLocalStoreLock(async () => {
    if (await findAccountByEmail(account.email)) {
      throw new StorageError("Un compte existe deja avec cet email.", 409, "23505");
    }
    return upsertAccount(account);
  });
}

export async function setAccountSession(
  accountId: string,
  tokenHash: string | null,
  expiresAt: string | null,
  expectedHash: string | null = null,
) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    return callRpc<AccountRecord>("dojomath_set_session", {
      p_account_id: accountId,
      p_hash: tokenHash,
      p_expires: expiresAt,
      p_expected_hash: expectedHash,
    });
  }
  return withLocalStoreLock(async () => {
    const account = await findAccount(accountId);
    if (!account) throw new StorageError("Compte introuvable.", 404);
    if (expectedHash && account.sessionTokenHash !== expectedHash) return account;
    return upsertAccount({
      ...account,
      sessionTokenHash: tokenHash ?? undefined,
      sessionExpiresAt: expiresAt ?? undefined,
      updatedAt: new Date().toISOString(),
    });
  });
}

export async function creditAccountTokens(
  accountId: string,
  tokens: number,
  payment?: { sessionId: string; eventId: string },
) {
  assertStorageAvailable();
  if (hasSupabaseStorage) {
    return callRpc<{ account: AccountRecord; duplicate: boolean }>(
      "dojomath_credit_tokens",
      {
        p_account_id: accountId,
        p_tokens: tokens,
        p_session_id: payment?.sessionId ?? null,
        p_event_id: payment?.eventId ?? null,
      },
    );
  }
  return withLocalStoreLock(async () => {
    const account = await findAccount(accountId);
    if (!account) throw new StorageError("Compte introuvable.", 404);
    const paymentKey = payment ? `session:${payment.sessionId}` : null;
    if (payment && (account.stripeEventIds?.includes(payment.eventId) ||
      (paymentKey && account.stripeEventIds?.includes(paymentKey)))) {
      return { account, duplicate: true };
    }
    const nextAccount = await upsertAccount({
      ...account,
      tokens: account.tokens + tokens,
      stripeEventIds: payment && paymentKey
        ? [paymentKey, payment.eventId, ...(account.stripeEventIds ?? [])]
        : account.stripeEventIds,
      updatedAt: new Date().toISOString(),
    });
    return { account: nextAccount, duplicate: false };
  });
}
