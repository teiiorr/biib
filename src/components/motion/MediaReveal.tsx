"use client";

import { withEngine } from "./with-engine";

export interface MediaRevealProps {
  /** abr: kartalar uchun olti pogʻona; smooth: bosh media va portretlar; none: kirishsiz. */
  readonly mode?: "abr" | "smooth" | "none";
  /** Guruhdagi oʻrni: doira ritmidagi kechikish shundan hisoblanadi. */
  readonly index?: number;
  /** Boʻlimning bosh mediasi parallaks oladi; bunday media boʻlimda bittadan oshmaydi. */
  readonly parallax?: boolean;
}

/** Barg kodi dvigatel bilan birga keladi, birinchi yuklamaga kirmaydi. */
export const MediaReveal = withEngine<MediaRevealProps>(() =>
  import("./MediaRevealLeaf").then((mod) => ({ default: mod.MediaRevealLeaf })),
);
