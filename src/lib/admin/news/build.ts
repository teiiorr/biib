import type { Localized } from "@/content/types";
import { fill } from "@/i18n/format";
import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";
import { isNewsSlug } from "@/i18n/routes";

import { NEWS_COPY } from "../copy-news";
import { normalizeLocalized, toParagraphs } from "../text/locales";
import type { FieldErrors, NewsAdmin, NewsPayload } from "./types";

/* news_photos.position 1…40 (bazadagi tekshiruv). */
export const PHOTO_MAX = 40;
export const TITLE_MAX = 60;
export const LEAD_MAX = 155;

const E = NEWS_COPY.errors;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type BuildResult =
  | { readonly ok: true; readonly input: NewsAdmin }
  | { readonly ok: false; readonly errors: FieldErrors };

function filled(value: Localized): boolean {
  return LOCALES.some((locale) => value[locale].trim() !== "");
}

function requireAll(
  errors: Record<string, string>,
  path: string,
  value: Localized,
  locales: readonly Locale[] = LOCALES,
): void {
  for (const locale of locales) {
    if (!value[locale].trim())
      errors[`${path}.${locale}`] = fill(E.required, { lang: LOCALE_META[locale].nativeName });
  }
}

function validDate(value: string): boolean {
  return DATE_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/**
 * Tahrir holatidan bazaga yuboriladigan shakl: har til meʼyorlanadi, boʻsh kirill va 2026 qatori
 * oʻzbekchadan toʻldiriladi, keyin tekshiriladi. Brauzer ham, server amali ham shu funksiyani
 * chaqiradi: xato ikkalasida bir xil chiqadi.
 */
export function buildNews(payload: NewsPayload): BuildResult {
  const errors: Record<string, string> = {};
  const topic = normalizeLocalized(payload.topic);
  const title = normalizeLocalized(payload.title);
  const lead = normalizeLocalized(payload.lead);
  /* Bazada qisqa maydonlar har holatda besh tilda (l10n_text domeni). */
  requireAll(errors, "topic", topic);
  requireAll(errors, "title", title);
  requireAll(errors, "lead", lead);

  const bodyText = normalizeLocalized(payload.body);
  const body = {
    uz: toParagraphs(bodyText.uz),
    oz: toParagraphs(bodyText.oz),
    ozbekca: toParagraphs(bodyText.ozbekca),
    ru: toParagraphs(bodyText.ru),
    en: toParagraphs(bodyText.en),
  };
  /* Tasdiqlangan maqola besh tilda toʻliq; qoralamada faqat oʻzbekcha matn majburiy. */
  requireAll(errors, "body", bodyText, payload.status === "confirmed" ? LOCALES : ["uz"]);

  const quote = normalizeLocalized(payload.quote);
  if (filled(quote)) requireAll(errors, "quote", quote);

  const alt = normalizeLocalized(payload.coverAlt);
  if (filled(alt)) requireAll(errors, "coverAlt", alt);

  /* Havola sarlavhadan chiqadi: sarlavha boʻsh boʻlsa xato oʻsha yerda, havolada takrorlanmaydi. */
  if (!payload.slug) {
    if (title.uz) errors.slug = E.slugEmpty;
  } else if (!isNewsSlug(payload.slug)) errors.slug = E.slugShape;
  if (!validDate(payload.date)) errors.date = E.date;

  const photoIds = [...new Set(payload.photoIds)].filter((id) => id !== payload.coverId);
  if (photoIds.length > PHOTO_MAX) errors.photos = fill(E.photosMax, { max: PHOTO_MAX });

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    input: {
      ...(payload.id ? { id: payload.id } : {}),
      slug: payload.slug,
      status: payload.status,
      date: payload.date,
      topic,
      title,
      lead,
      body,
      quote: filled(quote) ? quote : null,
      cover: {
        mediaId: payload.coverId,
        alt: filled(alt) ? alt : title,
        status: payload.coverId ? payload.coverStatus : "pending",
      },
      story: payload.story,
      photos: photoIds.map((mediaId) => ({ mediaId })),
    },
  };
}
