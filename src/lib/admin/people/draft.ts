import type { PersonKind } from "@/content/types";

import type { MediaItem } from "../news/types";
import { emptyLocalized } from "../text/locales";
import type { PersonAdmin, PersonDraft, PersonPayload } from "./types";

/** Yangi odam odatda haqiqiy maʼlumot bilan qoʻshiladi, shu sabab tasdiqlangan holatda boshlanadi. */
export function emptyPersonDraft(): PersonDraft {
  return {
    status: "confirmed",
    name: emptyLocalized(),
    role: emptyLocalized(),
    field: emptyLocalized(),
    bio: emptyLocalized(),
    email: "",
    photo: null,
  };
}

/* Bazada id bor-u media qatori topilmasa ham tahrir ochiladi: surat oʻrnida boʻsh ramka. */
export function mediaFor(
  id: string | null,
  media: ReadonlyMap<string, MediaItem>,
): MediaItem | null {
  if (!id) return null;
  return media.get(id) ?? { id, src: "", image: null };
}

/** Yangi yuklangan rasmlar tanlash roʻyxatining boshiga takrorlanmasdan qoʻshiladi. */
export function mergeMedia(
  added: readonly MediaItem[],
  list: readonly MediaItem[],
): readonly MediaItem[] {
  return [...added, ...list.filter((item) => !added.some((a) => a.id === item.id))];
}

export function personDraftFromAdmin(
  data: PersonAdmin,
  media: ReadonlyMap<string, MediaItem>,
): PersonDraft {
  return {
    status: data.status,
    name: data.name ?? emptyLocalized(),
    role: data.role,
    field: data.field ?? emptyLocalized(),
    bio: data.bio ?? emptyLocalized(),
    email: data.email ?? "",
    photo: mediaFor(data.photoId, media),
  };
}

export interface RecordMeta {
  readonly id: string | null;
  readonly expected: string | null;
}

export function personToPayload(
  draft: PersonDraft,
  kind: PersonKind,
  meta: RecordMeta,
): PersonPayload {
  const { photo, ...rest } = draft;
  return { ...rest, ...meta, kind, photoId: photo?.id ?? null };
}
