const stats = [
  { value: "100%", label: "cours en ligne" },
  { value: "4+", label: "formules disponibles" },
  { value: "1h", label: "séance standard" },
  { value: "24/7", label: "réservation en ligne" },
];

export default function StatsStrip() {
  return (
    <div className="glass mx-auto grid max-w-6xl gap-6 rounded-[2rem] p-6 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-4xl font-black text-sky-400">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}