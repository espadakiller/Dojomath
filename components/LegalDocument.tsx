import Link from "next/link";

export default function LegalDocument({
  eyebrow,
  title,
  updated = "16 juillet 2026",
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="px-5 pb-24 pt-36">
      <article className="mx-auto max-w-4xl rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 shadow-xl shadow-[#6f1022]/8 md:p-12">
        <p className="eyebrow text-[#6f1022]">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#171313] md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-[#645c58]">Dernière mise à jour : {updated}</p>
        <div className="mt-10 space-y-9 text-[1.03rem] leading-8 text-[#554c47] [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.03em] [&_h2]:text-[#171313] [&_li]:ml-5 [&_li]:list-disc [&_a]:font-semibold [&_a]:text-[#6f1022] [&_a]:underline">
          {children}
        </div>
        <div className="mt-12 border-t border-[#b88a3b]/25 pt-7 text-sm text-[#645c58]">
          Une question ? <Link className="font-semibold text-[#6f1022]" href="/contact">Contactez DojoMath</Link> avant tout paiement.
        </div>
      </article>
    </main>
  );
}
