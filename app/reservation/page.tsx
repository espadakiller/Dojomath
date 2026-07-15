import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CreditCard, ShieldCheck, UserRound } from "lucide-react";

import BookingEmbed from "@/components/BookingEmbed";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Réserver un cours de maths en ligne",
  description: "Consultez les disponibilités, choisissez une formule et réservez votre cours individuel de mathématiques en visio.",
  alternates: { canonical: "/reservation" },
};

const steps = [
  { icon: CalendarDays, title: "Choisir", text: "Sélectionnez la formule et consultez les créneaux disponibles." },
  { icon: UserRound, title: "Créer le compte", text: "Le compte conserve les heures achetées, les réservations et le lien visio." },
  { icon: CreditCard, title: "Payer", text: "Stripe traite le paiement et crédite les heures correspondant à la formule." },
  { icon: ShieldCheck, title: "Confirmer", text: "Choisissez le créneau final et recevez la confirmation par e-mail." },
];

export default function ReservationPage() {
  return (
    <main className="px-5 pb-24 pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionTitle level="h1" label="Réservation" title="Consultez les créneaux avant de payer" description="Le parcours comprend un compte, l’achat d’un crédit d’heures puis la confirmation du créneau. Toutes les étapes sont visibles ci-dessous." />

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf3] p-5">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6f1022] text-white"><step.icon size={20} /></span><span className="text-sm font-semibold text-[#6f1022]">Étape {index + 1}</span></div>
              <h2 className="mt-4 text-xl font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#645c58]">{step.text}</p>
            </article>
          ))}
        </section>

        <div className="mb-8 rounded-2xl border border-[#245447]/20 bg-[#f4fbf7] p-5 text-sm leading-7 text-[#245447]">
          <strong>Avant de continuer :</strong> les cours sont individuels et réalisés en visio. Le paiement est traité par Stripe. Les règles de déplacement, d’annulation et de rétractation figurent dans les <Link className="font-semibold underline" href="/conditions-generales-de-vente">conditions générales de vente</Link>.
        </div>

        <BookingEmbed />

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="glass rounded-[2rem] p-6 md:p-8">
            <p className="eyebrow text-[#6f1022]">Pourquoi un compte ?</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Un historique clair</h2>
            <p className="mt-5 leading-7 text-[#645c58]">Le compte relie les paiements aux réservations, conserve le solde d’heures et permet de retrouver le lien Google Meet. Il évite également qu’un créneau soit attribué deux fois.</p>
          </div>
          <div className="glass rounded-[2rem] p-6 md:p-8">
            <p className="eyebrow text-[#6f1022]">Besoin d’aide ?</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Posez la question avant de payer</h2>
            <p className="mt-5 leading-7 text-[#645c58]">Si le niveau, la formule ou le déroulement n’est pas clair, envoyez d’abord un message. Aucun achat n’est nécessaire pour demander un conseil.</p>
            <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center rounded-full border border-[#6f1022]/30 bg-white px-5 font-semibold text-[#6f1022]">Contacter DojoMath</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
