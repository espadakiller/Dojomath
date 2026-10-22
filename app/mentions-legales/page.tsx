import { pageMetadata } from "@/lib/metadata";

import LegalDocument from "@/components/LegalDocument";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata("Mentions légales", "Informations légales relatives au site DojoMath.", "/mentions-legales");

export default function MentionsLegalesPage() {
  return (
    <LegalDocument eyebrow="Transparence" title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p><strong>{siteConfig.legalName}</strong></p>
        <p>{siteConfig.legalStatus}</p>
        {siteConfig.legalRegistration && <p>Immatriculation : {siteConfig.legalRegistration}</p>}
        {siteConfig.legalAddress && <p>Adresse professionnelle : {siteConfig.legalAddress}</p>}
        <p>Contact : <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>, ou via le formulaire disponible sur la page Contact.</p>
      </section>
      <section>
        <h2>Responsable de la publication</h2>
        <p>{siteConfig.publicationDirector}</p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>Le site est déployé au moyen d’une infrastructure d’hébergement web sécurisée. Les informations contractuelles de l’hébergeur sont conservées par l’éditeur et peuvent être communiquées sur demande légitime.</p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>Les textes, éléments graphiques, supports pédagogiques et signes distinctifs présents sur le site sont protégés. Toute reproduction ou diffusion sans autorisation préalable est interdite, hors usages prévus par la loi.</p>
      </section>
      <section>
        <h2>Services externes</h2>
        <p>Les paiements sont traités par Stripe. Les visioconférences peuvent être organisées avec Google Meet. Les courriels transactionnels peuvent être envoyés par un prestataire spécialisé.</p>
      </section>
    </LegalDocument>
  );
}
