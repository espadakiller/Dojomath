import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import {
  findAccountBySessionToken,
  upsertAccount,
} from "@/lib/account-store";
import type { AccountRecord } from "@/lib/accounts";

const sessionCookieName = "dojomath_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return { hash, salt };
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actual = Buffer.from(scryptSync(password, salt, 64).toString("hex"), "hex");
  const expected = Buffer.from(expectedHash, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export async function createSession(account: AccountRecord) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds * 1000).toISOString();
  const nextAccount = await upsertAccount({
    ...account,
    sessionTokenHash: hashToken(token),
    sessionExpiresAt: expiresAt,
    updatedAt: new Date().toISOString(),
  });
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });

  return nextAccount;
}

export async function getCurrentAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  const account = await findAccountBySessionToken(hashToken(token));

  if (!account || !account.sessionExpiresAt) {
    return null;
  }

  if (new Date(account.sessionExpiresAt).getTime() <= Date.now()) {
    return null;
  }

  return account;
}

export async function clearSession() {
  const account = await getCurrentAccount();
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  if (account) {
    await upsertAccount({
      ...account,
      sessionTokenHash: undefined,
      sessionExpiresAt: undefined,
      updatedAt: new Date().toISOString(),
    });
  }
}
