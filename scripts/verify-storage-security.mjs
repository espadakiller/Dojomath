// Run explicitly against a configured project. Creates and removes only isolated test records.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { parseEnv } from "node:util";
const env = { ...parseEnv(fs.readFileSync(".env.local", "utf8")), ...process.env };
const base = env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
if (!base || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase configuration required.");
const runId = randomUUID();
const accountIds = [randomUUID(), randomUUID()];
const paymentSession = `security-test-${runId}`;
const rateKey = `security-test-${runId}`;
const headers = { "Content-Type": "application/json", apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` };
async function request(route, method = "GET", body) {
  const response = await fetch(`${base}/rest/v1/${route}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}
const rpc = (name, body) => request(`rpc/${name}`, "POST", body);
const makeBooking = (accountId, date, time, planId = "liberte") => ({
  id: randomUUID(), accountId, date, time, planId, planTitle: "SECURITY TEST", status: "pending",
  durationHours: planId === "stage" ? 3 : 1, customerName: "Security test", studentName: "Security test",
  level: "3e", topic: "Automated security test", notes: "", createdAt: new Date().toISOString(),
});
async function main() {
  try {
    for (const id of accountIds) {
      const result = await request("dojomath_accounts", "POST", {
        id, email: `security-test-${id}@example.invalid`, session_token_hash: null,
        data: { id, email: `security-test-${id}@example.invalid`, firstName: "Security", lastName: "Test",
          tokens: 1, passwordHash: "0".repeat(128), passwordSalt: "0".repeat(32),
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      });
      assert.equal(result.status, 201);
    }
    const [first, second] = await Promise.all(["09:00", "11:00"].map(time =>
      rpc("dojomath_reserve_booking", { p_booking: makeBooking(accountIds[0], "2099-01-12", time) })));
    assert.deepEqual([first.status, second.status].sort(), [200, 402]);
    const winner = first.status === 200 ? first.data.booking : second.data.booking;
    const credit = { p_account_id: accountIds[0], p_tokens: 4, p_session_id: paymentSession, p_event_id: `evt-${runId}` };
    const payments = await Promise.all([rpc("dojomath_credit_tokens", credit),
      rpc("dojomath_credit_tokens", { ...credit, p_event_id: `evt-second-${runId}` })]);
    assert.ok(payments.every(result => result.status === 200));
    assert.equal(payments.filter(result => result.data.duplicate).length, 1);
    const [balance, session] = await Promise.all([
      rpc("dojomath_credit_tokens", { p_account_id: accountIds[0], p_tokens: 1 }),
      rpc("dojomath_set_session", { p_account_id: accountIds[0], p_hash: "a".repeat(64), p_expires: "2099-01-01T00:00:00Z" }),
    ]);
    assert.equal(balance.status, 200);
    assert.equal(session.status, 200);
    const account = await request(`dojomath_accounts?id=eq.${accountIds[0]}&select=data`);
    assert.equal(account.data[0].data.tokens, 5);
    assert.equal(account.data[0].data.sessionTokenHash, "a".repeat(64));
    const foreign = await rpc("dojomath_change_booking", {
      p_id: winner.id, p_action: "reschedule", p_account_id: accountIds[1], p_patch: { date: winner.date, time: "18:00" },
    });
    assert.equal(foreign.status, 403);
    const stage = makeBooking(accountIds[0], "2099-01-13", "14:00", "stage");
    assert.equal((await rpc("dojomath_reserve_booking", { p_booking: stage })).status, 200);
    const overlapping = await rpc("dojomath_reserve_booking", { p_booking: makeBooking(accountIds[1], stage.date, "16:30") });
    assert.equal(overlapping.status, 409);
    const untouched = await request(`dojomath_accounts?id=eq.${accountIds[1]}&select=data`);
    assert.equal(untouched.data[0].data.tokens, 1);
    const overlappingRace = await Promise.all([
      rpc("dojomath_reserve_booking", { p_booking: makeBooking(accountIds[0], "2099-01-14", "09:00") }),
      rpc("dojomath_reserve_booking", { p_booking: makeBooking(accountIds[1], "2099-01-14", "09:30") }),
    ]);
    assert.deepEqual(overlappingRace.map(result => result.status).sort(), [200, 409]);
    assert.equal((await rpc("dojomath_credit_tokens", { p_account_id: accountIds[1], p_tokens: 1 })).status, 200);
    assert.equal((await rpc("dojomath_change_booking", { p_id: winner.id, p_action: "admin", p_patch: { status: "cancelled" } })).status, 200);
    assert.equal((await rpc("dojomath_change_booking", { p_id: winner.id, p_action: "reschedule", p_account_id: accountIds[0], p_patch: { date: winner.date, time: "20:00" } })).status, 409);
    assert.equal((await rpc("dojomath_reserve_booking", { p_booking: makeBooking(accountIds[1], winner.date, winner.time) })).status, 200);
    const limits = await Promise.all(Array.from({ length: 5 }, () => rpc("dojomath_check_rate_limit", {
      p_key: rateKey, p_limit: 3, p_window_ms: 60000,
    })));
    assert.equal(limits.filter(result => result.data === true).length, 3);
    assert.equal(limits.filter(result => result.data === false).length, 2);
    console.log("Database security checks passed: concurrent reservations, durable payment deduplication, concurrent session/credit, ownership, overlap, rollback, cancelled lessons and distributed rate limits.");
  } finally {
    for (const id of accountIds) {
      assert.ok((await request(`dojomath_bookings?account_id=eq.${id}`, "DELETE")).status < 300);
    }
    assert.ok((await request(`dojomath_payments?session_id=eq.${paymentSession}`, "DELETE")).status < 300);
    assert.ok((await request(`dojomath_rate_limits?key=eq.${rateKey}`, "DELETE")).status < 300);
    for (const id of accountIds) {
      assert.ok((await request(`dojomath_accounts?id=eq.${id}`, "DELETE")).status < 300);
    }
    console.log("Isolated test records removed.");
  }
}
main().catch(error => { console.error(error.name, error.message); process.exitCode = 1; });
