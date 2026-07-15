export type ServiceContent = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  goals: string[];
  program: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const services: ServiceContent[] = [
  {
    slug: "cours-maths-college-en-ligne",
    eyebrow: "Collège",
    title: "Cours de maths en ligne au collège",
    description:
      "De la 6e à la 3e, un accompagnement individuel pour consolider les bases, préparer les contrôles et retrouver confiance.",
    audience:
      "Élèves de 6e, 5e, 4e ou 3e qui souhaitent reprendre une notion, mieux s’organiser ou préparer le brevet.",
    goals: [
      "Reprendre les bases de calcul sans laisser de lacunes",
      "Comprendre les fractions, équations, fonctions et la géométrie",
      "Apprendre à rédiger une réponse complète",
      "Préparer un contrôle avec des exercices ciblés",
    ],
    program: [
      "Diagnostic rapide à partir du cours et des exercices de l’élève",
      "Explication de la notion avec un exemple guidé",
      "Mise en pratique progressive",
      "Bilan des acquis et travail conseillé après la séance",
    ],
    faqs: [
      { question: "Faut-il préparer des documents ?", answer: "Si possible, envoyez le cours, le contrôle ou les exercices concernés avant la séance. Le cours peut toutefois commencer sans document." },
      { question: "Le parent reçoit-il un retour ?", answer: "Oui, les points travaillés et les priorités peuvent être résumés au parent après la séance." },
    ],
  },
  {
    slug: "cours-maths-lycee-en-ligne",
    eyebrow: "Lycée",
    title: "Cours de maths en ligne au lycée",
    description:
      "Seconde, Première et Terminale : un suivi structuré pour comprendre le cours, gagner en méthode et préparer les évaluations.",
    audience:
      "Élèves de Seconde, de spécialité mathématiques, de maths complémentaires ou expertes.",
    goals: [
      "Maîtriser fonctions, suites, probabilités, analyse et géométrie",
      "Structurer les raisonnements et la rédaction",
      "Corriger les erreurs récurrentes",
      "Préparer devoirs surveillés et examens",
    ],
    program: [
      "Repérage précis des difficultés",
      "Rappel des outils indispensables",
      "Exercices de difficulté croissante",
      "Méthode de vérification et plan de révision",
    ],
    faqs: [
      { question: "La spécialité maths est-elle couverte ?", answer: "Oui, de la Première à la Terminale, ainsi que les options complémentaires et expertes selon le chapitre." },
      { question: "Peut-on préparer un devoir urgent ?", answer: "Oui, une séance ponctuelle peut cibler un devoir ou un chapitre précis, selon les créneaux disponibles." },
    ],
  },
  {
    slug: "preparation-brevet-maths",
    eyebrow: "Brevet",
    title: "Préparation au brevet de mathématiques",
    description:
      "Révisions ciblées, sujets types et méthode pour sécuriser les points accessibles le jour de l’épreuve.",
    audience: "Élèves de 3e qui souhaitent organiser leurs révisions ou reprendre les chapitres fragiles.",
    goals: [
      "Identifier rapidement les chapitres prioritaires",
      "S’entraîner sur des exercices proches de l’examen",
      "Gérer le temps et présenter les calculs",
      "Éviter les erreurs classiques de lecture et d’unité",
    ],
    program: [
      "Mini-diagnostic par thèmes",
      "Révision des méthodes essentielles",
      "Exercices chronométrés et correction expliquée",
      "Plan de travail jusqu’à l’épreuve",
    ],
    faqs: [
      { question: "Quand commencer ?", answer: "Quelques semaines permettent un travail plus progressif, mais une séance ponctuelle peut déjà clarifier les priorités." },
      { question: "Travaillez-vous avec des annales ?", answer: "Oui, les exercices types et annales servent à appliquer la méthode dans les conditions de l’examen." },
    ],
  },
  {
    slug: "preparation-bac-maths",
    eyebrow: "Baccalauréat",
    title: "Préparation au bac de mathématiques",
    description:
      "Un entraînement individualisé pour la spécialité mathématiques : méthodes, automatismes et sujets d’examen.",
    audience: "Élèves de Terminale préparant l’épreuve de spécialité ou souhaitant consolider un chapitre important.",
    goals: [
      "Réviser les méthodes attendues à l’épreuve",
      "Renforcer les automatismes de calcul",
      "Savoir choisir une démarche et la justifier",
      "Travailler la gestion du temps sur des sujets types",
    ],
    program: [
      "Bilan des chapitres maîtrisés et fragiles",
      "Rappels ciblés sans refaire tout le cours",
      "Résolution commentée de questions types",
      "Plan de révision réaliste et priorisé",
    ],
    faqs: [
      { question: "Peut-on travailler un seul chapitre ?", answer: "Oui. Une séance peut être entièrement consacrée aux probabilités, suites, fonctions, primitives ou à un autre besoin précis." },
      { question: "Les séances sont-elles individuelles ?", answer: "Oui, les formules présentées sur le site correspondent à des cours individuels en visio." },
    ],
  },
  {
    slug: "remise-a-niveau-maths",
    eyebrow: "Remise à niveau",
    title: "Remise à niveau en mathématiques en ligne",
    description:
      "Un parcours progressif pour reprendre les bases sans jugement et reconstruire une méthode de travail durable.",
    audience:
      "Collégiens, lycéens, étudiants ou adultes qui reprennent les mathématiques après une période difficile ou une interruption.",
    goals: [
      "Repérer les prérequis réellement manquants",
      "Reprendre le calcul, les fractions et les équations",
      "Avancer par étapes courtes et vérifiables",
      "Retrouver de l’autonomie face à un exercice",
    ],
    program: [
      "Diagnostic bienveillant du niveau actuel",
      "Priorisation des notions utiles au projet",
      "Exercices courts avec correction immédiate",
      "Progression ajustée d’une séance à l’autre",
    ],
    faqs: [
      { question: "Est-ce adapté aux adultes ?", answer: "Oui, notamment pour une reprise d’études, une formation ou la préparation d’un projet nécessitant des bases scientifiques." },
      { question: "Combien de séances faut-il ?", answer: "Cela dépend du point de départ et de l’objectif. La première séance permet de proposer une trajectoire sans imposer de durée." },
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
