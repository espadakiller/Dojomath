import { CalendarDays } from "lucide-react";

import { pricingPlans } from "@/lib/pricing";

export default function BookingEmbed() {
  return (
    <div className="glass mx-auto max-w-6xl rounded-[2rem] p-4 shadow-xl shadow-[#6f1022]/8 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#171313]">
          Choisir une formule avant le créneau
        </h2>
        <p className="mt-3 max-w-3xl text-[#645c58]">
          Chaque formule correspond à une durée et un prix. Les liens Calendly
          peuvent être séparés par formule pour proposer les bons créneaux.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan) => (
          <a
            key={plan.id}
            href={plan.calendlyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 text-[#171313] shadow-lg shadow-[#6f1022]/5 transition hover:-translate-y-1 hover:border-[#b88a3b]/70 hover:bg-[#6f1022] hover:text-[#fffaf3]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3] transition group-hover:bg-[#b88a3b] group-hover:text-[#171313]">
              <CalendarDays size={22} />
            </div>
            <p className="text-lg font-semibold">{plan.title}</p>
            <p className="mt-2 text-sm text-[#645c58] transition group-hover:text-[#fffaf3]/75">
              {plan.duration} · {plan.price}
            </p>
            <p className="mt-4 text-sm font-semibold text-[#6f1022] transition group-hover:text-[#f7dfb2]">
              Choisir ce créneau
            </p>
          </a>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#b88a3b]/25 bg-[#fffaf3] shadow-lg shadow-[#6f1022]/5">
        <iframe
          src={process.env.NEXT_PUBLIC_CALENDLY_DEFAULT_URL ?? "https://calendly.com/dojomath"}
          title="Réservation DojoMath"
          className="h-[760px] w-full"
        />
      </div>
    </div>
  );
}
