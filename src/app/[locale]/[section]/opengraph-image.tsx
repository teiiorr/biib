import { ImageResponse } from "next/og";

import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { resolveSection } from "@/i18n/routes";
import { OgImage, OG_SIZE, ogAlt } from "@/lib/seo/OgImage";
import { loadOgFonts } from "@/lib/seo/og-fonts";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  readonly params: Promise<{ locale: Locale; section: string }>;
}

function titleFor(locale: Locale, section: string): string {
  const dict = getDictionary(locale);
  const key = resolveSection(locale, section);
  return key ? dict.meta[key].title : dict.meta.notFound.title;
}

export async function generateImageMetadata({ params }: ImageProps) {
  const { locale, section } = await params;
  const dict = getDictionary(locale);
  return [
    { id: "og", alt: ogAlt(dict.meta.siteName, titleFor(locale, section)), size, contentType },
  ];
}

export default async function Image({ params }: ImageProps) {
  const { locale, section } = await params;
  const dict = getDictionary(locale);
  return new ImageResponse(
    <OgImage locale={locale} title={titleFor(locale, section)} kicker={dict.meta.siteName} />,
    { ...OG_SIZE, fonts: await loadOgFonts() },
  );
}
