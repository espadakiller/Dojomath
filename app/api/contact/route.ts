const recipient = "teogolu@gmail.com";
const subject = "DOJOMATH CONTACTS";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json(
      { ok: false, message: "Le message est illisible." },
      { status: 400 },
    );
  }

  const name = asText(payload.name);
  const email = asText(payload.email);
  const message = asText(payload.message);

  if (!name || !email || !message) {
    return Response.json(
      { ok: false, message: "Tous les champs sont obligatoires." },
      { status: 400 },
    );
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
      return Response.json(
        { ok: false, message: "Le mail n'a pas pu être envoyé." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, sent: true });
  }

  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(text)}`;

  return Response.json({ ok: true, sent: false, mailto });
}
