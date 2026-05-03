type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  link: string;
  highlighted?: boolean;
};

export default function PricingCard({
  title,
  price,
  description,
  features,
  link,
}: PricingCardProps) {
  return (
    <div className="group rounded-[2rem] border border-black/10 bg-white p-8 text-[#1d1d1f] shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-2 hover:border-[#6f1d1b]/30 hover:bg-[#6f1d1b] hover:text-white hover:shadow-xl hover:shadow-[#6f1d1b]/15">
      <h3 className="text-xl font-semibold tracking-[-0.03em]">{title}</h3>

      <p className="mt-4 text-5xl font-semibold tracking-[-0.05em]">{price}</p>

      <p className="mt-4 text-sm text-neutral-500 transition group-hover:text-white/75">
        {description}
      </p>

      <ul className="mt-8 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block w-full rounded-full bg-[#1d1d1f] px-6 py-4 text-center text-sm font-semibold text-white transition hover:scale-[1.03] group-hover:bg-white group-hover:text-[#1d1d1f]"
      >
        Payer maintenant
      </a>
    </div>
  );
}