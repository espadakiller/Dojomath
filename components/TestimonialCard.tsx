type TestimonialCardProps = {
  name: string;
  level: string;
  text: string;
};

export default function TestimonialCard({
  name,
  level,
  text,
}: TestimonialCardProps) {
  return (
    <div className="glass rounded-3xl p-7 transition duration-300 hover:-translate-y-2 hover:border-sky-400/50">
      <p className="text-lg leading-8 text-slate-300">“{text}”</p>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400 font-black text-slate-950">
          {name.charAt(0)}
        </div>

        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-slate-400">{level}</p>
        </div>
      </div>
    </div>
  );
}