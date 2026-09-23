import { ImageResponse } from "next/og";

import { getArticle, t } from "@/content";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { isNewsSlug } from "@/i18n/routes";
import { OgImage, OG_SIZE, ogAlt } from "@/lib/seo/OgImage";
import { loadOgFonts } from "@/lib/seo/og-fonts";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  readonly params: Promise<{ locale: Locale; section: string; slug: string }>;
}

function titleFor(locale: Locale, slug: string): string {
  const dict = getDictionary(locale);
  return isNewsSlug(slug) ? t(getArticle(slug).title, locale) : dict.meta.news.title;
}

export async function generateImageMetadata({ params }: ImageProps) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  return [
    { id: "og", alt: ogAlt(dict.meta.news.title, titleFor(locale, slug)), size, contentType },
  ];
}

export default async function Image({ params }: ImageProps) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  return new ImageResponse(
    <OgImage locale={locale} title={titleFor(locale, slug)} kicker={dict.meta.news.title} />,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  );
}
