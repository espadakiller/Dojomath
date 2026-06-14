import {
  asBoundedText,
  assertSameOrigin,
  isValidEmail,
  jsonError,
  normalizeEmail,
  rateLimit,
  readJsonBody,
} from "@/lib/security";

const recipient = "teogolu@gmail.com";
const subject = "DOJOMATH CONTACTS";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = rateLimit(request, "contact", 5, 10 * 60 * 1000);

  if (limited) {
    return limited;
  }

  const json = await readJsonBody<ContactPayload>(
    request,
    8_192,
    "Le message est illisible.",
  );

  if (!json.ok) {
    return json.response;
  }

  const name = asBoundedText(json.data.name, { max: 100, min: 1 });
  const email = normalizeEmail(json.data.email);
  const message = asBoundedText(json.data.message, { max: 2_000, min: 1 });

  if (!name || !email || !message) {
    return jsonError("Tous les champs sont obligatoires.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("L'adresse email est invalide.", 400);
  }

  const text = [
    `Nom : ${name}`,
    `Email : ${email}`,
    "",
    "Message :",
    message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "DojoMath <onboarding@resend.dev>",
        to: [recipient],
        subject,
        text,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      return jsonError("Le mail n'a pas pu être envoyé.", 502);
    }

    return Response.json({ ok: true, sent: true });
  }

  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(text)}`;

  return Response.json({ ok: true, sent: false, mailto });
}
