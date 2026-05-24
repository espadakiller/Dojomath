import Link from "next/link";
import { LucideIcon } from "lucide-react";

type CourseCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
};

export default function CourseCard({
  icon: Icon,
  title,
  description,
  href,
}: CourseCardProps) {
  const content = (
    <div className="group rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-8 text-[#171313] shadow-lg shadow-[#6f1022]/5 transition duration-300 hover:-translate-y-2 hover:border-[#b88a3b]/70 hover:bg-[#6f1022] hover:text-[#fffaf3] hover:shadow-xl hover:shadow-[#6f1022]/18">
      <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6f1022] text-[#fffaf3] transition group-hover:bg-[#b88a3b] group-hover:text-[#171313]">
        <Icon size={28} />
      </div>

      <h3 className="mb-4 text-3xl font-semibold tracking-[-0.04em]">
        {title}
      </h3>

      <p className="text-lg leading-8 text-[#645c58] transition group-hover:text-[#fffaf3]/78">
        {description}
      </p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
