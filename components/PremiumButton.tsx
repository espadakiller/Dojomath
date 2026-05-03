import Link from "next/link";

type PremiumButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function PremiumButton({
  href,
  children,
  variant = "primary",
}: PremiumButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-lg shadow-sky-400/20"
      : "border border-white/20 text-white hover:border-sky-400 hover:bg-white/5";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-7 py-4 font-bold transition duration-300 hover:-translate-y-1 hover:scale-105 ${styles}`}
    >
      {children}
    </Link>
  );
}