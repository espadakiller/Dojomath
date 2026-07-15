import { BadgeCheck, CircleUserRound, Euro, MonitorPlay } from "lucide-react";

const facts = [
  { icon: BadgeCheck, value: "Certifié", label: "enseignant en poste" },
  { icon: CircleUserRound, value: "Individuel", label: "un élève par séance" },
  { icon: Euro, value: "30 €/h", label: "première formule sans engagement" },
  { icon: MonitorPlay, value: "En visio", label: "partout en France" },
];

export default function StatsStrip() {
  return (
    <div className="mx-auto grid max-w-6xl gap-4 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-6 shadow-lg shadow-[#6f1022]/5 sm:grid-cols-2 md:grid-cols-4 md:p-8">
      {facts.map((fact) => (
        <div key={fact.value} className="rounded-2xl border border-[#b88a3b]/18 bg-[#fffaf6] p-5 text-center">
          <fact.icon className="mx-auto text-[#6f1022]" size={24} />
          <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#171313]">
            {fact.value}
          </p>
          <p className="mt-2 text-sm font-medium text-[#645c58]">{fact.label}</p>
        </div>
      ))}
    </div>
  );
}
