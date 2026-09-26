import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    /* Boshqaruv paneli qidiruvga kirmaydi (u yerda noindex sarlavhasi ham bor). */
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
