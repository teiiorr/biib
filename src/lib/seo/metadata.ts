import type { Metadata } from "next";
import type { ContentStatus } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { LOCALE_META, type Locale } from "@/i18n/locales";
import { hreflangFor, pathFor, type PageKey } from "@/i18n/routes";
import { fill } from "@/i18n/format";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

const OG_LOCALE: Record<Locale, string> = {
  uz: "uz_UZ",
  oz: "uz_UZ",
  ozbekca: "uz_UZ",
  ru: "ru_RU",
  en: "en_GB",
};

/** Soʻz chegarasida qisqartiradi, oxiriga haqiqiy koʻp nuqta qoʻyadi. */
export function clampText(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > max * 0.6 ? space : cut.length).trimEnd()}…`;
}

export function assertMetaLengths(title: string, description: string): void {
  if (title.length > TITLE_MAX) throw new Error(`Sarlavha ${TITLE_MAX} belgidan uzun: ${title}`);
  if (description.length > DESCRIPTION_MAX) {
    throw new Error(`Tavsif ${DESCRIPTION_MAX} belgidan uzun: ${description}`);
  }
}

/**
 * Nomaʼlum yoʻl (404): indekslanmaydi. Tana mijozda chiziladi — Next dinamik notFound() da serverda
 * faqat xato qobigʻini beradi (Fizz da xato chegaralari ishlamaydi, Suspense bilan esa holat 200 boʻlardi).
 */
export function notFoundMetadata(): Metadata {
  return { robots: { index: false, follow: false } };
}

export interface BuildMetadataInput {
  readonly locale: Locale;
  readonly key: PageKey;
  readonly slug?: string;
  readonly dict: Dictionary;
  /** Berilmasa dict.meta[key] dan olinadi. */
  readonly title?: string;
  readonly description?: string;
  readonly status: ContentStatus;
  readonly article?: { readonly publishedTime?: string; readonly modifiedTime?: string };
}

type MetaPageKey = Exclude<PageKey, "newsItem">;

export function pageTitle(dict: Dictionary, key: PageKey, title?: string): string {
  if (key === "home") return dict.meta.home.title;
  const base = title ?? dict.meta[key as MetaPageKey].title;
  return clampText(fill(dict.meta.titleTemplate, { title: base }), TITLE_MAX);
}

export function pageDescription(dict: Dictionary, key: PageKey, description?: string): string {
  const base =
    description ??
    (key === "newsItem" ? dict.meta.news.description : dict.meta[key as MetaPageKey].description);
  return clampText(base, DESCRIPTION_MAX);
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const { locale, key, slug, dict, status } = input;
  const title = pageTitle(dict, key, input.title);
  const description = pageDescription(dict, key, input.description);
  assertMetaLengths(title, description);
  const path = pathFor(locale, key, slug);
  const canonical = absoluteUrl(path);
  const meta = LOCALE_META[locale];

  /* 2026 imlosi klasterga kirmaydi: faqat oʻziga canonical (6.5). */
  const languages = meta.hreflang
    ? Object.fromEntries(
        Object.entries(hreflangFor(key, slug)).map(([tag, p]) => [tag, absoluteUrl(p)]),
      )
    : undefined;

  const indexable = status === "confirmed";

  return {
    metadataBase: new URL(siteUrl()),
    title: { absolute: title },
    description,
    alternates: languages ? { canonical, languages } : { canonical },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: key === "newsItem" ? "article" : "website",
      title,
      description,
      url: canonical,
      siteName: dict.meta.siteName,
      locale: OG_LOCALE[locale],
      ...(key === "newsItem" && input.article?.publishedTime
        ? { publishedTime: input.article.publishedTime }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
