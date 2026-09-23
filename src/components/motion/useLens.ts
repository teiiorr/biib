"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type RefObject } from "react";
import { DURATION } from "@/lib/motion/constants";
import { motionAllowed } from "@/lib/motion/prefs";
import { willChangeDuring } from "@/lib/motion/will-change";
import { EASE, Flip, gsap } from "./gsap";
import { useMotionPrefs } from "./motion-context";

export interface LensOptions {
  readonly axis?: "x" | "y" | "both";
  readonly duration?: number;
}

/**
 * lens: konteyner ichidagi [data-lens] element faol [data-lens-item] ustiga prujina bilan siljiydi.
 * Konteyner position: relative, linza position: absolute boʻlishi kerak. Oʻlcham bir marta yoziladi,
 * harakat Flip orqali faqat transformda.
 */
export function useLens(
  ref: RefObject<HTMLElement | null>,
  activeIndex: number,
  options: LensOptions = {},
): void {
  const prefs = useMotionPrefs();
  const animate = prefs.ready && motionAllowed(prefs);
  const axis = options.axis ?? "x";
  const duration = options.duration ?? DURATION.panel;
  const settled = useRef(false);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const lens = root.querySelector<HTMLElement>("[data-lens]");
      const items = root.querySelectorAll<HTMLElement>("[data-lens-item]");
      const target = items[activeIndex];
      if (!lens || !target) return;

      const rootRect = root.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      const place: gsap.TweenVars = {};
      if (axis !== "y") {
        place.left = rect.left - rootRect.left + root.scrollLeft;
        place.width = rect.width;
      }
      if (axis !== "x") {
        place.top = rect.top - rootRect.top + root.scrollTop;
        place.height = rect.height;
      }

      // Birinchi joylashuv va harakat taqiqi: animatsiyasiz.
      if (!animate || !settled.current) {
        gsap.set(lens, place);
        settled.current = true;
        return;
      }

      const state = Flip.getState(lens);
      gsap.set(lens, place);
      const tl = Flip.from(state, { duration, ease: EASE.spring, scale: true });
      willChangeDuring(tl, [lens]);
    },
    { scope: ref, dependencies: [activeIndex, animate, axis, duration] },
  );
}
