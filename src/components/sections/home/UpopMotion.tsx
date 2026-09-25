"use client";

import { withEngine } from "@/components/motion/with-engine";

/** upop-scene bargi: sahna kodi dvigatel bilan birga keladi (birinchi yuklamada yoʻq). */
export const UpopMotion = withEngine<object>(() =>
  import("./UpopSceneLeaf").then((mod) => ({ default: mod.UpopSceneLeaf })),
);
