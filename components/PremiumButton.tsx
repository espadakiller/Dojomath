export default function PremiumButton({ children, href }: any) {
  return (
    <a
      href={href}
      className="inline-block rounded-full bg-white px-8 py-4 text-black font-semibold hover:scale-105 transition"
    >
      {children}
    </a>
  );
}