import Link from "next/link";

import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#b88a3b]/20 bg-[#fffaf3] px-5 py-10 text-[#171313]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <Logo />
          <p className="mt-4 max-w-md leading-7 text-[#645c58]">
            Cours de mathématiques en ligne, accompagnement personnalisé et
            méthode claire pour progresser avec confiance.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-medium text-[#4a3c36]">
          <Link className="transition hover:text-[#6f1022]" href="/cours">
            Cours
          </Link>
          <Link className="transition hover:text-[#6f1022]" href="/tarifs">
            Tarifs
          </Link>
          <Link className="transition hover:text-[#6f1022]" href="/reservation">
            Réservation
          </Link>
          <Link className="transition hover:text-[#6f1022]" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
