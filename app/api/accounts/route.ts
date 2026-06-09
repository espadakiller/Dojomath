import { randomUUID } from "node:crypto";

import { getAccountName, tokenPacks, type AccountRequest } from "@/lib/accounts";
import { findAccount, upsertAccount } from "@/lib/account-store";
import type { PlanId } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlanId(value: string): value is PlanId {
  return value in tokenPacks;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const accountId = asText(url.searchParams.get("accountId"));

  if (!accountId) {
    return Response.json(
      { ok: false, message: "Compte introuvable." },
      { status: 400 },
    );
  }

  const account = await findAccount(accountId);

  if (!account) {
    return Response.json(
      { ok: false, message: "Compte introuvable." },
      { status: 404 },
    );
  }

  return Response.json({ ok: true, account });
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

  if (!firstName || !lastName) {
    return Response.json(
      { ok: false, message: "Le prénom et le nom sont obligatoires." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const account = await upsertAccount({
    id: randomUUID(),
    firstName,
    lastName,
    tokens: 0,
    createdAt: now,
    updatedAt: now,
  });

  return Response.json({ ok: true, account }, { status: 201 });
}

export async function PATCH(request: Request) {
  let payload: { accountId?: unknown; planId?: unknown };

  try {
    payload = (await request.json()) as { accountId?: unknown; planId?: unknown };
  } catch {
    return Response.json(
      { ok: false, message: "La demande est illisible." },
      { status: 400 },
    );
  }

  const accountId = asText(payload.accountId);
  const planId = asText(payload.planId);

  if (!accountId || !isPlanId(planId)) {
    return Response.json(
      { ok: false, message: "Compte ou formule invalide." },
      { status: 400 },
    );
  }

  const account = await findAccount(accountId);

  if (!account) {
    return Response.json(
      { ok: false, message: "Compte introuvable." },
      { status: 404 },
    );
  }

  const nextAccount = await upsertAccount({
    ...account,
    tokens: account.tokens + tokenPacks[planId].tokens,
    updatedAt: new Date().toISOString(),
  });

  return Response.json({
    ok: true,
    account: nextAccount,
    message: `${tokenPacks[planId].label} ajoutés au compte ${getAccountName(
      nextAccount,
    )}.`,
  });
}
