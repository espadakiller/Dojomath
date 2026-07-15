import Link from "next/link";

import Logo from "@/components/Logo";

const mainLinks = [
  { href: "/cours", label: "Cours" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/reservation", label: "Réservation" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/conditions-generales-de-vente", label: "CGV" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#b88a3b]/20 bg-[#fffaf3] px-5 py-12 text-[#171313]">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-md leading-7 text-[#645c58]">
            Cours individuels de mathématiques en visio, du collège au
            supérieur, assurés par un enseignant certifié.
          </p>
          <p className="mt-3 text-sm font-semibold text-[#6f1022]">
            Paiement traité par Stripe · Réservation sécurisée
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f1022]">
            Découvrir
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-[#4a3c36]">
            {mainLinks.map((link) => (
              <Link key={link.href} className="transition hover:text-[#6f1022]" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f1022]">
            Transparence
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-[#4a3c36]">
            {legalLinks.map((link) => (
              <Link key={link.href} className="transition hover:text-[#6f1022]" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-[#b88a3b]/20 pt-6 text-sm text-[#645c58]">
        © {new Date().getFullYear()} DojoMath. Tous droits réservés.
      </div>
    </footer>
  );
}
