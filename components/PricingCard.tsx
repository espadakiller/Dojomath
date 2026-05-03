type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  link: string; // 👈 ajout important
  highlighted?: boolean;
};

export default function PricingCard({
  title,
  price,
  description,
  features,
  link,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-3xl p-8 transition duration-300 hover:-translate-y-2 ${
        highlighted
          ? "bg-sky-400 text-slate-950 shadow-2xl shadow-sky-400/20"
          : "glass"
      }`}
    >
      <h3 className="text-2xl font-black">{title}</h3>

      <p className="mt-4 text-5xl font-black">{price}</p>

      <p
        className={`mt-4 ${
          highlighted ? "text-slate-800" : "text-slate-300"
        }`}
      >
        {description}
      </p>

      <ul className="mt-8 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="font-medium">
            ✓ {feature}
          </li>
        ))}
      </ul>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-8 inline-block w-full rounded-full px-6 py-4 text-center font-bold transition hover:scale-105 ${
          highlighted
            ? "bg-slate-950 text-white"
            : "bg-white text-slate-950"
        }`}
      >
        Payer maintenant
      </a>
    </div>
  );
}