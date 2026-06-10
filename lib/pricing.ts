export type PlanId = "liberte" | "progression" | "stage";

const stripeLinks = {
  liberte: "https://buy.stripe.com/28E3cv5ILch83EO9uX3Je01",
  progression: "https://buy.stripe.com/dRmfZh9Z14OG0sC5eH3Je02",
  stage: "https://buy.stripe.com/dRmbJ1dbd6WO3EOfTl3Je04",
} satisfies Record<PlanId, string>;

export const pricingPlans = [
  {
    id: "liberte",
    title: "Liberté",
    badge: "Le plus basique",
    price: "30 €/h",
    description: "Une séance simple et flexible, sans engagement.",
    duration: "1h",
    features: [
      "1h de cours en ligne",
      "Objectif ciblé",
      "Idéal pour débloquer une difficulté",
    ],
    detailHref: "/tarifs#liberte",
    stripeHref: process.env.NEXT_PUBLIC_STRIPE_LIBERTE_URL ?? stripeLinks.liberte,
  },
  {
    id: "progression",
    title: "Progression",
    badge: "Suivi renforcé",
    price: "110 €/mois",
    description: "4h par mois avec suivi régulier et accompagnement renforcé.",
    duration: "4h par mois",
    features: [
      "4h de cours par mois",
      "Suivi renforcé des points à consolider",
      "Préparation des échéances importantes",
    ],
    detailHref: "/tarifs#progression",
    stripeHref:
      process.env.NEXT_PUBLIC_STRIPE_PROGRESSION_URL ?? stripeLinks.progression,
    highlighted: true,
  },
  {
    id: "stage",
    title: "Stage Vacances",
    badge: "Vacances scolaires uniquement",
    price: "75 €",
    description:
      "Une séance intensive de 3h uniquement pendant les vacances scolaires.",
    duration: "3h",
    features: [
      "Séance de 3h",
      "Révisions ciblées",
      "Vacances scolaires uniquement",
    ],
    detailHref: "/tarifs#stage",
    stripeHref: process.env.NEXT_PUBLIC_STRIPE_STAGE_URL ?? stripeLinks.stage,
  },
] as const;

export const comparisonRows = [
  {
    label: "Cours individuel",
    included: { liberte: true, progression: true, stage: true },
  },
  {
    label: "Sans engagement",
    included: { liberte: true, progression: false, stage: true },
  },
  {
    label: "Suivi régulier renforcé",
    included: { liberte: false, progression: true, stage: false },
  },
  {
    label: "Exercices personnalisés",
    included: { liberte: false, progression: true, stage: true },
  },
  {
    label: "Bilan aux parents",
    included: { liberte: false, progression: true, stage: true },
  },
  {
    label: "Méthode de travail",
    included: { liberte: false, progression: true, stage: true },
  },
  {
    label: "Correction entre séances",
    included: { liberte: false, progression: true, stage: false },
  },
  {
    label: "Remise à niveau intensive",
    included: { liberte: false, progression: true, stage: true },
  },
  {
    label: "Priorité créneaux",
    included: { liberte: false, progression: true, stage: false },
  },
] satisfies Array<{
  label: string;
  included: Record<PlanId, boolean>;
}>;
