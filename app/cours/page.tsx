import CourseCard from "@/components/CourseCard";
import SectionTitle from "@/components/SectionTitle";

import {
  BookOpen,
  Calculator,
  FunctionSquare,
  GraduationCap,
  Target,
  Brain,
} from "lucide-react";

export default function CoursPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          label="Cours"
          title="Des cours pour chaque étape"
          description="DojoMath accompagne les élèves du collège au supérieur avec une méthode claire, progressive et adaptée au programme suivi."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            icon={Calculator}
            title="Collège"
            description="6e, 5e, 4e et 3e : calcul, fractions, géométrie, proportionnalité, équations, fonctions, statistiques et préparation au brevet."
          />

          <CourseCard
            icon={FunctionSquare}
            title="Lycée"
            description="Seconde, Première et Terminale : tronc commun, spécialité mathématiques, mathématiques complémentaires ou expertes selon le parcours."
          />

          <CourseCard
            icon={GraduationCap}
            title="Supérieur"
            description="Analyse, algèbre, statistiques, probabilités et remise à niveau pour les débuts en santé, sciences ou ingénierie."
          />

          <CourseCard
            icon={BookOpen}
            title="Aide aux devoirs"
            description="Accompagnement sur les exercices, devoirs maison, contrôles à préparer et corrections pour consolider la méthode."
          />

          <CourseCard
            icon={Target}
            title="Préparation examen"
            description="Brevet, bac, contrôle important : méthodologie, exercices types, entraînement et stratégie pour gagner des points."
          />

          <CourseCard
            icon={Brain}
            title="Remise à niveau"
            description="Reprise des bases essentielles pour reconstruire une compréhension solide et retrouver confiance en mathématiques."
          />
        </div>
      </div>
    </main>
  );
}
