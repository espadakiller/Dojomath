const stats = [
  { value: "100%", label: "cours en ligne" },
  { value: "3", label: "formules disponibles" },
  { value: "1h", label: "séance standard" },
  { value: "24/7", label: "réservation en ligne" },
];

export default function StatsStrip() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-8 shadow-lg shadow-[#6f1022]/5 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center">
          <p
            className={`text-5xl font-semibold tracking-[-0.05em] ${
              index === 3 ? "text-[#b88a3b]" : "text-[#6f1022]"
            }`}
          >
            {stat.value}
          </p>
          <p className="mt-3 text-sm font-medium text-[#645c58]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
