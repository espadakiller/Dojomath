import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AccountRecord } from "@/lib/accounts";

const dataDirectory = path.join(process.cwd(), ".data");
const accountsFile = path.join(dataDirectory, "accounts.json");

export async function readAccounts() {
  try {
    const content = await readFile(accountsFile, "utf8");
    return JSON.parse(content) as AccountRecord[];
  } catch {
    return [];
  }
}

export async function writeAccounts(accounts: AccountRecord[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(accountsFile, `${JSON.stringify(accounts, null, 2)}\n`, "utf8");
}

export async function findAccount(accountId: string) {
  const accounts = await readAccounts();
  return accounts.find((account) => account.id === accountId) ?? null;
}

export async function upsertAccount(account: AccountRecord) {
  const accounts = await readAccounts();
  const nextAccounts = [
    account,
    ...accounts.filter((current) => current.id !== account.id),
  ];

  await writeAccounts(nextAccounts);
  return account;
}
