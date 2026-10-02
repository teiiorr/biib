import type { Localized, UpopFrame, UpopMotion } from "@/content/types";

import { UPOP_COPY } from "../copy-upop";
import type { MediaItem } from "../news/types";
import { emptyLocalized } from "../text/locales";
import { optionalLocalized, type ErrorBag } from "./fields";
import type { GalleryMedia, GallerySlot, OrgSaveState, ShotAdmin } from "./types";

export const SLOT_COUNT = 8;

export const UPOP_FRAMES = [
  "stage",
  "gold",
  "glass",
  "ticket",
  "film",
  "mat",
] as const satisfies readonly UpopFrame[];
export const UPOP_MOTIONS = [
  "curtain",
  "slide-end",
  "wipe",
  "rise",
  "iris",
  "tilt",
  "slide-start",
  "zoom",
] as const satisfies readonly UpopMotion[];

/** Har bir joyning dizayndagi ramkasi va harakati: yangi kadr shulardan boshlanadi. */
export const SLOT_DEFAULTS: readonly { readonly frame: UpopFrame; readonly motion: UpopMotion }[] =
  [
    { frame: "stage", motion: "curtain" },
    { frame: "gold", motion: "slide-end" },
    { frame: "glass", motion: "wipe" },
    { frame: "ticket", motion: "rise" },
    { frame: "film", motion: "iris" },
    { frame: "mat", motion: "tilt" },
    { frame: "glass", motion: "slide-start" },
    { frame: "gold", motion: "zoom" },
  ];

export type GallerySlots = readonly (GallerySlot | null)[];

export type SaveGalleryState = OrgSaveState<readonly ShotAdmin[]>;

export function slotDefaults(index: number): { frame: UpopFrame; motion: UpopMotion } {
  return SLOT_DEFAULTS[index] ?? { frame: "glass", motion: "rise" };
}

export function newSlot(
  index: number,
  media: GalleryMedia,
  poster: GallerySlot["poster"],
): GallerySlot {
  return { media, poster, ...slotDefaults(index), alt: emptyLocalized() };
}

/** Saqlangan joylar 1…n: sayt ham ularni tartib raqami bilan (1-joy eng katta) chizadi. */
export function slotsFromShots(
  shots: readonly ShotAdmin[],
  resolve: (shot: ShotAdmin) => GallerySlot | null,
): GallerySlots {
  const slots: (GallerySlot | null)[] = Array.from({ length: SLOT_COUNT }, () => null);
  for (const shot of shots) {
    if (shot.position >= 1 && shot.position <= SLOT_COUNT) slots[shot.position - 1] = resolve(shot);
  }
  return slots;
}

export function galleryFromUpload(item: MediaItem): GalleryMedia {
  return {
    id: item.id,
    kind: "image",
    src: item.src,
    preview: item.image,
    previewSrc: item.src,
    posterId: null,
  };
}

/** Video qatoridagi poster muqova kadri sifatida (koʻrinish rasmi uning oʻzi). */
export function posterOf(media: GalleryMedia): MediaItem | null {
  if (media.kind !== "video" || !media.posterId) return null;
  return { id: media.posterId, src: media.previewSrc, image: media.preview };
}

/** Saqlangach tahrir ham saytdagi kabi: toʻla joylar ketma-ket, tavsif meʼyorlangan holida. */
export function compactSlots(slots: GallerySlots, saved: readonly ShotAdmin[]): GallerySlots {
  const filled = slots
    .filter((slot): slot is GallerySlot => slot !== null)
    .map((slot, i) => ({ ...slot, alt: saved[i]?.alt ?? emptyLocalized() }));
  return Array.from({ length: SLOT_COUNT }, (_, i) => filled[i] ?? null);
}

/** Galereyada boʻsh joy bormi (keyin toʻla joy turgan boʻlsa): sayt uni tashlab ketadi. */
export function hasGap(slots: GallerySlots): boolean {
  const last = slots.findLastIndex((slot) => slot !== null);
  return last > 0 && slots.slice(0, last).some((slot) => slot === null);
}

export function galleryErrorOrder(): readonly string[] {
  return Array.from({ length: SLOT_COUNT }, (_, i) => [
    `slot${i + 1}-poster`,
    `slot${i + 1}-alt`,
  ]).flat();
}

/** Serverga faqat id ketadi, tur esa bazadagi media qatoridan tekshiriladi. */
export interface SlotPayload {
  readonly mediaId: string;
  readonly kind: "image" | "video";
  readonly posterId: string | null;
  readonly frame: UpopFrame;
  readonly motion: UpopMotion;
  readonly alt: Localized;
}

export function slotPayload(slot: GallerySlot | null): SlotPayload | null {
  if (!slot) return null;
  return {
    mediaId: slot.media.id,
    kind: slot.media.kind,
    posterId: slot.media.kind === "video" ? (slot.poster?.id ?? null) : null,
    frame: slot.frame,
    motion: slot.motion,
    alt: slot.alt,
  };
}

export type ShotsBuild =
  | { readonly ok: true; readonly shots: readonly ShotAdmin[] }
  | { readonly ok: false; readonly errors: ErrorBag };

/** Toʻla joylar ketma-ket 1…n ga siqiladi: bazadagi tartib saytdagi koʻrinish bilan bir xil. */
export function buildShots(slots: readonly (SlotPayload | null)[]): ShotsBuild {
  const errors: ErrorBag = {};
  const shots: ShotAdmin[] = [];
  slots.slice(0, SLOT_COUNT).forEach((slot, index) => {
    if (!slot) return;
    const n = index + 1;
    if (slot.kind === "video" && !slot.posterId)
      errors[`slot${n}-poster`] = UPOP_COPY.gallery.posterMissing;
    shots.push({
      position: shots.length + 1,
      mediaId: slot.mediaId,
      posterId: slot.kind === "video" ? slot.posterId : null,
      frame: slot.frame,
      motion: slot.motion,
      alt: optionalLocalized(errors, `slot${n}-alt`, slot.alt),
    });
  });
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, shots };
}
