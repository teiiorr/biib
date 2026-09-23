"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { motionAllowed } from "@/lib/motion/prefs";
import { gsap, ScrollTrigger } from "./gsap";
import { setCurrentLenis } from "./lenis-context";
import { useMotionPrefs } from "./motion-context";

interface LenisProviderProps {
  readonly children: ReactNode;
}

/**
 * Lenis GSAP tikerida yuradi (autoRaf: false). Touch qurilmada tabiiy inersiya yaxshiroq,
 * kamaytirilgan harakat va Harakat=off da esa silliq skroll umuman boʻlmaydi.
 * Instans lenis-context doʻkoniga yoziladi; useLenis() shu yerdan oʻqiydi.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const prefs = useMotionPrefs();
  const enabled = prefs.ready && !prefs.isTouch && motionAllowed(prefs);

  useEffect(() => {
    if (!enabled) return;
    const instance = new Lenis({ autoRaf: false, anchors: true });
    const off = instance.on("scroll", () => ScrollTrigger.update());
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setCurrentLenis(instance);

    return () => {
      off();
      gsap.ticker.remove(tick);
      // GSAP ning sukut qiymatlari qaytariladi: Lenis boʻlmasa yumshatish yana foydali.
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setCurrentLenis(null);
    };
  }, [enabled]);

  return children;
}
