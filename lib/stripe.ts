import { createHmac, timingSafeEqual } from "node:crypto";

import type { PlanId } from "@/lib/pricing";

const signatureToleranceMs = 5 * 60 * 1000;
const planIds = new Set<PlanId>(["liberte", "progression", "stage"]);

export type StripeCheckoutSession = {
  id?: string;
  object?: string;
  amount_total?: number | null;
  currency?: string | null;
  client_reference_id?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  payment_status?: string | null;
};

export type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: StripeCheckoutSession;
  };
};

export function verifyStripeWebhook(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
) {
  if (!signatureHeader) {
    return false;
  }

  const parts = new Map<string, string[]>();

  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.split("=");

    if (!key || !value) {
      continue;
    }

    parts.set(key, [...(parts.get(key) ?? []), value]);
  }

  const timestamp = parts.get("t")?.[0];
  const signatures = parts.get("v1") ?? [];

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const timestampMs = Number(timestamp) * 1000;

  if (
    !Number.isFinite(timestampMs) ||
    Math.abs(Date.now() - timestampMs) > signatureToleranceMs
  ) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    try {
      const providedBuffer = Buffer.from(signature, "hex");

      return (
        providedBuffer.length === expectedBuffer.length &&
        timingSafeEqual(providedBuffer, expectedBuffer)
      );
    } catch {
      return false;
    }
  });
}

export function parseStripeClientReference(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const match = value.match(/^(.+)_(liberte|progression|stage)$/);

  if (!match) {
    return null;
  }

  return {
    accountId: match[1],
    planId: match[2] as PlanId,
  };
}

export function planFromStripeAmount(amountTotal: number | null | undefined) {
  const amounts = {
    3000: "liberte",
    7500: "stage",
    11000: "progression",
  } satisfies Record<number, PlanId>;

  if (!amountTotal) {
    return null;
  }

  return amounts[amountTotal as keyof typeof amounts] ?? null;
}

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && planIds.has(value as PlanId);
}
