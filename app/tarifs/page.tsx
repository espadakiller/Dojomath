import { Check, X } from "lucide-react";

import PricingCard from "@/components/PricingCard";
import SectionTitle from "@/components/SectionTitle";
import { comparisonRows, pricingPlans, type PlanId } from "@/lib/pricing";

const planOrder: PlanId[] = ["liberte", "progression", "stage"];

export default function TarifsPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          label="Tarifs"
          title="Des formules simples et lisibles"
          description="Compare les trois accompagnements, puis réserve directement la formule adaptée."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={[...plan.features]}
              link="/reservation"
              badge={plan.badge}
              highlighted={"highlighted" in plan ? plan.highlighted : false}
              ctaLabel="Réserver"
            />
          ))}
        </div>

        <section className="mt-16 overflow-hidden rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] shadow-xl shadow-[#6f1022]/8">
          <div className="border-b border-[#b88a3b]/20 bg-[#fffaf6] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6f1022]">
              Comparatif
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#171313]">
              Ce qui est inclus
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#b88a3b]/20 bg-[#fffaf3] text-sm text-[#645c58]">
                  <th className="w-[28%] px-6 py-5 font-semibold text-[#171313]">
                    Inclus
                  </th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.id} className="px-6 py-5 font-semibold">
                      <span className="block text-[#171313]">{plan.title}</span>
                      <span className="mt-1 block text-xs text-[#6f1022]">
                        {plan.price}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-[#b88a3b]/15 text-[#171313] transition hover:bg-[#fffaf6] last:border-b-0"
                  >
                    <td className="px-6 py-5 font-medium">{row.label}</td>
                    {planOrder.map((planId) => (
                      <td key={planId} className="px-6 py-5">
                        {row.included[planId] ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6f1022] text-[#fffaf3] shadow-sm">
                            <Check size={17} />
                          </span>
                        ) : (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b88a3b]/35 bg-[#fffaf6] text-[#b88a3b]">
                            <X size={17} />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
