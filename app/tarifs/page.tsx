import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck, X } from "lucide-react";

import PricingCard from "@/components/PricingCard";
import SectionTitle from "@/components/SectionTitle";
import { comparisonRows, pricingPlans, type PlanId } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Tarifs des cours de maths en ligne",
  description: "Cours individuel à 30 €/h, suivi mensuel ou stage vacances. Comparez clairement les formules DojoMath.",
  alternates: { canonical: "/tarifs" },
};

const planOrder: PlanId[] = ["liberte", "progression", "stage"];

export default function TarifsPage() {
  return (
    <main className="px-5 pb-24 pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionTitle level="h1" label="Tarifs" title="Des prix affichés avant le paiement" description="Les cours sont individuels. Le détail du paiement, ponctuel ou récurrent, est présenté avant la validation sur Stripe." />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div id={plan.id} key={plan.id} className="scroll-mt-32">
              <PricingCard title={plan.title} price={plan.price} description={plan.description} features={[...plan.features]} link="/reservation" badge={plan.badge} highlighted={"highlighted" in plan ? plan.highlighted : false} ctaLabel="Voir les créneaux" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#245447]/20 bg-[#f4fbf7] p-5 text-[#245447]">
          <ShieldCheck className="mt-0.5 shrink-0" size={22} />
          <p className="leading-7"><strong>Paiement sécurisé :</strong> Stripe traite la carte bancaire. DojoMath ne reçoit pas les données complètes de la carte. Aucun prélèvement récurrent n’est créé sans indication et validation explicites sur la page de paiement.</p>
        </div>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] shadow-xl shadow-[#6f1022]/8">
          <div className="border-b border-[#b88a3b]/20 bg-[#fffaf6] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6f1022]">Comparatif</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#171313]">Ce qui est inclus</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead><tr className="border-b border-[#b88a3b]/20 text-sm text-[#645c58]"><th className="w-[28%] px-6 py-5 font-semibold text-[#171313]">Inclus</th>{pricingPlans.map((plan) => <th key={plan.id} className="px-6 py-5 font-semibold"><span className="block text-[#171313]">{plan.title}</span><span className="mt-1 block text-xs text-[#6f1022]">{plan.price}</span></th>)}</tr></thead>
              <tbody>{comparisonRows.map((row) => <tr key={row.label} className="border-b border-[#b88a3b]/15 text-[#171313] last:border-b-0"><td className="px-6 py-5 font-medium">{row.label}</td>{planOrder.map((planId) => <td key={planId} className="px-6 py-5">{row.included[planId] ? <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6f1022] text-white" aria-label="Inclus"><Check size={17} /></span> : <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b88a3b]/35 text-[#b88a3b]" aria-label="Non inclus"><X size={17} /></span>}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 md:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">À lire avant de payer</h2>
          <div className="mt-5 grid gap-4 text-[#645c58] md:grid-cols-3">
            <p className="rounded-2xl bg-[#fffaf6] p-5"><strong className="block text-[#171313]">Déplacement</strong><span className="mt-2 block leading-7">Une demande faite plus de 24 h avant la séance peut être déplacée sans perte du crédit.</span></p>
            <p className="rounded-2xl bg-[#fffaf6] p-5"><strong className="block text-[#171313]">Paiement</strong><span className="mt-2 block leading-7">Le nombre d’heures créditées est indiqué avant la validation du paiement.</span></p>
            <p className="rounded-2xl bg-[#fffaf6] p-5"><strong className="block text-[#171313]">Questions</strong><span className="mt-2 block leading-7">En cas de doute sur une formule, utilisez d’abord le formulaire de contact.</span></p>
          </div>
          <p className="mt-6 text-sm">Consultez les <Link href="/conditions-generales-de-vente" className="font-semibold text-[#6f1022] underline">conditions générales de vente</Link> et la <Link href="/confidentialite" className="font-semibold text-[#6f1022] underline">politique de confidentialité</Link>.</p>
        </section>
      </div>
    </main>
  );
}
