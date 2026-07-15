import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, MessageCircle, ShieldCheck } from "lucide-react";

import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Posez une question sur les cours, les niveaux, les disponibilités ou les formules DojoMath.",
  alternates: { canonical: "/contact" },
};

const reassurance = [
  { icon: Clock3, title: "Réponse personnelle", text: "La demande est lue par la personne qui assure les cours." },
  { icon: MessageCircle, title: "Aucun achat requis", text: "Vous pouvez demander conseil avant de choisir une formule." },
  { icon: ShieldCheck, title: "Données limitées", text: "Les informations servent uniquement à traiter votre demande." },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen px-5 pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-16">
        <section className="pt-2 lg:sticky lg:top-36">
          <p className="eyebrow text-[#6f1022]">Contact</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-[#171313] sm:text-5xl md:text-6xl">Parlons du besoin avant de réserver</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#645c58]">Indiquez simplement le niveau, le chapitre ou l’échéance. Vous recevrez une réponse adaptée, sans obligation d’achat.</p>
          <div className="mt-8 grid gap-4">
            {reassurance.map((item) => <div key={item.title} className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6f1022] text-white"><item.icon size={20} /></span><div><h2 className="text-base font-semibold">{item.title}</h2><p className="mt-1 text-sm leading-6 text-[#645c58]">{item.text}</p></div></div>)}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 shadow-xl shadow-[#6f1022]/8 sm:p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f1022]">Votre message</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Écrivez à DojoMath</h2>
          <p className="mt-3 leading-7 text-[#645c58]">Les champs marqués comme obligatoires sont nécessaires pour vous répondre.</p>
          <ContactForm />
          <p className="mt-5 rounded-xl border border-[#b88a3b]/20 bg-[#fffaf6] p-4 text-xs leading-6 text-[#645c58]">Les informations sont utilisées pour répondre à votre demande et conservées au maximum 24 mois si elle ne donne pas lieu à une relation contractuelle. Vous pouvez demander leur accès, rectification ou suppression. <Link className="font-semibold text-[#6f1022] underline" href="/confidentialite">En savoir plus</Link>.</p>
        </section>
      </div>
    </main>
  );
}
