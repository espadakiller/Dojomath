import PricingCard from "@/components/PricingCard";
import SectionTitle from "@/components/SectionTitle";

const stripeLink = "https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00";

export default function TarifsPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          label="Tarifs"
          title="Des formules simples et lisibles"
          description="Choisis le niveau d'accompagnement qui correspond au besoin du moment : séance ponctuelle, suivi mensuel ou stage intensif pendant les vacances."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <PricingCard
            title="Liberté"
            price="25 €/h"
            description="Une séance simple et flexible, sans engagement."
            features={[
              "1h de cours en ligne",
              "Objectif ciblé",
              "Idéal pour débloquer une difficulté",
            ]}
            link={stripeLink}
          />

          <PricingCard
            title="Progression"
            price="110 €/mois"
            description="4h par mois avec suivi régulier."
            features={[
              "4h de cours par mois",
              "Rythme stable",
              "Suivi des points à consolider",
            ]}
            link={stripeLink}
            badge="Le plus choisi"
            highlighted
          />

          <PricingCard
            title="Réussite"
            price="140 €/mois"
            description="6h par mois pour un accompagnement plus poussé."
            features={[
              "6h de cours par mois",
              "Suivi renforcé",
              "Préparation des échéances importantes",
            ]}
            link={stripeLink}
            badge="Suivi renforcé"
          />

          <PricingCard
            title="Stage Vacances"
            price="65 €"
            description="Une séance intensive de 3h uniquement pendant les vacances scolaires."
            features={[
              "Séance de 3h",
              "Révisions ciblées",
              "Vacances scolaires uniquement",
            ]}
            link={stripeLink}
            badge="Vacances scolaires uniquement"
          />
        </div>
      </div>
    </main>
  );
}
