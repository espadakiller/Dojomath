import { LucideIcon } from "lucide-react";

type CourseCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function CourseCard({
  icon: Icon,
  title,
  description,
}: CourseCardProps) {
  return (
    <div className="group rounded-[2rem] border border-black/10 bg-white p-8 text-[#1d1d1f] shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-2 hover:border-[#6f1d1b]/30 hover:bg-[#6f1d1b] hover:text-white hover:shadow-xl hover:shadow-[#6f1d1b]/15">
      <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white transition group-hover:bg-white group-hover:text-[#1d1d1f]">
        <Icon size={28} />
      </div>

      <h3 className="mb-4 text-3xl font-semibold tracking-[-0.04em]">
        {title}
      </h3>

      <p className="text-lg leading-8 text-neutral-600 transition group-hover:text-white/75">
        {description}
      </p>
    </div>
  );
}