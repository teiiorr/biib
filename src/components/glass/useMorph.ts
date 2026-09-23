"use client";

import { useGSAP } from "@gsap/react";
import { useId } from "react";
import type { RefObject } from "react";

import { EASE, Flip, setupGsap } from "@/components/motion/gsap";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const MORPH_SECONDS = 0.42;

/**
 * Oyna morfi: tugma panelga aylanadi, yopilganda panel tugmaga qaytadi.
 * Faqat transform animatsiya qilinadi (scale: true); kamaytirilgan harakatda CSS 150 ms fade ishlaydi.
 */
export function useMorph(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null> | undefined,
  panelRef: RefObject<HTMLElement | null>,
): void {
  const flipId = useId();

  useGSAP(
    () => {
      const trigger = triggerRef?.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      setupGsap();
      trigger.setAttribute("data-flip-id", flipId);
      panel.setAttribute("data-flip-id", flipId);

      if (open) {
        const state = Flip.getState(trigger);
        Flip.from(state, {
          targets: panel,
          duration: MORPH_SECONDS,
          ease: EASE.spring,
          scale: true,
        });
        return;
      }
      Flip.fit(panel, trigger, {
        duration: MORPH_SECONDS * 0.7,
        ease: EASE.inOut,
        scale: true,
      });
    },
    { dependencies: [open] },
  );
}
