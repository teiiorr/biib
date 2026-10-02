"use client";

import { withEngine } from "@/components/motion/with-engine";

/** Kodi animatsiya dvigateli bilan birga keladi, birinchi yuklanishda yoʻq. */
export const FooterArrive = withEngine<object>(() =>
  import("./FooterArriveLeaf").then((mod) => ({ default: mod.FooterArriveLeaf })),
);
