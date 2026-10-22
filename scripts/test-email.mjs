import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const sent = [];
const env = {
  RESEND_API_KEY: "test-key-not-real",
  EMAIL_FROM: "DojoMath <reservation@example.invalid>",
  CONTACT_FROM_EMAIL: "DojoMath <contact@example.invalid>",
  CONTACT_TO_EMAIL: "contact@example.invalid",
  TEACHER_EMAIL: "teacher@example.invalid",
};
let failDelivery = false;
function load(filename, overrides = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, Response, AbortSignal, console: { warn() {}, error() {} },
    process: { env },
    require(name) { return Object.hasOwn(overrides, name) ? overrides[name] : require(name); },
    fetch: async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      sent.push({ ...JSON.parse(options.body), key: options.headers["Idempotency-Key"] });
      return failDelivery ? new Response("provider unavailable", { status: 503 }) : Response.json({ id: "test" });
    },
  }, { filename });
  return exports;
}

const email = load("lib/email.ts");
const account = { id: "test-signup", firstName: "<Test>", lastName: "Parent", email: "parent@example.invalid", tokens: 0 };
assert.equal((await email.sendWelcomeEmail(account)).ok, true);
assert.equal(sent.at(-1).to[0], account.email);
assert.equal(sent.at(-1).reply_to, env.TEACHER_EMAIL);
assert.ok(sent.at(-1).html.includes("&lt;Test&gt;"));
assert.equal((await email.sendTeacherSignupEmail(account)).ok, true);
assert.equal(sent.at(-1).to[0], env.TEACHER_EMAIL);
assert.equal(sent.at(-1).reply_to, account.email);
assert.equal(sent.at(-1).key, "teacher-signup-test-signup");
assert.ok(sent.at(-1).text.includes("ni un paiement ni une reservation"));
assert.equal((await email.sendContactEmail({ name: "<Test>", email: account.email, message: "<script>test</script>" })).ok, true);
assert.equal(sent.at(-1).to[0], env.CONTACT_TO_EMAIL);
assert.equal(sent.at(-1).from, env.CONTACT_FROM_EMAIL);
assert.equal(sent.at(-1).reply_to, account.email);
assert.ok(!sent.at(-1).html.includes("<script>"));
failDelivery = true;
assert.equal((await email.sendTeacherSignupEmail(account)).ok, false);
failDelivery = false;

const savedTeacher = env.TEACHER_EMAIL;
const savedContact = env.CONTACT_TO_EMAIL;
delete env.TEACHER_EMAIL;
delete env.CONTACT_TO_EMAIL;
const defaultEmail = load("lib/email.ts");
await defaultEmail.sendTeacherSignupEmail(account);
assert.equal(sent.at(-1).to[0], "dojomath.contact@gmail.com");
await defaultEmail.sendContactEmail({ name: "Test", email: account.email, message: "Test officiel" });
assert.equal(sent.at(-1).to[0], "dojomath.contact@gmail.com");
await defaultEmail.sendWelcomeEmail(account);
assert.equal(sent.at(-1).reply_to, "dojomath.contact@gmail.com");
env.TEACHER_EMAIL = savedTeacher;
env.CONTACT_TO_EMAIL = savedContact;

// Exercise the signup handler without creating accounts or sending real emails.
let existing = false;
const route = load("app/api/accounts/route.ts", {
  "@/lib/accounts": { tokenPacks: {}, toPublicAccount: value => value },
  "@/lib/account-store": {
    findAccountByEmail: async () => existing ? account : null,
    createAccount: async value => value,
  },
  "@/lib/local-auth": {
    createPasswordHash: async () => ({ hash: "fake-hash", salt: "fake-salt" }),
    createSession: async value => value,
  },
  "@/lib/email": email,
  "@/lib/security": {
    apiHandler: handler => handler,
    assertSameOrigin: () => null,
    rateLimit: async () => null,
    readJsonBody: async () => ({ ok: true, data: { ...account, password: "test-password" } }),
    asBoundedText: value => value,
    normalizeEmail: value => value,
    isValidEmail: () => true,
    jsonError: (message, status) => Response.json({ message }, { status }),
  },
});
let before = sent.length;
assert.equal((await route.POST({})).status, 201);
assert.equal(sent.length, before + 2);
assert.equal(sent.at(-2).to[0], account.email);
assert.equal(sent.at(-1).to[0], env.TEACHER_EMAIL);
assert.ok(!sent.at(-1).text.includes("fake-hash"));
existing = true;
before = sent.length;
assert.equal((await route.POST({})).status, 409);
assert.equal(sent.length, before);
existing = false;
failDelivery = true;
assert.equal((await route.POST({})).status, 201);
console.log("Email checks passed: signup parent/teacher notifications, contact recipient/reply-to, escaping, duplicate signup and provider failure. No real email or account created.");
