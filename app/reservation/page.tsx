import BookingEmbed from "@/components/BookingEmbed";
import SectionTitle from "@/components/SectionTitle";

export default function ReservationPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          label="Réservation"
          title="Prends rendez-vous en quelques secondes"
          description="Choisis un créneau disponible et réserve ton cours de mathématiques en ligne."
        />

        <BookingEmbed />
      </div>
    </main>
  );
}
