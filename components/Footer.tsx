import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
        <div>
          <p className="text-2xl font-black">
            Dojo<span className="text-sky-400">Math</span>
          </p>
          <p className="mt-2 max-w-md text-slate-400">
            Cours de mathématiques en ligne, réservation simple et accompagnement
            personnalisé.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-slate-300">
          <Link href="/cours">Cours</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/reservation">Réservation</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}