import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const moduleRequire = createRequire(import.meta.url);

function load(relativePath, overrides = {}, cache = new Map()) {
  const filename = path.resolve(relativePath);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports, Buffer, Request, Response, URL, Blob, AbortSignal, console,
    process: { env: { NODE_ENV: "test" } },
    require(name) {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (name.startsWith("@/")) return load(`${name.slice(2)}.ts`, overrides, cache);
      return moduleRequire(name);
    },
  }, { filename });
  return exports;
}

async function main() {
  const security = load("lib/security.ts");
  const json = value => new Request("https://www.domaths.fr/api/accounts", {
    method: "POST", headers: { "content-type": "application/json" }, body: value,
  });
  for (const invalid of ["null", "[]", "1", '"text"']) {
    assert.equal((await security.readJsonBody(json(invalid), 100)).response.status, 400);
  }
  assert.equal((await security.readJsonBody(json('{"ok":true}'), 100)).ok, true);
  assert.equal((await security.readJsonBody(json('"' + "x".repeat(200) + '"'), 100)).response.status, 413);
  assert.equal((await security.readJsonBody(new Request("https://example.com", {
    method: "POST", body: "name=test",
  }), 100)).response.status, 415);
  assert.equal(security.assertSameOrigin(new Request("https://www.domaths.fr/api/accounts", {
    headers: { origin: "https://evil.example", "x-forwarded-host": "evil.example" },
  })).status, 403);
  assert.equal(security.assertSameOrigin(new Request("https://www.domaths.fr/api/accounts", {
    headers: { "sec-fetch-site": "cross-site" },
  })).status, 403);
  assert.equal(security.assertSameOrigin(new Request("https://www.domaths.fr/api/accounts", {
    headers: { origin: "https://www.domaths.fr" },
  })), null);

  const stripe = load("lib/stripe.ts");
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = (body, time = timestamp) => `t=${time},v1=${createHmac("sha256", "test-secret").update(`${time}.${body}`).digest("hex")}`;
  const signature = sign("{}");
  assert.equal(stripe.verifyStripeWebhook("{}", signature, "test-secret"), true);
  assert.equal(stripe.verifyStripeWebhook("{}", signature + "x", "test-secret"), false);
  assert.equal(stripe.verifyStripeWebhook("{}", sign("{}", timestamp - 600), "test-secret"), false);
  assert.equal(stripe.verifyStripeWebhook('{"changed":true}', signature, "test-secret"), false);
  const paid = { id: "cs_live_abc123", payment_status: "paid", currency: "eur", amount_total: 3000,
    client_reference_id: "11111111-1111-4111-8111-111111111111_liberte" };
  assert.equal(stripe.paidPlanFromSession(paid), "liberte");
  assert.equal(stripe.paidPlanFromSession({ ...paid, client_reference_id: paid.client_reference_id.replace("liberte", "progression") }), null);
  assert.equal(stripe.paidPlanFromSession({ ...paid, currency: "usd" }), null);
  assert.equal(stripe.paidPlanFromSession({ ...paid, payment_status: "unpaid" }), null);
  assert.equal(stripe.paidPlanFromSession({ ...paid, amount_total: 1 }), null);
  assert.equal(stripe.planFromStripeAmount("toString"), null);
  assert.equal(stripe.isPlanId("constructor"), false);

  const booking = load("lib/booking.ts");
  const stage = { date: "2099-01-12", time: "14:00", durationHours: 3 };
  assert.equal(booking.bookingsOverlap(stage, { ...stage, time: "16:30", durationHours: 1 }), true);
  assert.equal(booking.bookingsOverlap(stage, { ...stage, time: "17:04", durationHours: 1 }), true);
  assert.equal(booking.bookingsOverlap(stage, { ...stage, time: "17:05", durationHours: 1 }), false);
  assert.equal(booking.bookingsOverlap(stage, { ...stage, date: "2099-01-13" }), false);
  assert.equal(booking.bookingStartsAt("2026-10-21", "16:30"), Date.parse("2026-10-21T14:30:00Z"));
  assert.equal(booking.bookingStartsAt("2026-12-21", "16:30"), Date.parse("2026-12-21T15:30:00Z"));

  let touchedDatabase = false;
  const auth = load("lib/local-auth.ts", {
    "next/headers": { cookies: async () => ({ get: () => ({ value: "invalid-cookie" }) }) },
    "@/lib/account-store": { findAccountBySessionToken: async () => { touchedDatabase = true; } },
  });
  assert.equal(await auth.getCurrentAccount(), null);
  assert.equal(touchedDatabase, false);
  const password = await auth.createPasswordHash("test-password-only");
  assert.equal(await auth.verifyPassword("test-password-only", password.salt, password.hash), true);
  assert.equal(await auth.verifyPassword("wrong-password", password.salt, password.hash), false);

  console.log("Security regression checks passed: JSON limits, CSRF, Stripe tampering/replay, slot overlap, timezone and password/session checks.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
