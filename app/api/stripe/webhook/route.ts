import {
  findAccount,
  findAccountByEmail,
  creditAccountTokens,
} from "@/lib/account-store";
import { tokenPacks, toPublicAccount } from "@/lib/accounts";
import { sendPaymentCreditsEmail } from "@/lib/email";
import {
  parseStripeClientReference,
  paidPlanFromSession,
  verifyStripeWebhook,
  type StripeWebhookEvent,
} from "@/lib/stripe";
import { apiHandler, readRequestText } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSessionEmail(event: StripeWebhookEvent) {
  return (
    event.data.object.customer_details?.email ??
    event.data.object.customer_email ??
    ""
  ).toLowerCase();
}

async function handlePOST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json(
      { ok: false, message: "Stripe webhook is not configured." },
      { status: 501 },
    );
  }

  const body = await readRequestText(request, 262_144);
  if (!body.ok) return body.response;
  const rawBody = body.text;
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
    if (!event || typeof event.id !== "string" || typeof event.type !== "string" ||
      !event.data || !event.data.object || typeof event.data.object !== "object") {
      throw new Error("Invalid event");
    }
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

  if (process.env.NODE_ENV === "production" && event.livemode === false) {
    return Response.json({ ok: true, ignored: true });
  }

  if (session.payment_status !== "paid") {
    return Response.json({ ok: true, ignored: true });
  }

  const reference = parseStripeClientReference(session.client_reference_id);
  const planId = paidPlanFromSession(session);

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

  const tokenPack = tokenPacks[planId];
  const { account: nextAccount, duplicate } = await creditAccountTokens(account.id, tokenPack.tokens, {
    sessionId: session.id!,
    eventId: event.id,
  });
  if (duplicate) return Response.json({ ok: true, duplicate: true });

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

export const POST = apiHandler(handlePOST);
