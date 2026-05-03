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
          title="Des cours pour chaque niveau"
          description="DojoMath accompagne les élèves du collège au supérieur avec une méthode claire, progressive et adaptée."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            icon={Calculator}
            title="Collège"
            description="Fractions, équations, géométrie, proportionnalité, calcul littéral et préparation au brevet."
          />

          <CourseCard
            icon={FunctionSquare}
            title="Lycée"
            description="Fonctions, dérivées, suites, probabilités, trigonométrie, spécialité maths et préparation au bac."
          />

          <CourseCard
            icon={GraduationCap}
            title="Supérieur"
            description="Analyse, algèbre, statistiques, probabilités et remise à niveau selon ton cursus."
          />

          <CourseCard
            icon={BookOpen}
            title="Aide aux devoirs"
            description="Accompagnement sur les exercices, devoirs maison, contrôles à préparer et corrections."
          />

          <CourseCard
            icon={Target}
            title="Préparation examen"
            description="Méthodologie, annales, entraînement chronométré et stratégie pour gagner des points."
          />

          <CourseCard
            icon={Brain}
            title="Remise à niveau"
            description="Reprise des bases essentielles pour reconstruire une compréhension solide des mathématiques."
          />
        </div>
      </div>
    </main>
  );
}