"use client";

import { useEffect, useId, useLayoutEffect } from "react";
import type { RefObject } from "react";

import { requestEngine, useEngine } from "@/components/motion/engine";
import { EASE } from "@/lib/motion/constants";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const MORPH_SECONDS = 0.42;
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Oyna morfi: tugma panelga aylanadi, yopilganda panel tugmaga qaytadi.
 * Faqat transform animatsiya qilinadi (scale: true); dvigatel kelmagan yoki kamaytirilgan
 * harakatda CSS 150 ms fade ishlaydi.
 */
export function useMorph(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null> | undefined,
  panelRef: RefObject<HTMLElement | null>,
): void {
  const flipId = useId();
  const engine = useEngine();

  useIsoLayoutEffect(() => {
    if (!engine) {
      void requestEngine();
      return;
    }
    const trigger = triggerRef?.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    const { Flip } = engine;
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
  }, [open, engine, flipId, triggerRef, panelRef]);
}
