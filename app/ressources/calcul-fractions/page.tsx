import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Additionner des fractions : méthode et exercices corrigés",
  "Apprenez à additionner et soustraire des fractions avec un dénominateur commun. Exemple détaillé, erreurs fréquentes et trois exercices corrigés au collège.",
  "/ressources/calcul-fractions",
);

export default function FractionsPage() {
  return (
    <main className="px-5 pb-24 pt-32 md:pt-36">
      <article className="mx-auto max-w-4xl">
        <Breadcrumbs items={[{ label: "Ressources", href: "/ressources" }, { label: "Calcul des fractions", href: "/ressources/calcul-fractions" }]} />
        <header>
          <p className="eyebrow text-[#6f1022]">Fiche méthode · Collège</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Additionner et soustraire des fractions</h1>
          <p className="mt-5 text-lg leading-8 text-[#554c47]">On additionne les numérateurs seulement lorsque les fractions ont le même dénominateur. Sinon, il faut d’abord les écrire avec un dénominateur commun.</p>
        </header>
        <section className="mt-10 border-t border-[#b88a3b]/30 pt-8">
          <h2 className="text-2xl font-semibold">Exemple : calculer 1/3 + 1/4</h2>
          <ol className="mt-5 space-y-4 leading-8 text-[#554c47]">
            <li><strong>1. Trouver un multiple commun.</strong> 12 est un multiple de 3 et de 4.</li>
            <li><strong>2. Réécrire chaque fraction.</strong> On multiplie le numérateur et le dénominateur par le même nombre : 1/3 = 4/12 et 1/4 = 3/12.</li>
            <li><strong>3. Additionner.</strong> 4/12 + 3/12 = 7/12. On garde le dénominateur commun.</li>
            <li><strong>4. Vérifier la simplification.</strong> 7 et 12 n’ont pas de diviseur commun autre que 1 : la fraction est irréductible.</li>
          </ol>
          <p className="mt-5 rounded-lg border-l-4 border-[#245447] bg-[#f4fbf7] p-5 text-[#245447]">Vérification : 1/3 est environ 0,333 et 1/4 vaut 0,25. Leur somme vaut environ 0,583, comme 7/12.</p>
        </section>
        <section className="mt-10 border-t border-[#b88a3b]/30 pt-8">
          <h2 className="text-2xl font-semibold">Deux erreurs à éviter</h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 leading-8 text-[#554c47]">
            <li>Ne pas additionner les dénominateurs : 1/3 + 1/4 n’est pas égal à 2/7.</li>
            <li>Ne pas changer seulement le dénominateur : pour conserver la valeur, le numérateur doit aussi être multiplié par le même nombre.</li>
          </ul>
        </section>
        <section className="mt-10 border-t border-[#b88a3b]/30 pt-8">
          <h2 className="text-2xl font-semibold">Trois exercices corrigés</h2>
          <p className="mt-3 leading-7 text-[#554c47]">Essaie chaque calcul avant d’ouvrir sa correction.</p>
          <div className="mt-5 grid gap-4">
            {[
              { question: "2/5 + 1/5", answer: "Les dénominateurs sont déjà égaux : (2 + 1)/5 = 3/5." },
              { question: "3/4 − 1/6", answer: "On prend 12 comme dénominateur commun : 9/12 − 2/12 = 7/12." },
              { question: "5/6 + 1/3", answer: "1/3 = 2/6, donc 5/6 + 2/6 = 7/6. Le résultat peut être supérieur à 1." },
            ].map((item, index) => (
              <details key={item.question} className="rounded-lg border border-[#b88a3b]/30 bg-[#fffaf3] p-5">
                <summary className="cursor-pointer font-semibold text-[#6f1022]">Exercice {index + 1} : {item.question}</summary>
                <p className="mt-4 leading-7 text-[#554c47]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <aside aria-label="Pour continuer" className="mt-10 border-t border-[#b88a3b]/30 pt-8">
          <h2 className="text-2xl font-semibold">Pour continuer</h2>
          <div className="mt-5 flex flex-wrap gap-5 font-semibold text-[#6f1022]">
            <Link href="/ressources/equations-premier-degre" className="underline underline-offset-4">Résoudre une équation</Link>
            <Link href="/cours-maths-college-en-ligne" className="underline underline-offset-4">Cours individuels au collège</Link>
            <Link href="/contact" className="underline underline-offset-4">Poser une question</Link>
          </div>
        </aside>
      </article>
    </main>
  );
}
