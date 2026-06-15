import {
  findAccount,
  findAccountByEmail,
  upsertAccount,
} from "@/lib/account-store";
import { tokenPacks, toPublicAccount } from "@/lib/accounts";
import { sendPaymentCreditsEmail } from "@/lib/email";
import {
  parseStripeClientReference,
  planFromStripeAmount,
  verifyStripeWebhook,
  type StripeWebhookEvent,
} from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSessionEmail(event: StripeWebhookEvent) {
  return (
    event.data.object.customer_details?.email ??
    event.data.object.customer_email ??
    ""
  ).toLowerCase();
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json(
      { ok: false, message: "Stripe webhook is not configured." },
      { status: 501 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!verifyStripeWebhook(rawBody, signature, webhookSecret)) {
    return Response.json(
      { ok: false, message: "Invalid Stripe signature." },
      { status: 400 },
    );
  }

  let event: StripeWebhookEvent;

  try {
    event = JSON.parse(rawBody) as StripeWebhookEvent;
  } catch {
    return Response.json(
      { ok: false, message: "Invalid Stripe payload." },
      { status: 400 },
    );
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return Response.json({ ok: true, ignored: true });
  }

  const session = event.data.object;

  if (session.payment_status && session.payment_status !== "paid") {
    return Response.json({ ok: true, ignored: true });
  }

  const reference = parseStripeClientReference(session.client_reference_id);
  const fallbackPlanId = planFromStripeAmount(session.amount_total);
  const planId = reference?.planId ?? fallbackPlanId;

  if (!planId) {
    return Response.json(
      { ok: false, message: "Unable to resolve paid plan." },
      { status: 422 },
    );
  }

  const account = reference?.accountId
    ? await findAccount(reference.accountId)
    : await findAccountByEmail(getSessionEmail(event));

  if (!account) {
    return Response.json(
      { ok: false, message: "Unable to resolve account." },
      { status: 404 },
    );
  }

  if (account.stripeEventIds?.includes(event.id)) {
    return Response.json({ ok: true, duplicate: true });
  }

  const tokenPack = tokenPacks[planId];
  const nextAccount = await upsertAccount({
    ...account,
    tokens: account.tokens + tokenPack.tokens,
    stripeEventIds: [event.id, ...(account.stripeEventIds ?? [])].slice(0, 50),
    updatedAt: new Date().toISOString(),
  });

  await sendPaymentCreditsEmail(toPublicAccount(nextAccount), {
    planId,
    label: tokenPack.label,
    tokens: tokenPack.tokens,
    eventId: event.id,
  });

  return Response.json({
    ok: true,
    accountId: nextAccount.id,
    planId,
    tokensAdded: tokenPack.tokens,
  });
}
