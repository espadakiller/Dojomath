export default function BookingEmbed() {
  return (
    <div className="glass mx-auto max-w-5xl rounded-[2rem] p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black">Prendre rendez-vous</h2>
        <p className="mt-3 text-slate-300">
          Sélectionne un créneau disponible pour ton cours en ligne.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white">
        <iframe
          src="https://calendly.com/dojomath"
          title="Réservation DojoMath"
          className="h-[760px] w-full"
        />
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Remplace cette URL par ton vrai lien Calendly ou Cal.com.
      </p>
    </div>
  );
}