import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { absoluteUrl } from "@/lib/site";

export default function Breadcrumbs({ items }: { items: Array<{ label: string; href: string }> }) {
  const trail = [{ label: "Accueil", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.label, item: absoluteUrl(item.href),
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Fil d’Ariane" className="mb-8 text-sm text-[#645c58]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {trail.map((item, index) => (
            <li key={item.href} className="flex min-w-0 items-center gap-2">
              {index > 0 && <ChevronRight size={14} aria-hidden="true" className="shrink-0" />}
              {index === trail.length - 1 ? <span aria-current="page">{item.label}</span> : <Link className="underline underline-offset-4 hover:text-[#6f1022]" href={item.href}>{item.label}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
