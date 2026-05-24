import CourseCard from "@/components/CourseCard";
import SectionTitle from "@/components/SectionTitle";

import {
  BookOpen,
  Calculator,
  FileText,
  FunctionSquare,
  GraduationCap,
  Target,
  Brain,
} from "lucide-react";

const courseSections = [
  {
    id: "college",
    title: "Collège",
    description:
      "Un espace par niveau pour déposer fiches, exercices, corrections et supports de cours.",
    items: [
      "6e",
      "5e",
      "4e",
      "3e",
      "Préparation brevet",
      "Calcul, géométrie et proportionnalité",
    ],
  },
  {
    id: "lycee",
    title: "Lycée",
    description:
      "Des dossiers adaptés au parcours de l'élève, de la seconde aux options de terminale.",
    items: [
      "Seconde",
      "Première spécialité mathématiques",
      "Terminale spécialité mathématiques",
      "Mathématiques complémentaires",
      "Mathématiques expertes",
      "Préparation bac",
    ],
  },
  {
    id: "superieur",
    title: "Supérieur",
    description:
      "Des ressources pour reprendre les bases et accompagner les premières années scientifiques.",
    items: [
      "Licence 1",
      "Licence 2",
      "Licence 3",
      "Statistiques et probabilités",
      "Analyse et algèbre",
      "Maths appliquées à l'ingénierie",
    ],
  },
  {
    id: "aide-devoirs",
    title: "Aide aux devoirs",
    description:
      "Des fiches méthodes classées par chapitre pour aider l'élève à refaire seul les exercices.",
    items: [
      "Fiches méthodes",
      "Calculs et automatismes",
      "Fonctions",
      "Géométrie",
      "Probabilités et statistiques",
      "Corrections guidées",
    ],
  },
  {
    id: "examens",
    title: "Préparation examen",
    description:
      "Un espace pour centraliser sujets corrigés, annales, exercices types et méthodes de rédaction.",
    items: [
      "Sujets corrigés",
      "Annales brevet",
      "Annales bac",
      "Exercices chronométrés",
      "Méthodes de rédaction",
      "Bilans avant examen",
    ],
  },
  {
    id: "remise-niveau",
    title: "Remise à niveau",
    description:
      "Des parcours progressifs pour reconstruire les bases, combler les manques et retrouver confiance.",
    items: [
      "Diagnostic de départ",
      "Bases de calcul",
      "Fractions et équations",
      "Fonctions essentielles",
      "Méthode de travail",
      "Parcours intensif",
    ],
  },
];

export default function CoursPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          label="Cours"
          title="Des espaces pour chaque besoin"
          description="Choisissez une catégorie pour accéder aux niveaux, chapitres et futurs documents associés."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            href="#college"
            icon={Calculator}
            title="Collège"
            description="6e, 5e, 4e, 3e, bases solides et préparation au brevet."
          />

          <CourseCard
            href="#lycee"
            icon={FunctionSquare}
            title="Lycée"
            description="Seconde, spécialité maths, complémentaires, expertes et préparation bac."
          />

          <CourseCard
            href="#superieur"
            icon={GraduationCap}
            title="Supérieur"
            description="Licence, remise à niveau scientifique et maths appliquées à l'ingénierie."
          />

          <CourseCard
            href="#aide-devoirs"
            icon={BookOpen}
            title="Aide aux devoirs"
            description="Fiches méthodes et corrections guidées selon les chapitres travaillés."
          />

          <CourseCard
            href="#examens"
            icon={Target}
            title="Préparation examen"
            description="Sujets corrigés, annales, exercices types et méthode pour gagner des points."
          />

          <CourseCard
            href="#remise-niveau"
            icon={Brain}
            title="Remise à niveau"
            description="Documents progressifs pour reprendre les bases et combler les lacunes."
          />
        </div>

        <div className="mt-24 space-y-10">
          {courseSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-6 shadow-xl shadow-[#6f1022]/8 md:p-9"
            >
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#6f1022]">
                    Espace documents
                  </p>
                  <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#171313]">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-lg leading-8 text-[#645c58]">
                    {section.description}
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3]">
                  <FileText size={26} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="group rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf6] p-5 text-[#171313] transition hover:-translate-y-1 hover:border-[#b88a3b]/70 hover:bg-[#6f1022] hover:text-[#fffaf3] hover:shadow-lg hover:shadow-[#6f1022]/15"
                  >
                    <p className="font-semibold">{item}</p>
                    <p className="mt-2 text-sm text-[#645c58] transition group-hover:text-[#fffaf3]/75">
                      Documents et supports à ajouter.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
