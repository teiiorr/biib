"use client";

import { withEngine } from "@/components/motion/with-engine";

/** Sahna kodi harakat dvigateli bilan birga yuklanadi, birinchi yuklamaga kirmaydi. */
export const UpopMotion = withEngine<object>(() =>
  import("./UpopSceneLeaf").then((mod) => ({ default: mod.UpopSceneLeaf })),
);
