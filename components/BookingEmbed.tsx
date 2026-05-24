export default function BookingEmbed() {
  return (
    <div className="glass mx-auto max-w-5xl rounded-[2rem] p-4 shadow-xl shadow-[#6f1022]/8 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#171313]">
          Prendre rendez-vous
        </h2>
        <p className="mt-3 text-[#645c58]">
          Sélectionne un créneau disponible pour ton cours en ligne.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#b88a3b]/25 bg-[#fffaf3] shadow-lg shadow-[#6f1022]/5">
        <iframe
          src="https://calendly.com/dojomath"
          title="Réservation DojoMath"
          className="h-[760px] w-full"
        />
      </div>
    </div>
  );
}
