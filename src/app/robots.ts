import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    /* Boshqaruv paneli qidiruv tizimlariga yopiq, uning sahifalarida noindex sarlavhasi ham bor. */
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
