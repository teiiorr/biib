"use client";

import type Lenis from "lenis";
import type * as LenisModule from "lenis";

import { refreshAfterFonts } from "@/lib/motion/refresh";

import { loadGsap, type GsapKit } from "./gsap";
import { setCurrentLenis } from "./lenis-context";

export interface MotionEngine extends GsapKit {
  /** Lenis GSAP tikerida (autoRaf: false); touch qurilmada va harakat taqiqida oʻchiq. */
  setSmoothScroll(enabled: boolean): void;
}

/**
 * Dvigatel alohida chunk: GSAP va plaginlar birinchi chizishdan keyin keladi, Lenis esa faqat
 * silliq skroll kerak boʻlganda (touch qurilma uni umuman yuklamaydi).
 * Shu modul faqat engine.ts dagi requestEngine orqali yuklanadi.
 */
export async function createEngine(): Promise<MotionEngine> {
  const kit = await loadGsap();
  const { gsap, ScrollTrigger } = kit;
  refreshAfterFonts();
  let lenis: Lenis | null = null;
  let tick: ((time: number) => void) | null = null;
  let off: (() => void) | null = null;
  let wanted = false;
  let lenisModule: Promise<typeof LenisModule> | null = null;

  const start = (LenisClass: typeof Lenis): void => {
    // Modul kelguncha sozlama oʻzgargan boʻlishi mumkin.
    if (!wanted || lenis) return;
    lenis = new LenisClass({ autoRaf: false, anchors: true });
    off = lenis.on("scroll", () => ScrollTrigger.update());
    tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setCurrentLenis(lenis);
  };

  const stop = (): void => {
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

  const setSmoothScroll = (enabled: boolean): void => {
    wanted = enabled;
    if (!enabled) {
      if (lenis) stop();
      return;
    }
    if (lenis) return;
    lenisModule ??= import("lenis");
    void lenisModule.then((mod) => start(mod.default));
  };

  return { ...kit, setSmoothScroll };
}
