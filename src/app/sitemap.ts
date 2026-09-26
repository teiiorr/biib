import type { MetadataRoute } from "next";
import { getNews, getProjects } from "@/content";
import type { NewsArticle, Project } from "@/content/types";
import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";
import { allRoutes, pathFor, type PageKey } from "@/i18n/routes";
import { siteUrl } from "@/lib/site";

/* Yangi maqola sitemapga soat ichida (saqlashdan keyin esa darhol) tushadi; [locale] maketi bilan bir xil. */
export const revalidate = 3600;

/** Tasdiqlanmagan kontentli sahifalar lastModified daʼvo qilmaydi (18.1). */
function lastModifiedFor(
  key: PageKey,
  slug: string | undefined,
  news: readonly NewsArticle[],
  projects: readonly Project[],
): Date | undefined {
  if (key === "newsItem" && slug) {
    const article = news.find((n) => n.slug === slug);
    return article?.status === "confirmed" ? new Date(article.date) : undefined;
  }
  if (key === "news") {
    const confirmed = news.filter((n) => n.status === "confirmed");
    return confirmed.length ? new Date(confirmed[0]?.date ?? 0) : undefined;
  }
  if (key === "projects") {
    return projects.every((p) => p.status === "confirmed") ? new Date() : undefined;
  }
  return undefined;
}

/** Google talabi: alternates ichida sahifaning oʻzi ham boʻlishi kerak; ozbekca klasterga kirmaydi. */
function languagesFor(key: PageKey, slug?: string): Record<string, string> {
  const base = siteUrl();
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    const tag = LOCALE_META[locale].hreflang;
    if (tag) out[tag] = `${base}${pathFor(locale, key, slug)}`;
  }
  out["x-default"] = `${base}${pathFor("uz", key, slug)}`;
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [news, projects] = await Promise.all([getNews(), getProjects()]);
  return allRoutes(news.map((n) => n.slug)).map((route) => {
    const locale: Locale = route.locale;
    const lastModified = lastModifiedFor(route.key, route.slug, news, projects);
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${base}${route.path}`,
      changeFrequency: route.key === "news" || route.key === "home" ? "weekly" : "monthly",
      priority: route.key === "home" ? 1 : route.key === "newsItem" ? 0.6 : 0.8,
    };
    if (lastModified) entry.lastModified = lastModified;
    if (LOCALE_META[locale].hreflang) {
      entry.alternates = { languages: languagesFor(route.key, route.slug) };
    }
    return entry;
  });
}
