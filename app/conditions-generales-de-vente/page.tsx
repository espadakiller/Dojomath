import type { Metadata } from "next";
import Link from "next/link";

import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions applicables aux cours particuliers DojoMath.",
  alternates: { canonical: "/conditions-generales-de-vente" },
};

export default function CgvPage() {
  return (
    <LegalDocument eyebrow="Conditions contractuelles" title="Conditions générales de vente">
      <section>
        <h2>1. Objet</h2>
        <p>Les présentes conditions encadrent la vente de cours particuliers de mathématiques à distance proposés par DojoMath. La réservation d’un cours implique leur acceptation avant paiement.</p>
      </section>
      <section>
        <h2>2. Prestations</h2>
        <p>Les cours sont individuels et réalisés en visioconférence. Leur contenu est adapté au niveau et à l’objectif communiqués lors de la réservation. DojoMath est tenu à une obligation de moyens et ne garantit pas une note ou un résultat scolaire déterminé.</p>
      </section>
      <section>
        <h2>3. Prix et paiement</h2>
        <p>Les tarifs à jour sont affichés sur la <Link href="/tarifs">page Tarifs</Link> avant la commande. Le caractère ponctuel ou récurrent d’un paiement est affiché sur la page Stripe avant validation. Le paiement est exigible à la commande et traité par Stripe.</p>
      </section>
      <section>
        <h2>4. Crédits d’heures et réservation</h2>
        <p>Après confirmation du paiement, le compte est crédité du nombre d’heures correspondant à la formule. Une réservation n’est définitive qu’après confirmation du créneau. Les crédits ne sont ni cessibles ni échangeables contre des espèces.</p>
      </section>
      <section>
        <h2>5. Déplacement et annulation</h2>
        <p>Une demande faite plus de 24 heures avant le cours peut donner lieu à un déplacement ou à la restitution du crédit d’heure. À moins de 24 heures, le cours reste normalement dû, sauf motif légitime examiné au cas par cas. En cas d’annulation par DojoMath, le cours est déplacé ou le crédit est restitué.</p>
      </section>
      <section>
        <h2>6. Retard et absence</h2>
        <p>Le client doit se connecter à l’heure convenue avec un équipement fonctionnel. Un retard de l’élève ne prolonge pas automatiquement la séance. En cas de difficulté technique imputable à DojoMath empêchant le cours, une nouvelle séance est proposée.</p>
      </section>
      <section>
        <h2>7. Droit de rétractation</h2>
        <p>Pour les contrats conclus à distance, le consommateur bénéficie du délai légal de rétractation. Si le client demande qu’un cours commence avant la fin de ce délai, il reconnaît que la partie de prestation déjà exécutée pourra rester due. Lorsque la prestation a été entièrement exécutée après accord exprès, le droit de rétractation peut ne plus être applicable dans les conditions prévues par la loi.</p>
      </section>
      <section>
        <h2>8. Responsabilité</h2>
        <p>L’élève reste responsable de son travail personnel, de son matériel et du respect des règles de son établissement. DojoMath ne peut garantir un résultat chiffré, mais s’engage à préparer et réaliser la séance avec sérieux.</p>
      </section>
      <section>
        <h2>9. Réclamation</h2>
        <p>Toute réclamation peut être adressée via le formulaire de contact. Une réponse amiable sera recherchée en priorité. Les coordonnées du médiateur de la consommation compétent sont communiquées au consommateur avec les documents contractuels applicables.</p>
      </section>
    </LegalDocument>
  );
}
