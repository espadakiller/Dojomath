import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import {
  findAccountBySessionToken,
  setAccountSession,
} from "@/lib/account-store";
import type { AccountRecord } from "@/lib/accounts";

const sessionCookieName = "dojomath_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function derivePassword(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key));
  });
}

export async function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await derivePassword(password, salt)).toString("hex");

  return { hash, salt };
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  if (!/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(expectedHash)) return false;
  const actual = await derivePassword(password, salt);
  const expected = Buffer.from(expectedHash, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export async function createSession(account: AccountRecord) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds * 1000).toISOString();
  const nextAccount = await setAccountSession(account.id, hashToken(token), expiresAt);
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

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return null;
  }

  const account = await findAccountBySessionToken(hashToken(token));

  if (!account || !account.sessionExpiresAt) {
    return null;
  }

  const expiresAt = new Date(account.sessionExpiresAt).getTime();
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
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
    await setAccountSession(account.id, null, null, account.sessionTokenHash);
  }
}
