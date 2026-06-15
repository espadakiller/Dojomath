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
import {
  asBoundedText,
  assertSameOrigin,
  hasValidAdminToken,
  isValidEmail,
  jsonError,
  normalizeEmail,
  rateLimit,
  readJsonBody,
} from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = rateLimit(request, "accounts:create", 5, 15 * 60 * 1000);

  if (limited) {
    return limited;
  }

  const json = await readJsonBody<AccountRequest>(
    request,
    4_096,
    "Le compte est illisible.",
  );

  if (!json.ok) {
    return json.response;
  }

  const firstName = asBoundedText(json.data.firstName, { max: 80, min: 1 });
  const lastName = asBoundedText(json.data.lastName, { max: 80, min: 1 });
  const email = normalizeEmail(json.data.email);
  const password = asBoundedText(json.data.password, { max: 128, min: 8 });

  if (!firstName || !lastName || !email || !password) {
    return jsonError("Tous les champs du compte sont obligatoires.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("L'adresse email est invalide.", 400);
  }

  if (password.length < 8) {
    return jsonError("Le mot de passe doit contenir au moins 8 caractères.", 400);
  }

  const existingAccount = await findAccountByEmail(email);

  if (existingAccount) {
    return jsonError("Un compte existe déjà avec cet email.", 409);
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

  const emailResult = await sendWelcomeEmail(publicAccount);

  return Response.json(
    {
      ok: true,
      account: publicAccount,
      message: emailResult.ok
        ? "Compte créé. Un email de confirmation vient d'être envoyé."
        : "Compte créé. L'email de confirmation n'a pas pu être envoyé automatiquement.",
    },
    { status: 201 },
  );
}

export async function PUT(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const json = await readJsonBody<LoginRequest>(
    request,
    2_048,
    "La connexion est illisible.",
  );

  if (!json.ok) {
    return json.response;
  }

  const email = normalizeEmail(json.data.email);
  const password = asBoundedText(json.data.password, { max: 128, min: 1 });
  const limited = rateLimit(
    request,
    `accounts:login:${email || "unknown"}`,
    8,
    10 * 60 * 1000,
  );

  if (limited) {
    return limited;
  }

  const account = await findAccountByEmail(email);

  if (
    !account ||
    !password ||
    !verifyPassword(password, account.passwordSalt, account.passwordHash)
  ) {
    return jsonError("Email ou mot de passe incorrect.", 401);
  }

  const nextAccount = await createSession(account);

  return Response.json({
    ok: true,
    account: toPublicAccount(nextAccount),
    message: "Connexion réussie. Vous êtes bien connecté.",
  });
}

export async function PATCH(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = rateLimit(request, "accounts:tokens", 10, 10 * 60 * 1000);

  if (limited) {
    return limited;
  }

  if (!hasValidAdminToken(request)) {
    return jsonError(
      "Le crédit automatique des jetons est désactivé. Les jetons sont ajoutés après validation du paiement.",
      403,
    );
  }

  const json = await readJsonBody<{ planId?: unknown; email?: unknown }>(
    request,
    2_048,
    "La demande est illisible.",
  );

  if (!json.ok) {
    return json.response;
  }

  const planId = asBoundedText(json.data.planId, { max: 40 });
  const email = normalizeEmail(json.data.email);

  if (!isPlanId(planId)) {
    return jsonError("Formule invalide.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Email invalide.", 400);
  }

  const account = await findAccountByEmail(email);

  if (!account) {
    return jsonError("Compte introuvable.", 404);
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

export async function DELETE(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const cookieLimited = rateLimit(request, "accounts:logout", 60, 60 * 1000);

  if (cookieLimited) {
    return cookieLimited;
  }

  await clearSession();

  return Response.json({ ok: true });
}
