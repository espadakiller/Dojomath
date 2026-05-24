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
    <div className="group rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 text-[#171313] shadow-lg shadow-[#6f1022]/5 transition duration-300 hover:-translate-y-2 hover:border-[#b88a3b]/70 hover:bg-[#6f1022] hover:text-[#fffaf3] hover:shadow-xl hover:shadow-[#6f1022]/18">
      <p className="text-base leading-7 text-[#645c58] transition group-hover:text-[#fffaf3]/78">
        “{text}”
      </p>

      <div className="mt-7 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6f1022] text-sm font-semibold text-[#fffaf3] transition group-hover:bg-[#b88a3b] group-hover:text-[#171313]">
          {name.charAt(0)}
        </div>

        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-[#645c58] transition group-hover:text-[#fffaf3]/70">
            {level}
          </p>
        </div>
      </div>
    </div>
  );
}
