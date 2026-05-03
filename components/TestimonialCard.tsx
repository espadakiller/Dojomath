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
    <div className="group rounded-[2rem] border border-black/10 bg-white p-7 text-[#1d1d1f] shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-2 hover:border-[#6f1d1b]/30 hover:bg-[#6f1d1b] hover:text-white hover:shadow-xl hover:shadow-[#6f1d1b]/15">
      <p className="text-base leading-7 text-neutral-600 transition group-hover:text-white/75">
        “{text}”
      </p>

      <div className="mt-7 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1d1d1f] text-sm font-semibold text-white transition group-hover:bg-white group-hover:text-[#1d1d1f]">
          {name.charAt(0)}
        </div>

        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-neutral-500 transition group-hover:text-white/70">
            {level}
          </p>
        </div>
      </div>
    </div>
  );
}