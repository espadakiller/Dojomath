"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import Logo from "@/components/Logo";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/cours", label: "Cours" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/reservation", label: "Réservation" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#b88a3b]/25 bg-[#f1e4d1]/92 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 lg:py-4"
        aria-label="Navigation principale"
      >
        <Logo />

        <div className="hidden items-center gap-1.5 md:flex lg:gap-2">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2.5 text-sm font-semibold transition duration-200 lg:px-4 lg:text-base ${
                  active
                    ? "bg-[#fffaf3] text-[#6f1022] shadow-sm"
                    : "text-[#4a3c36] hover:bg-[#fffaf3]/75 hover:text-[#6f1022]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/reservation"
            className="ml-2 inline-flex min-h-11 items-center rounded-full bg-[#6f1022] px-5 text-sm font-semibold text-[#fffaf3] transition hover:bg-[#8a1730] hover:shadow-lg hover:shadow-[#6f1022]/20 lg:px-6 lg:text-base"
          >
            Réserver
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b88a3b]/30 bg-[#fffaf3] text-[#171313] md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#b88a3b]/25 bg-[#f1e4d1] px-5 py-5 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`min-h-12 rounded-xl px-4 py-3 text-base font-semibold transition ${
                    active
                      ? "bg-[#fffaf3] text-[#6f1022] shadow-sm"
                      : "text-[#4a3c36] hover:bg-[#fffaf3]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/reservation"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#6f1022] px-5 font-semibold text-[#fffaf3]"
            >
              Réserver un cours
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
