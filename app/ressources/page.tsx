import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Exercices de maths corrigés et fiches gratuites",
  "Révisez les équations et les fractions avec des exemples guidés, des exercices et leurs corrections. Des fiches gratuites, sans compte, pour le collège.",
  "/ressources",
);

const resources = [
  { href: "/ressources/equations-premier-degre", title: "Résoudre une équation du premier degré", topic: "Équations", text: "Isoler l’inconnue, vérifier la solution et s’entraîner sur trois équations corrigées." },
  { href: "/ressources/calcul-fractions", title: "Additionner et soustraire des fractions", topic: "Fractions", text: "Trouver un dénominateur commun, simplifier et comprendre les erreurs fréquentes." },
];

export default function ResourcesPage() {
  return (
    <main className="px-5 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs items={[{ label: "Ressources", href: "/ressources" }]} />
        <header className="max-w-3xl">
          <p className="eyebrow text-[#6f1022]">Collège · Sans compte</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#171313] md:text-5xl">Exercices de maths corrigés et fiches gratuites</h1>
          <p className="mt-5 text-lg leading-8 text-[#554c47]">Une notion, un exemple expliqué et des exercices pour vérifier que la méthode est comprise. Les corrections sont accessibles directement sur chaque fiche.</p>
        </header>
        <section aria-label="Fiches disponibles" className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <article key={resource.href} className="flex h-full flex-col rounded-lg border border-[#b88a3b]/30 bg-[#fffaf3] p-7">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#6f1022]"><BookOpen size={18} aria-hidden="true" />{resource.topic}</p>
              <h2 className="mt-4 text-2xl font-semibold leading-snug"><Link href={resource.href} className="hover:underline">{resource.title}</Link></h2>
              <p className="mb-6 mt-3 leading-7 text-[#554c47]">{resource.text}</p>
              <Link href={resource.href} className="mt-auto inline-flex items-center gap-2 self-start font-semibold text-[#6f1022]">Lire la fiche et les corrections <ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
        </section>
        <section className="mt-12 border-t border-[#b88a3b]/30 pt-8">
          <h2 className="text-2xl font-semibold">Besoin d’un accompagnement individuel ?</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#554c47]">Les fiches permettent de s’entraîner seul. Un cours peut ensuite reprendre les étapes qui restent difficiles, au rythme de l’élève.</p>
          <div className="mt-5 flex flex-wrap gap-6 font-semibold text-[#6f1022]">
            <Link href="/cours-maths-college-en-ligne" className="underline underline-offset-4">Cours de maths au collège</Link>
            <Link href="/contact" className="underline underline-offset-4">Poser une question</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
