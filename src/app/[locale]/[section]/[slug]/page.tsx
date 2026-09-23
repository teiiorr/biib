import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticlePage } from "@/components/sections/news/NewsArticlePage";
import { getArticle, t } from "@/content";
import { getDictionary } from "@/i18n/dictionaries";
import { LOCALES, type Locale } from "@/i18n/locales";
import { NEWS_SLUGS, isNewsSlug, resolveSection, sectionSegment } from "@/i18n/routes";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

/** Faqat yangiliklar: 5 slug × 5 til = 25 sahifa. */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    NEWS_SLUGS.map((slug) => ({ locale, section: sectionSegment(locale, "news"), slug })),
  );
}

interface PageProps {
  readonly params: Promise<{ locale: Locale; section: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, section, slug } = await params;
  if (resolveSection(locale, section) !== "news" || !isNewsSlug(slug)) return {};
  const article = getArticle(slug);
  return buildMetadata({
    locale,
    key: "newsItem",
    slug,
    dict: getDictionary(locale),
    title: t(article.title, locale),
    description: t(article.lead, locale),
    status: article.status,
    ...(article.status === "confirmed" ? { article: { publishedTime: article.date } } : {}),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, section, slug } = await params;
  if (resolveSection(locale, section) !== "news" || !isNewsSlug(slug)) notFound();
  return <NewsArticlePage locale={locale} dict={getDictionary(locale)} slug={slug} />;
}
