import type { MetadataRoute } from "next";

import { publicPages, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-16");

  return publicPages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency:
      path === "" || path.startsWith("/ressources") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/reservation" ? 0.9 : 0.7,
  }));
}
