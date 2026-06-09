import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AccountRecord } from "@/lib/accounts";
import {
  hasSupabaseStorage,
  selectRows,
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
  if (hasSupabaseStorage) {
    await Promise.all(accounts.map((account) => upsertAccount(account)));
    return;
  }

  await mkdir(dataDirectory, { recursive: true });
  await writeFile(accountsFile, `${JSON.stringify(accounts, null, 2)}\n`, "utf8");
}

export async function findAccount(accountId: string) {
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
