export type PlanId = "liberte" | "progression" | "reussite" | "stage";

const stripeLinks = {
  liberte: "https://buy.stripe.com/28E3cv5ILch83EO9uX3Je01",
  progression: "https://buy.stripe.com/dRmfZh9Z14OG0sC5eH3Je02",
  reussite: "https://buy.stripe.com/14AdR9efha903EObD53Je03",
  stage: "https://buy.stripe.com/dRmbJ1dbd6WO3EOfTl3Je04",
} satisfies Record<PlanId, string>;

const calLinks = {
  liberte: "https://cal.com/dojomath/liberte",
  progression: "https://cal.com/dojomath/progression",
  reussite: "https://cal.com/dojomath/reussite",
  stage: "https://cal.com/dojomath/stage-vacances",
} satisfies Record<PlanId, string>;

export const pricingPlans = [
  {
    id: "liberte",
    title: "Liberté",
    badge: "Le plus basique",
    price: "25 €/h",
    description: "Une séance simple et flexible, sans engagement.",
    duration: "1h",
    features: [
      "1h de cours en ligne",
      "Objectif ciblé",
      "Idéal pour débloquer une difficulté",
    ],
    detailHref: "/tarifs#liberte",
    stripeHref: process.env.NEXT_PUBLIC_STRIPE_LIBERTE_URL ?? stripeLinks.liberte,
    calendlyHref:
      process.env.NEXT_PUBLIC_CALENDLY_LIBERTE_URL ?? calLinks.liberte,
  },
  {
    id: "progression",
    title: "Progression",
    badge: "Le plus choisi",
    price: "110 €/mois",
    description: "4h par mois avec suivi régulier.",
    duration: "4h par mois",
    features: [
      "4h de cours par mois",
      "Rythme stable",
      "Suivi des points à consolider",
    ],
    detailHref: "/tarifs#progression",
    stripeHref:
      process.env.NEXT_PUBLIC_STRIPE_PROGRESSION_URL ?? stripeLinks.progression,
    calendlyHref:
      process.env.NEXT_PUBLIC_CALENDLY_PROGRESSION_URL ?? calLinks.progression,
    highlighted: true,
  },
  {
    id: "reussite",
    title: "Réussite",
    badge: "Suivi renforcé",
    price: "140 €/mois",
    description: "6h par mois pour un accompagnement plus poussé.",
    duration: "6h par mois",
    features: [
      "6h de cours par mois",
      "Suivi renforcé",
      "Préparation des échéances importantes",
    ],
    detailHref: "/tarifs#reussite",
    stripeHref:
      process.env.NEXT_PUBLIC_STRIPE_REUSSITE_URL ?? stripeLinks.reussite,
    calendlyHref:
      process.env.NEXT_PUBLIC_CALENDLY_REUSSITE_URL ?? calLinks.reussite,
  },
  {
    id: "stage",
    title: "Stage Vacances",
    badge: "Vacances scolaires uniquement",
    price: "65 €",
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
    calendlyHref:
      process.env.NEXT_PUBLIC_CALENDLY_STAGE_URL ?? calLinks.stage,
  },
] as const;

export const comparisonRows = [
  {
    label: "Cours individuel",
    included: { liberte: true, progression: true, reussite: true, stage: true },
  },
  {
    label: "Sans engagement",
    included: { liberte: true, progression: false, reussite: false, stage: true },
  },
  {
    label: "Suivi régulier",
    included: { liberte: false, progression: true, reussite: true, stage: false },
  },
  {
    label: "Exercices personnalisés",
    included: { liberte: false, progression: true, reussite: true, stage: true },
  },
  {
    label: "Bilan aux parents",
    included: { liberte: false, progression: true, reussite: true, stage: true },
  },
  {
    label: "Méthode de travail",
    included: { liberte: false, progression: true, reussite: true, stage: true },
  },
  {
    label: "Correction entre séances",
    included: { liberte: false, progression: false, reussite: true, stage: false },
  },
  {
    label: "Remise à niveau intensive",
    included: { liberte: false, progression: false, reussite: true, stage: true },
  },
  {
    label: "Priorité créneaux",
    included: { liberte: false, progression: true, reussite: true, stage: false },
  },
] satisfies Array<{
  label: string;
  included: Record<PlanId, boolean>;
}>;
