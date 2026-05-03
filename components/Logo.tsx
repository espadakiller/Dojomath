import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-[#1d1d1f] text-sm font-semibold text-white">
        ∑
      </div>

      <span className="text-xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
        DojoMath
      </span>
    </Link>
  );
}