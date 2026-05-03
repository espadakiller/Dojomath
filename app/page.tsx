import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/CourseCard";
import PricingCard from "@/components/PricingCard";
import AnimatedSection from "@/components/AnimatedSection";
import TestimonialCard from "@/components/TestimonialCard";
import FAQ from "@/components/FAQ";
import StatsStrip from "@/components/StatsStrip";
import PremiumButton from "@/components/PremiumButton";

import {
  Calculator,
  GraduationCap,
  Target,
  Brain,
  Video,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Stats */}
      <section className="px-5 py-28">
        <AnimatedSection>
          <StatsStrip />
        </AnimatedSection>
      </section>

      {/* Méthode */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionTitle
              label="Méthode"
              title="Une expérience pensée pour progresser"
              description="DojoMath combine cours en visio, exercices ciblés et suivi personnalisé."
            />
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3">
            <CourseCard
              icon={Brain}
              title="Explications simples"
              description="Comprends enfin les maths avec des méthodes claires."
            />
            <CourseCard
              icon={Target}
              title="Objectifs précis"
              description="On travaille exactement ce dont tu as besoin."
            />
            <CourseCard
              icon={Video}
              title="Cours en ligne"
              description="Réserve facilement et progresse depuis chez toi."
            />
          </div>
        </div>
      </section>

      {/* Niveaux */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            label="Niveaux"
            title="Pour collège, lycée et supérieur"
            description="Un accompagnement adapté à chaque élève."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <CourseCard
              icon={Calculator}
              title="Collège"
              description="Bases solides et préparation brevet."
            />
            <CourseCard
              icon={GraduationCap}
              title="Lycée"
              description="Spé maths, fonctions, dérivées et bac."
            />
            <CourseCard
              icon={ShieldCheck}
              title="Examens"
              description="Méthodologie et entraînement intensif."
            />
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            label="Tarifs"
            title="Des formules simples"
            description="Choisis la formule adaptée."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
              title="Cours ponctuel"
              price="35€"
              description="Pour débloquer une difficulté."
              features={["1h en ligne", "Cours personnalisé"]}
	      link="https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00"
            />
            <PricingCard
              title="Pack progression"
              price="120€"
              description="Pour progresser rapidement."
              features={["4 séances", "Suivi personnalisé"]}
	      link="https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00"
              highlighted
            />
            <PricingCard
              title="Préparation examen"
              price="250€"
              description="Programme intensif."
              features={["Annales", "Méthodologie"]}
	      link="https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00"
            />
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            label="Avis"
            title="Ils progressent avec DojoMath"
          />

          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              name="Sarah"
              level="Première"
              text="J’ai enfin compris les maths grâce à DojoMath."
            />
            <TestimonialCard
              name="Nassim"
              level="3ème"
              text="Super méthode pour préparer le brevet."
            />
            <TestimonialCard
              name="Emma"
              level="Terminale"
              text="Les exercices étaient parfaitement adaptés."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            label="FAQ"
            title="Questions fréquentes"
          />
          <FAQ />
        </div>
      </section>

      {/* CTA final */}
      <section className="px-5 py-24">
        <div className="glass mx-auto max-w-4xl rounded-[2rem] p-10 text-center">
          <h2 className="text-4xl font-black">
            Prêt à progresser ?
          </h2>

          <p className="mt-4 text-slate-300">
            Réserve ton premier cours dès maintenant.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <PremiumButton href="/reservation">
              Réserver un cours
            </PremiumButton>

            <PremiumButton href="/contact" variant="secondary">
              Poser une question
            </PremiumButton>
          </div>
        </div>
      </section>
    </main>
  );
}