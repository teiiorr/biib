import type { ComponentType, ReactNode } from "react";

import type { ColorStory } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import type { Design } from "@/lib/appearance/types";

export type ArtSlot =
  | "home-hero"
  | "about-timeline"
  | "project-media"
  | "news-header"
  | "news-progress"
  | "people-heading"
  | "contacts-band"
  | "footer-crown"
  | "not-found"
  | "error";

/** Bir uyada bir necha qogʻoz obyekti boʻlsa (loyiha mediasi: afisha yoki parda), tanlov shu yerdan. */
export type ArtVariant = "poster" | "curtain";

/** Badiiy modullar lugʻatni oʻzi yuklamaydi (beshta til chunkka kirib qolmasin): matn serverdan keladi. */
export interface ArtCopy {
  readonly coloring?: Dictionary["home"]["coloring"];
  readonly galleryPending?: string;
  readonly noteHero?: string;
  /** Qahramon videosi: tavsif va 44 px boshqaruv yorliqlari. */
  readonly videoAlt?: string;
  readonly pauseLabel?: string;
  readonly playLabel?: string;
  readonly curtainLabel?: string;
  readonly ageSticker?: string;
  readonly pencilProgress?: string;
  readonly qalampirValue?: string;
  readonly canvas?: Dictionary["errors"]["canvas"];
  readonly paints?: readonly string[];
  readonly postcardLabel?: string;
  readonly masthead?: string;
}

export interface ArtProps {
  readonly locale: Locale;
  readonly copy?: ArtCopy;
  readonly className?: string;
  readonly story?: ColorStory;
  readonly variant?: ArtVariant;
  readonly progress?: number;
  readonly children?: ReactNode;
}

export type ArtLoader = () => Promise<{ default: ComponentType<ArtProps> }>;
export type ArtMap = Partial<Record<ArtSlot, ArtLoader>>;

const DESIGN_MODULES: Record<Design, () => Promise<{ art: ArtMap }>> = {
  atlas: () => import("./atlas"),
  birlashma: () => import("./birlashma"),
};

/** Faqat faol dizaynning badiiy moduli yuklanadi; ikkinchisi panel ochilganda oldindan olinadi. */
export function loadDesignArt(design: Design): Promise<ArtMap> {
  return DESIGN_MODULES[design]().then((m) => m.art);
}

export function prefetchDesign(design: Design): void {
  void DESIGN_MODULES[design]().catch(() => undefined);
}
