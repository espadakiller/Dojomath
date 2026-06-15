"use client";

import { FormEvent, useState } from "react";

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });

    const result = (await response.json()) as {
      ok?: boolean;
      sent?: boolean;
      mailto?: string;
      message?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !result.ok) {
      setStatus({
        type: "error",
        message: result.message ?? "Le message n'a pas pu être envoyé.",
      });
      return;
    }

    if (result.mailto) {
      window.location.href = result.mailto;
      setStatus({
        type: "success",
        message:
          result.message ??
          "Votre application mail va s'ouvrir avec le message prérempli.",
      });
      return;
    }

    form.reset();
    setStatus({ type: "success", message: "Message envoyé, merci." });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <input
        name="name"
        type="text"
        placeholder="Nom"
        required
        className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
      />

      <textarea
        name="message"
        placeholder="Message"
        rows={6}
        required
        className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
      />

      {status.message && (
        <p
          className={`rounded-2xl border px-5 py-4 text-sm ${
            status.type === "error"
              ? "border-[#d14f72]/30 bg-[#fffaf6] text-[#6f1022]"
              : "border-[#b88a3b]/35 bg-[#fffaf6] text-[#6f1022]"
          }`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#6f1022] px-6 py-4 font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730] hover:shadow-lg hover:shadow-[#6f1022]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
