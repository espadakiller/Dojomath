import Image from "next/image";

import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/CourseCard";
import PricingCard from "@/components/PricingCard";
import AnimatedSection from "@/components/AnimatedSection";
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

const stripeLink = "https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00";

function SectionVisual({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <AnimatedSection>
        <div className="group relative mx-auto mb-12 max-w-4xl overflow-hidden rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-3 shadow-xl shadow-[#6f1022]/8 transition duration-500 hover:-translate-y-1 hover:border-[#b88a3b]/60 hover:shadow-2xl hover:shadow-[#6f1022]/15">
          <Image
            src={src}
            alt={alt}
            width={960}
            height={600}
            quality={74}
            sizes="(min-width: 1024px) 896px, calc(100vw - 40px)"
            className="aspect-[16/9] w-full rounded-[1.5rem] object-cover transition duration-700 group-hover:scale-[1.025]"
          />
        <p className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-[#b88a3b]/35 bg-[#fffaf3]/92 px-6 py-4 text-base font-semibold leading-6 text-[#6f1022] shadow-lg shadow-[#6f1022]/10 backdrop-blur md:bottom-7 md:left-7 md:right-7 md:px-8 md:py-5 md:text-lg">
          {caption}
        </p>
      </div>
    </AnimatedSection>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="px-5 py-28">
        <AnimatedSection>
          <StatsStrip />
        </AnimatedSection>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionTitle
              label="Méthode"
              title="Un cadre clair pour avancer sans pression"
              description="On part de ce qui bloque vraiment, on remet les bases au propre, puis on construit des automatismes avec des exercices choisis pour l'élève."
            />
          </AnimatedSection>

          <SectionVisual
            src="/section-images/method.jpg"
            alt="Un bureau de travail chaleureux avec un cahier de mathématiques et une leçon en ligne"
            caption="Une séance claire, progressive et pensée pour redonner confiance."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <AnimatedSection>
              <CourseCard
                icon={Brain}
                title="Comprendre avant d'appliquer"
                description="Chaque notion est reprise avec des mots simples, des exemples concrets et le temps nécessaire pour que l'élève se sente capable."
              />
            </AnimatedSection>
            <AnimatedSection>
              <CourseCard
                icon={Target}
                title="Des objectifs précis"
                description="Contrôle, devoir maison, brevet, bac ou remise à niveau : la séance garde un cap clair et mesurable."
              />
            </AnimatedSection>
            <AnimatedSection>
              <CourseCard
                icon={Video}
                title="Un suivi régulier"
                description="Après le cours, l'élève repart avec une méthode, des points à consolider et une trajectoire lisible pour progresser."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionTitle
              label="Niveaux"
              title="Du collège au lycée, avec le bon niveau d'exigence"
              description="Les contenus suivent les attendus officiels : une progression solide au collège, puis un accompagnement adapté aux choix de spécialités au lycée."
            />
          </AnimatedSection>

          <SectionVisual
            src="/section-images/levels.jpg"
            alt="Des cahiers, instruments de géométrie et supports de mathématiques pour différents niveaux"
            caption="Collège, lycée et premières bases du supérieur, avec un accompagnement adapté."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <AnimatedSection>
              <CourseCard
                icon={Calculator}
                title="Collège"
                description="6e, 5e, 4e et 3e : calcul, fractions, proportionnalité, géométrie, équations, fonctions, statistiques et préparation au brevet."
              />
            </AnimatedSection>
            <AnimatedSection>
              <CourseCard
                icon={GraduationCap}
                title="Lycée"
                description="Seconde, Première et Terminale : tronc commun, spécialité mathématiques, options mathématiques complémentaires ou expertes selon le parcours."
              />
            </AnimatedSection>
            <AnimatedSection>
              <CourseCard
                icon={ShieldCheck}
                title="Supérieur"
                description="Remise à niveau, analyse, algèbre, statistiques et bases utiles pour les débuts en santé, sciences ou ingénierie."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionTitle
              label="Formules"
              title="Quatre façons simples de commencer"
              description="Un cours ponctuel, un rythme mensuel ou une séance intensive pendant les vacances : tu choisis le format qui colle au besoin du moment."
            />
          </AnimatedSection>

          <SectionVisual
            src="/section-images/pricing.jpg"
            alt="Un calendrier élégant et des supports de cours pour organiser les formules DojoMath"
            caption="Des formules lisibles, sans détour, pour avancer au bon rythme."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <PricingCard
              title="Liberté"
              price="25 €/h"
              description="Une séance simple et flexible, sans engagement."
              features={["1h de cours en ligne", "Objectif ciblé", "Idéal pour débloquer une difficulté"]}
              link={stripeLink}
            />
            <PricingCard
              title="Progression"
              price="110 €/mois"
              description="4h par mois avec suivi régulier."
              features={["4h de cours par mois", "Rythme stable", "Suivi des points à consolider"]}
              link={stripeLink}
              badge="Le plus choisi"
              highlighted
            />
            <PricingCard
              title="Réussite"
              price="140 €/mois"
              description="6h par mois pour un accompagnement plus poussé."
              features={["6h de cours par mois", "Suivi renforcé", "Préparation des échéances importantes"]}
              link={stripeLink}
              badge="Suivi renforcé"
            />
            <PricingCard
              title="Stage Vacances"
              price="65 €"
              description="Une séance intensive de 3h uniquement pendant les vacances scolaires."
              features={["Séance de 3h", "Révisions ciblées", "Vacances scolaires uniquement"]}
              link={stripeLink}
              badge="Vacances scolaires uniquement"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionTitle
              label="Qui sommes-nous"
              title="Un enseignant certifié, une approche humaine"
              description="DojoMath repose sur une expérience de terrain, avec des cours pensés pour réconcilier les élèves avec les mathématiques."
            />
          </AnimatedSection>

          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionVisual
              src="/section-images/about.jpg"
              alt="Un espace de travail d'enseignant avec cahier, outils de géométrie et livres de mathématiques"
              caption="Une méthode issue de la classe, du cours particulier et de l’accompagnement exigeant."
            />

            <AnimatedSection>
              <div className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-8 text-[#171313] shadow-xl shadow-[#6f1022]/8 md:p-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3] shadow-lg shadow-[#6f1022]/15">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6f1022]">
                      DojoMath
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#171313]">
                      Sérieux, clarté et accompagnement humain
                    </p>
                  </div>
                </div>

                <p className="text-lg leading-8 text-[#645c58]">
                  DojoMath est porté par un enseignant certifié, actuellement
                  en poste au collège, qui accompagne des élèves depuis plusieurs
                  années en cours particuliers. L’objectif est simple : rendre le
                  travail plus clair, installer de bonnes méthodes et aider
                  chaque élève à retrouver de la confiance.
                </p>

                <p className="mt-6 text-lg leading-8 text-[#645c58]">
                  Au fil des suivis, des élèves de collège et de lycée ont pu
                  fortement progresser, parfois jusqu’à doubler leur moyenne
                  lorsque le travail devenait régulier. Le parcours combine une
                  licence de mathématiques à Strasbourg, un master enseignement
                  à Dijon, un DUT en génie civil, ainsi qu’une expérience en
                  prépa santé spécialisée, notamment chez Formascience à
                  Strasbourg.
                </p>

                <p className="mt-6 text-lg leading-8 text-[#645c58]">
                  Cette double culture, scolaire et appliquée, permet
                  d’accompagner aussi bien les élèves qui reprennent les bases
                  que ceux qui visent des études scientifiques ou les premiers
                  pas vers l’ingénierie. Les retours des familles et des élèves
                  sont au coeur de la méthode : un cours doit être sérieux, mais
                  aussi rassurant, vivant et utile dès la première séance.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <AnimatedSection>
            <div className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5 shadow-xl shadow-[#6f1022]/8 md:p-10">
              <SectionTitle label="FAQ" title="Questions fréquentes" />
              <FAQ />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-5 py-24">
        <AnimatedSection>
          <div className="glass mx-auto max-w-4xl rounded-[2rem] p-10 text-center shadow-xl shadow-[#6f1022]/8">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#171313] md:text-5xl">
              On commence par un premier déclic ?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#645c58]">
              Choisis un créneau, explique ce qui bloque, et on construit une
              première séance claire, utile et rassurante.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <PremiumButton href="/reservation">Réserver un cours</PremiumButton>

              <PremiumButton href="/contact" variant="secondary">
                Poser une question
              </PremiumButton>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
