import BookingEmbed from "@/components/BookingEmbed";
import SectionTitle from "@/components/SectionTitle";

const steps = [
  {
    title: "Compte",
    text: "Le parent crée ou ouvre son compte pour lier les paiements et les réservations.",
  },
  {
    title: "Jetons",
    text: "Le paiement ajoute des jetons au compte dès la confirmation Stripe.",
  },
  {
    title: "Créneau",
    text: "Le calendrier propose les dates ouvertes, les horaires et les stages vacances.",
  },
  {
    title: "Visio",
    text: "Le lien Google Meet reste visible dans l'espace réservation et dans le mail.",
  },
];

const faqs = [
  {
    question: "Pourquoi créer un compte ?",
    answer:
      "Le compte évite les doublons, garde le solde de jetons, l'historique des cours et les liens visio.",
  },
  {
    question: "Quand les jetons arrivent-ils ?",
    answer:
      "Après paiement, Stripe envoie une confirmation au site. Les jetons sont alors ajoutés automatiquement au compte connecté.",
  },
  {
    question: "Puis-je déplacer un cours ?",
    answer:
      "Oui, depuis la liste des réservations, une demande de déplacement ou d'annulation peut être envoyée.",
  },
];

export default function ReservationPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          label="Réservation"
          title="Réservez un cours en quelques secondes"
          description="Choisissez la formule adaptée, puis sélectionnez un créneau disponible pour votre cours de mathématiques en ligne."
        />

        <BookingEmbed />

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass rounded-[2rem] p-6 md:p-8">
            <p className="eyebrow text-[#6f1022]">Déroulé</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#171313] md:text-5xl">
              Un parcours clair avant le cours
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.25rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6f1022] text-sm font-semibold text-[#fffaf3]">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-[#171313]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#645c58]">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6 md:p-8">
            <p className="eyebrow text-[#6f1022]">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#171313] md:text-5xl">
              Les points importants
            </h2>
            <div className="mt-6 grid gap-3">
              {faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-[1.25rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-5"
                >
                  <h3 className="text-lg font-semibold text-[#171313]">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#645c58]">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
