import { Clock3, MessageCircle, ShieldCheck } from "lucide-react";

import ContactForm from "@/components/ContactForm";

const reassurance = [
  {
    icon: Clock3,
    title: "Réponse rapide",
    text: "Votre demande est lue directement, sans intermédiaire.",
  },
  {
    icon: MessageCircle,
    title: "Conseil personnalisé",
    text: "Niveau, objectif et formule : vous recevez une réponse adaptée.",
  },
  {
    icon: ShieldCheck,
    title: "Adresse protégée",
    text: "Votre email sert uniquement à répondre à votre demande.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen px-5 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-16">
        <section className="pt-2 lg:sticky lg:top-36">
          <p className="eyebrow text-[#6f1022]">Contact</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-[#171313] sm:text-5xl md:text-6xl">
            Parlons de votre besoin
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#645c58]">
            Une question sur les cours, les disponibilités ou la formule la plus
            adaptée ? Décrivez simplement la situation de l’élève et votre
            objectif.
          </p>

          <div className="mt-8 grid gap-4">
            {reassurance.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6f1022] text-[#fffaf3]">
                  <item.icon size={20} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#171313]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#645c58]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 shadow-xl shadow-[#6f1022]/8 sm:p-8 md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f1022]">
              Votre message
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#171313]">
              Écrivez-nous
            </h2>
            <p className="mt-3 leading-7 text-[#645c58]">
              Tous les champs sont nécessaires pour pouvoir vous répondre.
            </p>
          </div>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
