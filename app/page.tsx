import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, Brain, CheckCircle2, GraduationCap, ShieldCheck, Target, Video } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import CourseCard from "@/components/CourseCard";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import PremiumButton from "@/components/PremiumButton";
import PricingCard from "@/components/PricingCard";
import SectionTitle from "@/components/SectionTitle";
import StatsStrip from "@/components/StatsStrip";
import { pricingPlans } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Cours particuliers de maths en ligne",
  description: "Cours individuels de mathématiques en visio, du collège au supérieur, avec un enseignant certifié. Tarifs transparents dès 30 € par heure.",
  alternates: { canonical: "/" },
};

const sessionSteps = [
  { title: "Comprendre le besoin", text: "Niveau, chapitre, contrôle ou examen : l’objectif est précisé avant la séance." },
  { title: "Expliquer clairement", text: "La notion est reprise avec des mots simples et un exemple entièrement guidé." },
  { title: "Faire pratiquer", text: "L’élève résout des exercices choisis pour vérifier chaque étape." },
  { title: "Donner une suite", text: "La séance se termine par les acquis, les erreurs à surveiller et la priorité suivante." },
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="px-5 py-16 md:py-24">
        <AnimatedSection><StatsStrip /></AnimatedSection>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionTitle label="Méthode" title="Une séance utile dès la première heure" description="Pas de promesse magique : un diagnostic précis, des explications adaptées et une méthode que l’élève peut réutiliser seul." />
          </AnimatedSection>

          <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <AnimatedSection>
              <div className="h-full overflow-hidden rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-3 shadow-xl shadow-[#6f1022]/8">
                <Image src="/section-images/method.jpg" alt="Cahier de mathématiques utilisé pendant une séance en ligne" width={960} height={600} quality={72} sizes="(min-width: 1024px) 52vw, 100vw" className="h-full min-h-[420px] w-full rounded-[1.5rem] object-cover" />
              </div>
            </AnimatedSection>
            <div className="grid gap-4 sm:grid-cols-2">
              {sessionSteps.map((step, index) => (
                <AnimatedSection key={step.title}>
                  <article className="h-full rounded-[1.5rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-6 shadow-lg shadow-[#6f1022]/5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6f1022] font-semibold text-white">{index + 1}</span>
                    <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-3 leading-7 text-[#645c58]">{step.text}</p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection><SectionTitle label="Accompagnements" title="Une page claire pour chaque objectif" description="Consultez le contenu, le déroulement et les réponses aux questions avant de réserver." /></AnimatedSection>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CourseCard href="/cours-maths-college-en-ligne" icon={Brain} title="Collège" description="6e à 3e, bases, méthode, contrôles et préparation au brevet." />
            <CourseCard href="/cours-maths-lycee-en-ligne" icon={GraduationCap} title="Lycée" description="Seconde, spécialité mathématiques, complémentaires et expertes." />
            <CourseCard href="/preparation-brevet-maths" icon={Target} title="Préparation brevet" description="Révisions ciblées, annales, gestion du temps et rédaction." />
            <CourseCard href="/preparation-bac-maths" icon={BookOpenCheck} title="Préparation bac" description="Automatismes, méthodes et entraînement sur des sujets types." />
            <CourseCard href="/remise-a-niveau-maths" icon={CheckCircle2} title="Remise à niveau" description="Un parcours progressif pour reconstruire les prérequis utiles." />
            <CourseCard href="/ressources/equations-premier-degre" icon={Video} title="Ressource gratuite" description="Une vraie fiche méthode avec exemple et exercices corrigés." />
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection><SectionTitle label="Tarifs" title="Des prix affichés avant de créer un compte" description="Cours individuel dès 30 € par heure. Le paiement est traité par Stripe et les conditions sont consultables avant l’achat." /></AnimatedSection>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} title={plan.title} price={plan.price} description={plan.description} features={[...plan.features]} link={plan.detailHref} badge={plan.badge} highlighted={"highlighted" in plan ? plan.highlighted : false} />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-[#645c58]">Avant tout paiement, consultez les <Link className="font-semibold text-[#6f1022] underline" href="/conditions-generales-de-vente">conditions générales de vente</Link>.</p>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 shadow-xl shadow-[#6f1022]/8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6f1022] text-white"><ShieldCheck size={30} /></span>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#6f1022]">Qui assure les cours ?</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Un enseignant certifié, actuellement en poste</h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-[#645c58]">
              <p>DojoMath est porté par un enseignant certifié qui accompagne des élèves en cours particuliers depuis plus de cinq ans. Son parcours comprend une licence de mathématiques à Strasbourg, un master enseignement à Dijon et un DUT en génie civil.</p>
              <p>Cette double culture, théorique et appliquée, permet d’accompagner les élèves qui reprennent les bases comme ceux qui s’orientent vers des études scientifiques.</p>
              <p className="rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf6] p-5 text-base"><strong className="text-[#171313]">Transparence :</strong> aucune progression chiffrée ni réussite à un examen n’est garantie. Les résultats dépendent notamment du travail personnel, de l’assiduité et du point de départ de l’élève.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 shadow-xl shadow-[#6f1022]/8 md:p-10">
          <SectionTitle label="FAQ" title="Les réponses avant de réserver" />
          <FAQ />
        </div>
      </section>

      <section className="px-5 py-24">
        <AnimatedSection>
          <div className="glass mx-auto max-w-4xl rounded-[2rem] p-10 text-center shadow-xl shadow-[#6f1022]/8">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#171313] md:text-5xl">Vous savez exactement ce qui sera travaillé ?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#645c58]">Choisissez un créneau et décrivez le chapitre ou le contrôle. Si vous hésitez sur la formule, posez d’abord votre question.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <PremiumButton href="/reservation">Voir les créneaux</PremiumButton>
              <PremiumButton href="/contact" variant="secondary">Poser une question</PremiumButton>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
