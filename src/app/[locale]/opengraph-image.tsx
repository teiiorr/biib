import { ImageResponse } from "next/og";

import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { OgImage, OG_SIZE, ogAlt } from "@/lib/seo/OgImage";
import { loadOgFonts } from "@/lib/seo/og-fonts";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  readonly params: Promise<{ locale: Locale }>;
}

export async function generateImageMetadata({ params }: ImageProps) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return [{ id: "og", alt: ogAlt(dict.meta.siteName, dict.meta.home.title), size, contentType }];
}

export default async function Image({ params }: ImageProps) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return new ImageResponse(
    <OgImage locale={locale} title={dict.meta.home.title} kicker={dict.common.brand.tagline} />,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  );
}
