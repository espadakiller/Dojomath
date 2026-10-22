import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";

import LegalDocument from "@/components/LegalDocument";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata("Politique de confidentialité", "Gestion des données personnelles sur DojoMath.", "/confidentialite");

export default function ConfidentialitePage() {
  return (
    <LegalDocument eyebrow="Données personnelles" title="Politique de confidentialité">
      <section>
        <h2>Données collectées</h2>
        <p>DojoMath collecte uniquement les informations nécessaires à la réponse aux demandes, à la création d’un compte, au paiement et à l’organisation des cours : identité du parent ou client, adresse électronique, nom et niveau de l’élève, objectif du cours, réservations et historique de compte.</p>
      </section>
      <section>
        <h2>Finalités et bases légales</h2>
        <ul>
          <li>répondre aux demandes envoyées volontairement via le formulaire ;</li>
          <li>exécuter le contrat de cours et gérer les réservations ;</li>
          <li>gérer les paiements, confirmations et obligations comptables ;</li>
          <li>sécuriser le site et prévenir les abus.</li>
        </ul>
      </section>
      <section>
        <h2>Destinataires</h2>
        <p>Les données sont accessibles à l’exploitant de DojoMath et, lorsque nécessaire, aux prestataires techniques intervenant pour l’hébergement, le paiement, l’envoi d’e-mails et la visioconférence. DojoMath ne vend pas les données personnelles.</p>
      </section>
      <section>
        <h2>Paiement</h2>
        <p>Les données complètes de carte bancaire sont collectées et traitées directement par Stripe. Elles ne sont pas enregistrées dans la base de données DojoMath.</p>
      </section>
      <section>
        <h2>Durées de conservation</h2>
        <p>Les messages sans suite sont supprimés ou anonymisés au plus tard après 24 mois. Les données liées à un compte actif sont conservées pendant la relation contractuelle puis pendant la durée nécessaire aux obligations légales. Les données strictement comptables peuvent être conservées pendant la durée réglementaire applicable.</p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou, lorsque les conditions sont réunies, la portabilité de vos données. Écrivez à <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> ou utilisez le <Link href="/contact">formulaire de contact</Link> en précisant « Données personnelles » dans votre message. Vous pouvez également introduire une réclamation auprès de la CNIL.</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>Le site utilise les éléments techniques indispensables à la connexion et à la sécurité du compte. Aucun cookie publicitaire n’est déposé par DojoMath. Si un outil de mesure d’audience non exempté de consentement est ajouté, le choix du visiteur sera demandé au préalable.</p>
      </section>
      <section>
        <h2>Données concernant les élèves</h2>
        <p>Le compte et la réservation sont destinés au parent, au représentant légal ou à l’élève majeur. Les informations pédagogiques demandées doivent rester limitées à ce qui est utile à la préparation du cours.</p>
      </section>
    </LegalDocument>
  );
}
