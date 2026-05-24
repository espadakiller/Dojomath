import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 md:gap-2.5" aria-label="DojoMath">
      <Image
        src="/dojomath-logo-mark.png"
        alt=""
        width={152}
        height={132}
        priority
        className="logo-mark-spin h-12 w-auto object-contain md:h-[52px] lg:h-14"
      />
      <Image
        src="/dojomath-wordmark.png"
        alt="DojoMath"
        width={263}
        height={72}
        priority
        className="w-[108px] max-w-none object-contain md:w-[116px] lg:w-[132px]"
      />
    </Link>
  );
}
