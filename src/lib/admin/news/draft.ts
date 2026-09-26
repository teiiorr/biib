import type { Localized } from "@/content/types";
import { LOCALES } from "@/i18n/locales";

import { emptyLocalized, fromParagraphs } from "../text/locales";
import type { MediaItem, NewsAdmin, NewsDraft, NewsPayload } from "./types";

function sameText(a: Localized, b: Localized): boolean {
  return LOCALES.every((locale) => a[locale] === b[locale]);
}

/** Yangi yangilik: bugungi sana, qoralama emas — egasi odatda darhol chop etadi. */
export function emptyDraft(today: string): NewsDraft {
  return {
    slug: "",
    slugMode: "auto",
    status: "confirmed",
    date: today,
    topic: emptyLocalized(),
    title: emptyLocalized(),
    lead: emptyLocalized(),
    body: emptyLocalized(),
    quote: emptyLocalized(),
    cover: null,
    coverAlt: emptyLocalized(),
    coverStatus: "confirmed",
    story: { primary: "art-1", secondary: "art-2" },
    photos: [],
  };
}

/* Bazada id bor-u media qatori topilmasa ham tahrir ochiladi: surat oʻrnida boʻsh ramka. */
function mediaFor(id: string, media: ReadonlyMap<string, MediaItem>): MediaItem {
  return media.get(id) ?? { id, src: "", image: null };
}

export function draftFromAdmin(data: NewsAdmin, media: ReadonlyMap<string, MediaItem>): NewsDraft {
  const body = { ...emptyLocalized() };
  for (const locale of LOCALES) body[locale] = fromParagraphs(data.body[locale]);
  return {
    slug: data.slug,
    slugMode: "manual",
    status: data.status,
    date: data.date,
    topic: data.topic,
    title: data.title,
    lead: data.lead,
    body,
    quote: data.quote ?? emptyLocalized(),
    cover: data.cover.mediaId ? mediaFor(data.cover.mediaId, media) : null,
    /* Tavsif sarlavhaning oʻzi boʻlsa (boʻsh qoldirilgan), maydon boʻsh koʻrinadi. */
    coverAlt: sameText(data.cover.alt, data.title) ? emptyLocalized() : data.cover.alt,
    coverStatus: data.cover.status,
    story: data.story,
    photos: data.photos.map((photo) => mediaFor(photo.mediaId, media)),
  };
}

export function draftToPayload(
  draft: NewsDraft,
  id: string | null,
  expected: string | null,
): NewsPayload {
  const { cover, photos, ...rest } = draft;
  return {
    ...rest,
    id,
    expected,
    coverId: cover?.id ?? null,
    photoIds: photos.map((photo) => photo.id),
  };
}

/** Saqlanmagan oʻzgarish bormi: tahrir holatining barqaror izi. */
export function draftKey(draft: NewsDraft): string {
  return JSON.stringify(draftToPayload(draft, null, null));
}
