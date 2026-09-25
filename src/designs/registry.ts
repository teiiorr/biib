import type { ComponentType } from "react";

export type ArtSlot = "home-hero" | "footer-crown";

/** Badiiy modullar lugʻatni oʻzi yuklamaydi (beshta til chunkka kirib qolmasin): matn serverdan keladi. */
export interface ArtCopy {
  /** Qahramon videosi: tavsif va 44 px boshqaruv yorliqlari. */
  readonly videoAlt?: string;
  readonly pauseLabel?: string;
  readonly playLabel?: string;
}

export interface ArtProps {
  readonly copy?: ArtCopy;
  readonly className?: string;
}

export type ArtLoader = () => Promise<{ default: ComponentType<ArtProps> }>;
export type ArtMap = Record<ArtSlot, ArtLoader>;

/** Badiiy qatlam birinchi yuklanish JS iga kirmaydi: har uya alohida chunk, kerak boʻlganda olinadi. */
export function loadArt(): Promise<ArtMap> {
  return import("./atlas").then((m) => m.art);
}
