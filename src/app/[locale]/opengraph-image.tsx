import { ImageResponse } from "next/og";

import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/locales";
import { OgImage, OG_SIZE, ogAlt } from "@/lib/seo/OgImage";
import { loadOgFonts } from "@/lib/seo/og-fonts";

export const size = OG_SIZE;
export const contentType = "image/png";
const SITE_ALT = "Bolalar Ijodkorligi Ijodiy Birlashmasi";

interface ImageProps {
  readonly params: Promise<{ locale: Locale }>;
}

/* Sahifa maʼlumoti yigʻilayotganda params boʻsh kelishi mumkin: shunda umumiy alt. */
export async function generateImageMetadata({ params }: ImageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return [{ id: "og", alt: SITE_ALT, size, contentType }];
  const dict = getDictionary(locale);
  return [{ id: "og", alt: ogAlt(dict.meta.siteName, dict.meta.home.title), size, contentType }];
}

export default async function Image({ params }: ImageProps) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return new ImageResponse(
    <OgImage locale={locale} title={dict.meta.home.title} topic={dict.common.brand.tagline} />,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  );
}
