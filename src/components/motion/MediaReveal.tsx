"use client";

import { withEngine } from "./with-engine";

export interface MediaRevealProps {
  /** Kirish: abr (kartalar, olti pogʻona) yoki smooth (bosh media, portretlar); none — kirishsiz. */
  readonly mode?: "abr" | "smooth" | "none";
  /** Guruhdagi oʻrni: doira ritmidagi kechikish. */
  readonly index?: number;
  /** Boʻlimning bosh mediasi: parallaks (boʻlimda bittadan ortiq emas). */
  readonly parallax?: boolean;
}

/** media-reveal va media-parallax bargi: kodi dvigatel bilan birga keladi (birinchi yuklamada yoʻq). */
export const MediaReveal = withEngine<MediaRevealProps>(() =>
  import("./MediaRevealLeaf").then((mod) => ({ default: mod.MediaRevealLeaf })),
);
