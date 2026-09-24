"use client";

import Lenis from "lenis";

import { refreshAfterFonts } from "@/lib/motion/refresh";

import { Flip, ScrollTrigger, SplitText, gsap, setupGsap } from "./gsap";
import { setCurrentLenis } from "./lenis-context";

export interface MotionEngine {
  readonly gsap: typeof gsap;
  readonly ScrollTrigger: typeof ScrollTrigger;
  readonly SplitText: typeof SplitText;
  readonly Flip: typeof Flip;
  /** Lenis GSAP tikerida (autoRaf: false); touch qurilmada va harakat taqiqida oʻchiq. */
  setSmoothScroll(enabled: boolean): void;
}

/**
 * Dvigatel alohida chunk: GSAP, plaginlar va Lenis birinchi chizishdan keyin boʻsh vaqtda keladi.
 * Shu modul faqat engine.ts dagi requestEngine orqali yuklanadi.
 */
export function createEngine(): MotionEngine {
  setupGsap();
  refreshAfterFonts();
  let lenis: Lenis | null = null;
  let tick: ((time: number) => void) | null = null;
  let off: (() => void) | null = null;

  const setSmoothScroll = (enabled: boolean): void => {
    if (enabled === (lenis !== null)) return;
    if (enabled) {
      lenis = new Lenis({ autoRaf: false, anchors: true });
      off = lenis.on("scroll", () => ScrollTrigger.update());
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setCurrentLenis(lenis);
      return;
    }
    off?.();
    if (tick) gsap.ticker.remove(tick);
    // GSAP ning sukut qiymatlari qaytariladi: Lenis boʻlmasa yumshatish yana foydali.
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
    lenis = null;
    tick = null;
    off = null;
    setCurrentLenis(null);
  };

  return { gsap, ScrollTrigger, SplitText, Flip, setSmoothScroll };
}
