"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const questions = [
  {
    q: "Comment se déroule un cours ?",
    a: "Le cours se fait en visio. Nous commençons par comprendre ce qui bloque, puis nous avançons avec des explications simples, des exemples et des exercices ciblés.",
  },
  {
    q: "Puis-je réserver directement en ligne ?",
    a: "Oui. Vous choisissez un créneau disponible, puis vous confirmez la réservation en ligne. Le premier cours permet aussi de poser le cadre du suivi.",
  },
  {
    q: "Le paiement est-il sécurisé ?",
    a: "Oui. Le paiement passe par Stripe, une solution reconnue pour gérer les transactions en ligne de manière sécurisée.",
  },
  {
    q: "Quels niveaux sont acceptés ?",
    a: "Collège, lycée, remise à niveau, préparation brevet ou bac, et premières bases du supérieur selon le besoin de l'élève.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {questions.map((item, index) => {
        const isOpen = openIndex === index;
        const Icon = isOpen ? Minus : Plus;

        return (
          <button
            key={item.q}
            onClick={() => setOpenIndex(isOpen ? null : index)}
            className="group w-full rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf6] p-6 text-left text-[#171313] shadow-lg shadow-[#6f1022]/5 transition duration-300 hover:-translate-y-1 hover:border-[#b88a3b]/70 hover:bg-[#6f1022] hover:text-[#fffaf3] hover:shadow-xl hover:shadow-[#6f1022]/18"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold transition group-hover:text-[#fffaf3]">
                {item.q}
              </h3>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3] transition group-hover:bg-[#b88a3b] group-hover:text-[#171313]">
                <Icon size={20} />
              </span>
            </div>

            {isOpen && (
              <p className="mt-4 leading-7 text-[#645c58] transition group-hover:text-[#fffaf3]/78">
                {item.a}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
