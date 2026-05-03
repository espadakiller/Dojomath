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
            className="group w-full rounded-[2rem] border border-black/10 bg-white p-6 text-left text-[#1d1d1f] shadow-lg shadow-black/5 transition duration-300 hover:border-[#6f1d1b]/30 hover:bg-[#6f1d1b] hover:text-white hover:shadow-xl hover:shadow-[#6f1d1b]/15"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{item.q}</h3>
              {isOpen ? <Minus /> : <Plus />}
            </div>

            {isOpen && (
              <p className="mt-4 leading-7 text-neutral-600 transition group-hover:text-white/75">
                {item.a}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}