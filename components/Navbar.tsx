"use client";

import Link from "next/link";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#ececec]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Logo />

        <div className="hidden items-center gap-3 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-5 py-3 text-base font-semibold text-neutral-700 transition duration-200 hover:bg-white hover:text-[#5f1414] hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/reservation"
            className="ml-3 rounded-full bg-[#1d1d1f] px-7 py-3 text-base font-semibold text-white transition duration-200 hover:bg-[#5f1414] hover:shadow-lg hover:shadow-[#5f1414]/20"
          >
            Réserver
          </Link>
        </div>

        <button
          className="text-[#1d1d1f] md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Ouvrir le menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-black/10 bg-[#ececec] px-8 py-6 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-neutral-700 transition hover:bg-white hover:text-[#5f1414]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}