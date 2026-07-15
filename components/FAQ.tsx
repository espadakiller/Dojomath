"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const questions = [
  {
    q: "Comment se déroule un cours ?",
    a: "Le cours se déroule en visio. Nous commençons par identifier ce qui bloque, puis nous avançons avec une explication guidée et des exercices ciblés. L’élève repart avec les points à consolider.",
  },
  {
    q: "Qui assure les cours ?",
    a: "Les séances sont assurées par un enseignant certifié, actuellement en poste au collège, titulaire d’une licence de mathématiques et d’un master enseignement.",
  },
  {
    q: "Le paiement est-il sécurisé ?",
    a: "Oui. Le paiement est traité par Stripe. DojoMath ne reçoit ni ne conserve les données complètes de votre carte bancaire.",
  },
  {
    q: "Puis-je déplacer ou annuler un cours ?",
    a: "Une demande de déplacement ou d’annulation peut être faite depuis l’espace de réservation. Les règles applicables, notamment le délai de 24 heures, sont détaillées dans les conditions générales de vente.",
  },
  {
    q: "La formule Progression est-elle un abonnement ?",
    a: "La nature ponctuelle ou récurrente du paiement est affichée avant la validation sur la page de paiement Stripe. Aucun prélèvement n’est effectué sans validation explicite.",
  },
  {
    q: "Quels niveaux sont acceptés ?",
    a: "Collège, lycée, préparation au brevet ou au bac, remise à niveau et premières années du supérieur, selon le besoin de l’élève.",
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
            className="group w-full rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf6] p-6 text-left text-[#171313] shadow-lg shadow-[#6f1022]/5 transition duration-300 hover:border-[#b88a3b]/70"
            aria-expanded={isOpen}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{item.q}</h3>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3]">
                <Icon size={20} />
              </span>
            </div>
            {isOpen && <p className="mt-4 leading-7 text-[#645c58]">{item.a}</p>}
          </button>
        );
      })}
    </div>
  );
}
