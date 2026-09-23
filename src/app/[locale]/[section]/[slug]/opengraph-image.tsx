import { ImageResponse } from "next/og";

import { getArticle, t } from "@/content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/locales";
import { isNewsSlug } from "@/i18n/routes";
import { OgImage, OG_SIZE, ogAlt } from "@/lib/seo/OgImage";
import { loadOgFonts } from "@/lib/seo/og-fonts";

export const size = OG_SIZE;
export const contentType = "image/png";
const SITE_ALT = "Bolalar Ijodkorligi Ijodiy Birlashmasi";

interface ImageProps {
  readonly params: Promise<{ locale: Locale; section: string; slug: string }>;
}

function titleFor(locale: Locale, slug: string): string {
  const dict = getDictionary(locale);
  return isNewsSlug(slug) ? t(getArticle(slug).title, locale) : dict.meta.news.title;
}

/* Sahifa maʼlumoti yigʻilayotganda params boʻsh kelishi mumkin: shunda umumiy alt. */
export async function generateImageMetadata({ params }: ImageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return [{ id: "og", alt: SITE_ALT, size, contentType }];
  const dict = getDictionary(locale);
  return [
    { id: "og", alt: ogAlt(dict.meta.news.title, titleFor(locale, slug)), size, contentType },
  ];
}

export default async function Image({ params }: ImageProps) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  return new ImageResponse(
    <OgImage locale={locale} title={titleFor(locale, slug)} topic={dict.meta.news.title} />,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  );
}
