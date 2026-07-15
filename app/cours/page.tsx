import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calculator, GraduationCap, RefreshCcw, Target } from "lucide-react";

import CourseCard from "@/components/CourseCard";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Cours de mathématiques en ligne",
  description: "Découvrez les cours individuels DojoMath pour le collège, le lycée, le brevet, le bac et la remise à niveau.",
  alternates: { canonical: "/cours" },
};

const offers = [
  { href: "/cours-maths-college-en-ligne", icon: Calculator, title: "Collège", description: "6e à 3e : calcul, fractions, équations, fonctions, géométrie et brevet." },
  { href: "/cours-maths-lycee-en-ligne", icon: GraduationCap, title: "Lycée", description: "Seconde, spécialité maths, options complémentaires et expertes." },
  { href: "/preparation-brevet-maths", icon: Target, title: "Préparation brevet", description: "Diagnostic, exercices types, annales et méthode de rédaction." },
  { href: "/preparation-bac-maths", icon: BookOpenCheck, title: "Préparation bac", description: "Automatismes, méthodes et entraînement sur les attendus de l’épreuve." },
  { href: "/remise-a-niveau-maths", icon: RefreshCcw, title: "Remise à niveau", description: "Reprendre les bases par étapes, sans jugement et selon un objectif concret." },
];

const promises = [
  ["Avant la séance", "Vous indiquez le niveau, le chapitre et l’objectif. Les documents utiles peuvent être transmis en amont."],
  ["Pendant la séance", "Le cours alterne explication, exemple guidé et exercices réalisés par l’élève."],
  ["Après la séance", "Les acquis, erreurs à surveiller et prochaines priorités sont résumés clairement."],
];

export default function CoursPage() {
  return (
    <main className="px-5 pb-24 pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionTitle level="h1" label="Cours" title="Choisissez l’accompagnement adapté au besoin réel" description="Chaque page présente le public concerné, les objectifs, le déroulement et les réponses aux questions fréquentes." />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => <CourseCard key={offer.href} {...offer} />)}
          <CourseCard href="/ressources/equations-premier-degre" icon={BookOpenCheck} title="Tester la méthode" description="Consultez gratuitement un exemple de fiche avec exercice corrigé." />
        </div>

        <section className="mt-20 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 shadow-xl shadow-[#6f1022]/8 md:p-10">
          <p className="eyebrow text-[#6f1022]">Une séance, sans surprise</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Ce qui se passe concrètement</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {promises.map(([title, text], index) => (
              <article key={title} className="rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf6] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6f1022] font-semibold text-white">{index + 1}</span>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#645c58]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 md:p-10">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">Ce que DojoMath ne promet pas</h2>
            <p className="mt-4 text-lg leading-8 text-[#645c58]">Aucune note, moyenne ou réussite à un examen ne peut être garantie. Le rôle du cours est de fournir un cadre, une explication adaptée et un entraînement sérieux. La progression dépend aussi de l’assiduité et du travail personnel.</p>
          </article>
          <article className="rounded-[2rem] bg-[#6f1022] p-7 text-[#fffaf3] md:p-10">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">Un besoin précis ?</h2>
            <p className="mt-4 leading-7 text-[#fffaf3]/80">Décrivez le chapitre et la date du prochain contrôle pour préparer une séance ciblée.</p>
            <Link href="/reservation" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fffaf3] px-6 font-semibold text-[#6f1022]">Voir les créneaux <ArrowRight size={17} /></Link>
          </article>
        </section>
      </div>
    </main>
  );
}
