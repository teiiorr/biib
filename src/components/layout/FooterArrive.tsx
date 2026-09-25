"use client";

import { withEngine } from "@/components/motion/with-engine";

/** footer-arrive bargi: kodi dvigatel bilan birga keladi (birinchi yuklamada yoʻq). */
export const FooterArrive = withEngine<object>(() =>
  import("./FooterArriveLeaf").then((mod) => ({ default: mod.FooterArriveLeaf })),
);
