const stats = [
  { value: "100%", label: "cours en ligne" },
  { value: "4+", label: "formules disponibles" },
  { value: "1h", label: "séance standard" },
  { value: "24/7", label: "réservation en ligne" },
];

export default function StatsStrip() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 rounded-[2rem] border border-black/10 bg-white p-8 shadow-lg shadow-black/5 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center">
          <p
            className={`text-5xl font-semibold tracking-[-0.05em] ${
              index === 3 ? "text-[#6f1d1b]" : "text-[#1d1d1f]"
            }`}
          >
            {stat.value}
          </p>
          <p className="mt-3 text-sm font-medium text-neutral-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}