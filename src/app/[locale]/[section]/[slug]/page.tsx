import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { NewsArticlePage } from "@/components/sections/news/NewsArticlePage";
import { getArticle, getNews, getNewsRedirect, t } from "@/content";
import { getLiveDictionary } from "@/i18n/live-dictionary";
import { isLocale, LOCALES, type Locale } from "@/i18n/locales";
import { isNewsSlug, pathFor, resolveSection, sectionSegment } from "@/i18n/routes";
import { buildMetadata, notFoundMetadata } from "@/lib/seo/metadata";

/* Nomaʼlum segment lokal 404 ni koʻrsatishi uchun (G2): maqolalar statik, qolgani notFound(). */
export const dynamicParams = true;

/** Faqat yangiliklar: har maqola × 5 til; sluglar kontent nusxasidan. */
export async function generateStaticParams() {
  const news = await getNews();
  return LOCALES.flatMap((locale) =>
    news.map(({ slug }) => ({ locale, section: sectionSegment(locale, "news"), slug })),
  );
}

interface PageProps {
  readonly params: Promise<{ locale: Locale; section: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, section, slug } = await params;
  if (!isLocale(locale)) return notFoundMetadata();
  if (resolveSection(locale, section) !== "news" || !isNewsSlug(slug)) {
    return notFoundMetadata();
  }
  const article = await getArticle(slug);
  if (!article) return notFoundMetadata();
  return buildMetadata({
    locale,
    key: "newsItem",
    slug,
    dict: await getLiveDictionary(locale),
    title: t(article.title, locale),
    description: t(article.lead, locale),
    status: article.status,
    ...(article.status === "confirmed" ? { article: { publishedTime: article.date } } : {}),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, section, slug } = await params;
  if (!isLocale(locale)) notFound();
  /* Shakli notoʻgʻri slug kontentga murojaat qilmasdan 404 oladi. */
  if (resolveSection(locale, section) !== "news" || !isNewsSlug(slug)) notFound();
  const article = await getArticle(slug);
  if (!article) {
    /* Nomi oʻzgargan maqolaning tarqalgan eski havolasi doimiy yoʻnaltiriladi. */
    const target = await getNewsRedirect(slug);
    if (target) permanentRedirect(pathFor(locale, "newsItem", target));
    notFound();
  }
  return (
    <NewsArticlePage locale={locale} dict={await getLiveDictionary(locale)} article={article} />
  );
}
