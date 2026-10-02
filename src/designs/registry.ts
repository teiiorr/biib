import type { ComponentType } from "react";

export type ArtSlot = "home-hero";

/** Badiiy modullar lugʻatni oʻzi yuklamaydi, aks holda beshta til bitta boʻlakka kirib qoladi: matn serverdan keladi. */
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

/** Badiiy qatlam birinchi yuklanadigan skriptga kirmaydi: har uya alohida boʻlak, kerak paytda olinadi. */
export function loadArt(): Promise<ArtMap> {
  return import("./atlas").then((m) => m.art);
}
