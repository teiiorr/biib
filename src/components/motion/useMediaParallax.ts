"use client";

import type { RefObject } from "react";

import { PARALLAX } from "@/lib/motion/constants";
import { motionAllowed } from "@/lib/motion/prefs";
import { belowViewport } from "@/lib/motion/viewport";

import { useEngineEffect } from "./engine";
import { buildParallax, mediaTargets } from "./media-motion";
import { useMotionPrefs } from "./motion-context";

/** Joriy breakpoint uchun parallaks chuqurligi (media balandligiga nisbatan). */
export function useParallaxDepth(): number {
  const prefs = useMotionPrefs();
  return prefs.breakpoint === "expanded" ? PARALLAX.expanded : PARALLAX.compact;
}

/**
 * media-parallax (motion-plan 3.7, 5.3): boʻlimning bosh mediasi. Dvigatel kech kelganda ekranda
 * turgan media sakramaydi: unda parallaks qurilmaydi (sahifa oʻtishidan keyin esa quriladi).
 */
export function useMediaParallax(
  ref: RefObject<HTMLElement | null>,
  depth: number,
  /** Barg dvigatel bilan kech yuklangan boʻlsa, «kech» belgisi tashqaridan keladi. */
  lateMount = false,
): void {
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);

  useEngineEffect(
    ref,
    (engine, { late }) => {
      const box = ref.current;
      if (!box || !allowed || depth <= 0) return;
      if ((late || lateMount) && !belowViewport(box, 1)) return;
      const targets = mediaTargets(box);
      if (!targets) return;
      return buildParallax(engine, box, targets.scale, depth);
    },
    [allowed, depth, lateMount],
    { scene: true },
  );
}
