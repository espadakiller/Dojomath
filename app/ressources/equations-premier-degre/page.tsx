import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Résoudre une équation du premier degré — fiche méthode",
  description: "Une fiche méthode gratuite avec exemple et exercices corrigés pour résoudre une équation du premier degré.",
  alternates: { canonical: "/ressources/equations-premier-degre" },
};

export default function EquationResourcePage() {
  return (
    <main className="px-5 pb-24 pt-36">
      <article className="mx-auto max-w-4xl">
        <header className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 shadow-xl shadow-[#6f1022]/8 md:p-12">
          <p className="eyebrow text-[#6f1022]">Fiche méthode gratuite · Collège</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-7xl">Résoudre une équation du premier degré</h1>
          <p className="mt-6 text-xl leading-8 text-[#645c58]">L’objectif est d’isoler l’inconnue en effectuant la même opération des deux côtés de l’égalité.</p>
        </header>

        <section className="mt-8 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 md:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">Exemple guidé</h2>
          <div className="mt-6 space-y-4 rounded-2xl bg-[#171313] p-6 font-mono text-lg text-[#fffaf3] md:text-2xl">
            <p>3x + 5 = 20</p>
            <p>3x + 5 − 5 = 20 − 5</p>
            <p>3x = 15</p>
            <p>3x ÷ 3 = 15 ÷ 3</p>
            <p className="font-bold text-[#f7dfb2]">x = 5</p>
          </div>
          <div className="mt-6 rounded-2xl border border-[#245447]/20 bg-[#f4fbf7] p-5 text-[#245447]">
            <p className="flex items-center gap-2 font-semibold"><CheckCircle2 size={19} /> Vérification</p>
            <p className="mt-2">3 × 5 + 5 = 15 + 5 = 20. La solution est correcte.</p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 md:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">À toi de jouer</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {["2x + 7 = 19", "5x − 4 = 21", "4x + 3 = 2x + 13"].map((exercise, index) => (
              <li key={exercise} className="rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf6] p-5">
                <span className="text-sm font-semibold text-[#6f1022]">Exercice {index + 1}</span>
                <p className="mt-3 font-mono text-lg font-semibold">{exercise}</p>
              </li>
            ))}
          </ol>
          <details className="mt-6 rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf6] p-5">
            <summary className="cursor-pointer font-semibold text-[#6f1022]">Afficher les réponses</summary>
            <p className="mt-4 leading-7 text-[#645c58]">1. x = 6 · 2. x = 5 · 3. x = 5. Pense à remplacer x dans l’équation de départ pour vérifier.</p>
          </details>
        </section>

        <section className="mt-8 rounded-[2rem] bg-[#6f1022] p-8 text-center text-[#fffaf3] md:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">Une étape reste floue ?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#fffaf3]/80">Une séance individuelle permet de reprendre précisément les erreurs et d’avancer sur les exercices de ton cours.</p>
          <Link href="/reservation" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fffaf3] px-6 font-semibold text-[#6f1022]">Voir les créneaux <ArrowRight size={17} /></Link>
        </section>
      </article>
    </main>
  );
}
