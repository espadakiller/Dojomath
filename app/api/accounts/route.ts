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
  createAccount,
  creditAccountTokens,
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
  apiHandler,
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
  return Object.hasOwn(tokenPacks, value);
}

async function handleGET() {
  const account = await getCurrentAccount();

  if (!account) {
    return Response.json({ ok: true, account: null });
  }

  return Response.json({ ok: true, account: toPublicAccount(account) });
}

async function handlePOST(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = await rateLimit(request, "accounts:create", 5, 15 * 60 * 1000);

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
  const passwordData = await createPasswordHash(password);
  const account = await createSession(
    await createAccount({
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

async function handlePUT(request: Request) {
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
  const ipLimited = await rateLimit(request, "accounts:login", 30, 10 * 60 * 1000);
  if (ipLimited) return ipLimited;
  const limited = await rateLimit(
    request,
    `accounts:login:${email || "unknown"}`,
    8,
    10 * 60 * 1000,
  );

  if (limited) {
    return limited;
  }

  const account = await findAccountByEmail(email);
  const passwordMatches = await verifyPassword(
    password || "invalid",
    account?.passwordSalt ?? "0".repeat(32),
    account?.passwordHash ?? "0".repeat(128),
  );

  if (
    !account ||
    !password ||
    !passwordMatches
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

async function handlePATCH(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = await rateLimit(request, "accounts:tokens", 10, 10 * 60 * 1000);

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

  const { account: nextAccount } = await creditAccountTokens(account.id, tokenPacks[planId].tokens);

  return Response.json({
    ok: true,
    account: toPublicAccount(nextAccount),
    message: `${tokenPacks[planId].label} ajoutés au compte ${getAccountName(
      nextAccount,
    )}.`,
  });
}

async function handleDELETE(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const cookieLimited = await rateLimit(request, "accounts:logout", 60, 60 * 1000);

  if (cookieLimited) {
    return cookieLimited;
  }

  await clearSession();

  return Response.json({ ok: true });
}

export const GET = apiHandler(handleGET);
export const POST = apiHandler(handlePOST);
export const PUT = apiHandler(handlePUT);
export const PATCH = apiHandler(handlePATCH);
export const DELETE = apiHandler(handleDELETE);
