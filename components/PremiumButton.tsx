import type { ReactNode } from "react";

type PremiumButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export default function PremiumButton({
  children,
  href,
  variant = "primary",
}: PremiumButtonProps) {
  const className =
    variant === "secondary"
      ? "inline-block rounded-full border border-[#b88a3b]/40 bg-[#fffaf3] px-8 py-4 font-semibold text-[#6f1022] transition hover:scale-105 hover:border-[#b88a3b] hover:text-[#6f1022]"
      : "inline-block rounded-full bg-[#6f1022] px-8 py-4 font-semibold text-[#fffaf3] transition hover:scale-105 hover:bg-[#6f1022]";

  return (
    <a
      href={href}
      className={className}
    >
      {children}
    </a>
  );
}
