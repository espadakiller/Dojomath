import { sendContactEmail } from "@/lib/email";
import {
  asBoundedText,
  assertSameOrigin,
  isValidEmail,
  jsonError,
  normalizeEmail,
  rateLimit,
  readJsonBody,
} from "@/lib/security";

const recipient =
  process.env.CONTACT_TO_EMAIL ??
  process.env.TEACHER_EMAIL ??
  "mkkurban9@gmail.com";
const subject = "DOJOMATH CONTACTS";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);

  if (originError) {
    return originError;
  }

  const limited = await rateLimit(request, "contact", 5, 10 * 60 * 1000);

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

  const website = asBoundedText(json.data.website, { max: 200 });

  if (website) {
    return Response.json({ ok: true, sent: true });
  }

  const name = asBoundedText(json.data.name, { max: 100, min: 1 });
  const email = normalizeEmail(json.data.email);
  const message = asBoundedText(json.data.message, { max: 2_000, min: 3 });

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
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(text)}`;

  const result = await sendContactEmail({ name, email, message });

  if (!result.ok) {
    return Response.json(
      {
        ok: false,
        sent: false,
        mailto,
        message:
          "L'envoi automatique est momentanément indisponible. Vous pouvez ouvrir votre messagerie avec le message déjà rempli.",
      },
      { status: 503 },
    );
  }

  return Response.json({
    ok: true,
    sent: true,
    message: "Message envoyé. Vous recevrez une réponse par email.",
  });
}
