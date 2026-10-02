import { ImageResponse } from "next/og";

import type { Dictionary } from "@/i18n/dictionaries";
import { getLiveDictionary } from "@/i18n/live-dictionary";
import { isLocale, type Locale } from "@/i18n/locales";
import { resolveSection } from "@/i18n/routes";
import { OgImage, OG_SIZE, ogAlt } from "@/lib/seo/OgImage";
import { loadOgFonts } from "@/lib/seo/og-fonts";

export const size = OG_SIZE;
export const contentType = "image/png";
const SITE_ALT = "Bolalar Ijodkorligi Ijodiy Birlashmasi";

interface ImageProps {
  readonly params: Promise<{ locale: Locale; section: string }>;
}

function titleFor(dict: Dictionary, locale: Locale, section: string): string {
  const key = resolveSection(locale, section);
  return key ? dict.meta[key].title : dict.meta.notFound.title;
}

/* Sahifa maʼlumoti yigʻilayotganda params boʻsh kelishi mumkin, unda umumiy alt qaytadi. */
export async function generateImageMetadata({ params }: ImageProps) {
  const { locale, section } = await params;
  if (!isLocale(locale)) return [{ id: "og", alt: SITE_ALT, size, contentType }];
  const dict = await getLiveDictionary(locale);
  return [
    {
      id: "og",
      alt: ogAlt(dict.meta.siteName, titleFor(dict, locale, section)),
      size,
      contentType,
    },
  ];
}

export default async function Image({ params }: ImageProps) {
  const { locale, section } = await params;
  const dict = await getLiveDictionary(locale);
  return new ImageResponse(
    <OgImage locale={locale} title={titleFor(dict, locale, section)} topic={dict.meta.siteName} />,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  );
}
