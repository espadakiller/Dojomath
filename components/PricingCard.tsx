import { Check } from "lucide-react";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  link: string;
  highlighted?: boolean;
  badge?: string;
  ctaLabel?: string;
};

export default function PricingCard({
  title,
  price,
  description,
  features,
  link,
  highlighted = false,
  badge,
  ctaLabel = "Voir les détails",
}: PricingCardProps) {
  const isExternalLink = link.startsWith("http");

  return (
    <div
      className={`group relative flex h-full min-h-[455px] flex-col rounded-[2rem] border bg-[#fffaf3]/95 p-8 text-[#171313] shadow-lg shadow-[#6f1022]/5 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-[#b88a3b]/70 hover:bg-[#6f1022] hover:text-[#fffaf3] hover:shadow-xl hover:shadow-[#6f1022]/18 ${
        highlighted
          ? "border-[#b88a3b]/70 ring-1 ring-[#b88a3b]/25"
          : "border-[#b88a3b]/25"
      }`}
    >
      {badge && (
        <p className="mb-5 inline-flex min-h-11 w-fit max-w-full items-center rounded-full border border-[#b88a3b]/50 bg-[#fffaf6] px-4 py-2 text-xs font-semibold uppercase leading-4 tracking-[0.14em] text-[#6f1022] group-hover:bg-[#fffaf3]/10 group-hover:text-[#f7dfb2]">
          {badge}
        </p>
      )}

      <h3 className="text-xl font-semibold tracking-[-0.03em]">{title}</h3>

      <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
        {price}
      </p>

      <p className="mt-4 text-sm leading-6 text-[#645c58] transition group-hover:text-[#fffaf3]/78">
        {description}
      </p>

      <ul className="mt-8 flex-1 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check
              size={18}
              className="mt-0.5 shrink-0 text-[#6f1022] group-hover:text-[#b88a3b]"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={link}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        className="mt-8 inline-block w-full rounded-full bg-[#6f1022] px-6 py-4 text-center text-sm font-semibold text-[#fffaf3] transition hover:scale-[1.03] group-hover:bg-[#b88a3b] group-hover:text-[#171313]"
      >
        {ctaLabel}
      </a>
    </div>
  );
}
