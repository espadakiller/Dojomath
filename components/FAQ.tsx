"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const questions = [
  {
    q: "Comment se déroule un cours ?",
    a: "Le cours se fait en visio. On commence par identifier les difficultés, puis on travaille avec des explications simples et des exercices ciblés.",
  },
  {
    q: "Puis-je réserver directement en ligne ?",
    a: "Oui. Tu choisis un créneau disponible, puis tu confirmes ta réservation en ligne.",
  },
  {
    q: "Le paiement est-il sécurisé ?",
    a: "Oui. Le paiement pourra être géré avec Stripe, une solution de paiement sécurisée.",
  },
  {
    q: "Quels niveaux sont acceptés ?",
    a: "Collège, lycée, supérieur, remise à niveau et préparation aux examens.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {questions.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <button
            key={item.q}
            onClick={() => setOpenIndex(isOpen ? null : index)}
            className="glass w-full rounded-2xl p-6 text-left transition hover:border-sky-400/50"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold">{item.q}</h3>
              {isOpen ? <Minus /> : <Plus />}
            </div>

            {isOpen && (
              <p className="mt-4 leading-7 text-slate-300">{item.a}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}