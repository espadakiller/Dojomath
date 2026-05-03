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
    <div className="glass group rounded-3xl p-7 transition duration-300 hover:-translate-y-2 hover:border-sky-400/60">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400 text-slate-950 transition group-hover:rotate-6 group-hover:scale-110">
        <Icon />
      </div>

      <h3 className="mb-3 text-2xl font-black">{title}</h3>
      <p className="leading-7 text-slate-300">{description}</p>
    </div>
  );
}