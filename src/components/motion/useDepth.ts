"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, type RefObject } from "react";
import { registerAmbient } from "@/lib/motion/ambient-governor";
import { DEPTH_RANGE } from "@/lib/motion/constants";
import { motionAllowed } from "@/lib/motion/prefs";
import { gsap, ScrollTrigger } from "./gsap";
import { useMotionPrefs } from "./motion-context";

export interface DepthOptions {
  /** Qatlam toʻliq yoʻli, px; sukut 120. */
  readonly range?: number;
}

/**
 * depth: ganch/qogʻoz parallaks. Skope ichidagi [data-depth-layer] elementlari tartib boʻyicha
 * factors[i] tezlikda yuradi (0 = qimirlamaydi, 1 = toʻliq range). Skroll sahna sifatida roʻyxatga olinadi.
 */
export function useDepth(
  ref: RefObject<HTMLElement | null>,
  factors: readonly number[],
  options: DepthOptions = {},
): void {
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const range = options.range ?? DEPTH_RANGE;
  const key = factors.join(",");

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !allowed || factors.length === 0) return;
      const layers = root.querySelectorAll<HTMLElement>("[data-depth-layer]");
      const triggers: ScrollTrigger[] = [];
      layers.forEach((layer, i) => {
        const factor = factors[Math.min(i, factors.length - 1)] ?? 0;
        if (factor === 0) return;
        const tween = gsap.fromTo(
          layer,
          { y: factor * range },
          {
            y: -factor * range,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
      root.dataset.depthTriggers = String(triggers.length);
    },
    { scope: ref, dependencies: [allowed, range, key], revertOnUpdate: true },
  );

  useEffect(() => {
    const root = ref.current;
    if (!root || !allowed) return;
    const own = () => ScrollTrigger.getAll().filter((t) => t.trigger === root && t.vars.scrub);
    return registerAmbient(root, "scene", {
      pause: () => own().forEach((t) => t.disable(false)),
      resume: () => own().forEach((t) => t.enable()),
    });
  }, [ref, allowed]);
}
