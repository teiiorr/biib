import type { MetadataRoute } from "next";
import { NEWS } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { StaticPathname } from "@/i18n/routing";
import { SITE_URL as SITE } from "@/lib/site";

const STATIC: readonly { href: StaticPathname; priority: number }[] = [
  { href: "/", priority: 1 },
  { href: "/about", priority: 0.8 },
  { href: "/projects", priority: 0.9 },
  { href: "/news", priority: 0.8 },
  { href: "/council", priority: 0.6 },
  { href: "/leadership", priority: 0.6 },
  { href: "/partners", priority: 0.5 },
  { href: "/contacts", priority: 0.7 },
];

/** Har bir sahifa beş tilda; alternates tillar orasidagi bağlanişni beradi. */
function entry(href: StaticPathname, priority: number, lastModified?: string): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${SITE}${getPathname({ locale, href })}`,
    lastModified,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((other) => [other, `${SITE}${getPathname({ locale: other, href })}`]),
      ),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = STATIC.flatMap(({ href, priority }) => entry(href, priority));

  const articles = NEWS.flatMap((item) =>
    routing.locales.map((locale) => ({
      url: `${SITE}${getPathname({ locale, href: { pathname: "/news/[slug]" as const, params: { slug: item.slug } } })}`,
      lastModified: item.date,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((other) => [
            other,
            `${SITE}${getPathname({ locale: other, href: { pathname: "/news/[slug]" as const, params: { slug: item.slug } } })}`,
          ]),
        ),
      },
    })),
  );

  return [...pages, ...articles];
}
