import Link from "next/link";
import { CheckCircle2, CalendarDays } from "lucide-react";

export default function PaiementPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <section className="glass mx-auto max-w-3xl rounded-[2rem] p-6 text-center shadow-xl shadow-[#6f1022]/8 md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#245447] text-[#fffaf3]">
          <CheckCircle2 size={30} />
        </div>
        <p className="eyebrow mt-6 text-[#6f1022]">Paiement</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#171313] md:text-6xl">
          Paiement bien reçu
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#645c58]">
          Stripe confirme le règlement au site et les jetons sont ajoutés au
          compte DojoMath connecté. Vous pouvez revenir sur la page réservation
          pour choisir votre créneau.
        </p>
        <Link
          href="/reservation"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-7 text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730]"
        >
          <CalendarDays size={18} />
          Revenir à la réservation
        </Link>
      </section>
    </main>
  );
}
