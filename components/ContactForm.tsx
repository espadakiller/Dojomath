"use client";

import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";

type FormStatus = {
  type: "idle" | "success" | "error";
  message: string;
  mailto?: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        sent?: boolean;
        mailto?: string;
        message?: string;
      };

      if (!response.ok || !result.ok || !result.sent) {
        setStatus({
          type: "error",
          message:
            result.message ??
            "Le message n'a pas pu être envoyé automatiquement.",
          mailto: result.mailto,
        });
        return;
      }

      form.reset();
      setStatus({
        type: "success",
        message:
          result.message ??
          "Message envoyé. Vous recevrez une réponse par email.",
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "Le service est momentanément inaccessible. Réessayez dans quelques instants.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Site internet</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="block" htmlFor="contact-name">
        <span className="mb-2 block text-sm font-semibold text-[#171313]">
          Nom
        </span>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          placeholder="Votre nom"
          required
          className="min-h-14 w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
        />
      </label>

      <label className="block" htmlFor="contact-email">
        <span className="mb-2 block text-sm font-semibold text-[#171313]">
          Email
        </span>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          placeholder="vous@email.fr"
          required
          className="min-h-14 w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
        />
      </label>

      <label className="block" htmlFor="contact-message">
        <span className="mb-2 block text-sm font-semibold text-[#171313]">
          Message
        </span>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Votre question, le niveau de l'élève ou vos disponibilités..."
          rows={6}
          minLength={3}
          maxLength={2000}
          required
          className="w-full resize-y rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
        />
      </label>

      {status.message && (
        <div
          role={status.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`rounded-xl border px-5 py-4 text-sm leading-6 ${
            status.type === "error"
              ? "border-[#d14f72]/30 bg-[#fff7f8] text-[#6f1022]"
              : "border-[#245447]/25 bg-[#f4fbf7] text-[#245447]"
          }`}
        >
          <p>{status.message}</p>
          {status.mailto && (
            <a
              href={status.mailto}
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#6f1022]/25 bg-white px-4 font-semibold text-[#6f1022]"
            >
              <Mail size={16} />
              Ouvrir ma messagerie
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#6f1022] px-6 py-4 font-semibold text-[#fffaf3] transition hover:bg-[#8a1730] hover:shadow-lg hover:shadow-[#6f1022]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={18} />
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
