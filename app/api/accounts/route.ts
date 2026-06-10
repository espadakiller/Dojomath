import { randomUUID } from "node:crypto";

import {
  getAccountName,
  tokenPacks,
  toPublicAccount,
  type AccountRequest,
  type LoginRequest,
} from "@/lib/accounts";
import {
  findAccountByEmail,
  upsertAccount,
} from "@/lib/account-store";
import {
  clearSession,
  createPasswordHash,
  createSession,
  getCurrentAccount,
  verifyPassword,
} from "@/lib/local-auth";
import { sendWelcomeEmail } from "@/lib/email";
import type { PlanId } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return asText(value).toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPlanId(value: string): value is PlanId {
  return value in tokenPacks;
}

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return Response.json({ ok: true, account: null });
  }

  return Response.json({ ok: true, account: toPublicAccount(account) });
}

export async function POST(request: Request) {
  let payload: AccountRequest;

  try {
    payload = (await request.json()) as AccountRequest;
  } catch {
    return Response.json(
      { ok: false, message: "Le compte est illisible." },
      { status: 400 },
    );
  }

  const firstName = asText(payload.firstName);
  const lastName = asText(payload.lastName);
  const email = normalizeEmail(payload.email);
  const password = asText(payload.password);

  if (!firstName || !lastName || !email || !password) {
    return Response.json(
      { ok: false, message: "Tous les champs du compte sont obligatoires." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return Response.json(
      { ok: false, message: "L'adresse email est invalide." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return Response.json(
      { ok: false, message: "Le mot de passe doit contenir au moins 8 caractères." },
      { status: 400 },
    );
  }

  const existingAccount = await findAccountByEmail(email);

  if (existingAccount) {
    return Response.json(
      { ok: false, message: "Un compte existe déjà avec cet email." },
      { status: 409 },
    );
  }

  const now = new Date().toISOString();
  const passwordData = createPasswordHash(password);
  const account = await createSession(
    await upsertAccount({
      id: randomUUID(),
      email,
      firstName,
      lastName,
      passwordHash: passwordData.hash,
      passwordSalt: passwordData.salt,
      tokens: 0,
      createdAt: now,
      updatedAt: now,
    }),
  );
  const publicAccount = toPublicAccount(account);

  await sendWelcomeEmail(publicAccount);

  return Response.json({ ok: true, account: publicAccount }, { status: 201 });
}

export async function PUT(request: Request) {
  let payload: LoginRequest;

  try {
    payload = (await request.json()) as LoginRequest;
  } catch {
    return Response.json(
      { ok: false, message: "La connexion est illisible." },
      { status: 400 },
    );
  }

  const email = normalizeEmail(payload.email);
  const password = asText(payload.password);
  const account = await findAccountByEmail(email);

  if (
    !account ||
    !password ||
    !verifyPassword(password, account.passwordSalt, account.passwordHash)
  ) {
    return Response.json(
      { ok: false, message: "Email ou mot de passe incorrect." },
      { status: 401 },
    );
  }

  const nextAccount = await createSession(account);

  return Response.json({ ok: true, account: toPublicAccount(nextAccount) });
}

export async function PATCH(request: Request) {
  const account = await getCurrentAccount();

  if (!account) {
    return Response.json(
      { ok: false, message: "Connectez-vous avant d'ajouter des jetons." },
      { status: 401 },
    );
  }

  let payload: { planId?: unknown };

  try {
    payload = (await request.json()) as { planId?: unknown };
  } catch {
    return Response.json(
      { ok: false, message: "La demande est illisible." },
      { status: 400 },
    );
  }

  const planId = asText(payload.planId);

  if (!isPlanId(planId)) {
    return Response.json(
      { ok: false, message: "Formule invalide." },
      { status: 400 },
    );
  }

  const nextAccount = await upsertAccount({
    ...account,
    tokens: account.tokens + tokenPacks[planId].tokens,
    updatedAt: new Date().toISOString(),
  });

  return Response.json({
    ok: true,
    account: toPublicAccount(nextAccount),
    message: `${tokenPacks[planId].label} ajoutés au compte ${getAccountName(
      nextAccount,
    )}.`,
  });
}

export async function DELETE() {
  await clearSession();

  return Response.json({ ok: true });
}
