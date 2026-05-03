import PricingCard from "@/components/PricingCard";
import SectionTitle from "@/components/SectionTitle";

export default function TarifsPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          label="Tarifs"
          title="Des formules simples et efficaces"
          description="Choisis la formule adaptée à ton besoin et réserve facilement ton cours en ligne."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            title="Cours ponctuel"
            price="35€"
            description="Pour débloquer une difficulté précise."
            features={[
              "1h de cours en ligne",
              "Explications personnalisées",
              "Exercices ciblés",
            ]}
            link="https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00"
          />

          <PricingCard
            title="Pack progression"
            price="120€"
            description="Pour progresser régulièrement."
            features={[
              "4 séances de 1h",
              "Suivi personnalisé",
              "Plan de progression",
              "Exercices adaptés",
            ]}
            link="https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00"
            highlighted
          />

          <PricingCard
            title="Préparation examen"
            price="250€"
            description="Pour réussir un examen important."
            features={[
              "8 séances intensives",
              "Annales corrigées",
              "Méthodologie complète",
              "Stratégie d'examen",
            ]}
            link="https://buy.stripe.com/bJe9ATfjldlc6R0az13Je00"
          />
        </div>
      </div>
    </main>
  );
}