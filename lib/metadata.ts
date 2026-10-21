import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const brandedTitle = `${title} | ${siteConfig.name}`;
  return {
    title: { absolute: brandedTitle },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: brandedTitle,
      description,
      url: absoluteUrl(path),
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}
