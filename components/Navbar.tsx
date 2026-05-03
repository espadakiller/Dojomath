"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight">
          Dojo<span className="text-sky-400">Math</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-sky-400"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/reservation"
            className="rounded-full bg-sky-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            Réserver
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Ouvrir le menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-5 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-300"
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