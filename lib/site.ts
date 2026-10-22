export const siteConfig = {
  name: "DojoMath",
  url: "https://www.domaths.fr",
  locale: "fr_FR",
  description:
    "Cours particuliers de mathématiques en visio, du collège au supérieur, avec un enseignant certifié.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "dojomath.contact@gmail.com",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "DojoMath",
  legalStatus:
    process.env.NEXT_PUBLIC_LEGAL_STATUS ??
    "Activité indépendante de cours particuliers en ligne",
  legalAddress: process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? "",
  legalRegistration: process.env.NEXT_PUBLIC_LEGAL_REGISTRATION ?? "",
  publicationDirector:
    process.env.NEXT_PUBLIC_PUBLICATION_DIRECTOR ?? "L’exploitant de DojoMath",
} as const;

export const publicPages = [
  "",
  "/cours",
  "/tarifs",
  "/reservation",
  "/contact",
  "/cours-maths-college-en-ligne",
  "/cours-maths-lycee-en-ligne",
  "/preparation-brevet-maths",
  "/preparation-bac-maths",
  "/remise-a-niveau-maths",
  "/ressources",
  "/ressources/equations-premier-degre",
  "/ressources/calcul-fractions",
  "/mentions-legales",
  "/confidentialite",
  "/conditions-generales-de-vente",
] as const;

export function absoluteUrl(path = "") {
  return new URL(path || "/", siteConfig.url).toString();
}
