"use client";

import { useEffect, useState, type ReactNode } from "react";
import { setGlobalPause } from "@/lib/motion/ambient-governor";
import { MEDIA } from "@/lib/motion/constants";
import { INITIAL_PREFS, isMotionOff, type Breakpoint, type MotionPrefs } from "@/lib/motion/prefs";
import { refreshAfterFonts, scheduleScrollRefresh } from "@/lib/motion/refresh";
import { gsap, setupGsap } from "./gsap";
import { MotionContext } from "./motion-context";

interface MotionProviderProps {
  readonly children: ReactNode;
}

function readBreakpoint(c: Record<string, boolean>): Breakpoint {
  if (c.expanded) return "expanded";
  if (c.medium) return "medium";
  return "compact";
}

/**
 * Ildizda bir marta: GSAP sozlanadi, matchMedia kontekstlari (600/1024, reduced-motion, touch)
 * yaratiladi, Harakat tugmasi kuzatiladi. Boshlangʻich holat SSR bilan bir xil, brauzer effektda oʻqiladi.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const [prefs, setPrefs] = useState<MotionPrefs>(INITIAL_PREFS);

  useEffect(() => {
    setupGsap();
    refreshAfterFonts();

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduced: MEDIA.reduced,
        medium: MEDIA.medium,
        expanded: MEDIA.expanded,
        touch: MEDIA.touch,
      },
      (ctx) => {
        const c: Record<string, boolean> = ctx.conditions ?? {};
        setPrefs((prev) => ({
          ...prev,
          reduced: Boolean(c.reduced),
          isTouch: Boolean(c.touch),
          breakpoint: readBreakpoint(c),
          motionOff: isMotionOff(),
          ready: true,
        }));
        // Nuqta almashganda pin va start/end qiymatlari qayta hisoblanadi (bir kadr, sikl emas).
        scheduleScrollRefresh();
      },
    );

    const syncMotionOff = () => {
      const off = isMotionOff();
      setPrefs((prev) => (prev.motionOff === off ? prev : { ...prev, motionOff: off }));
      setGlobalPause("motion-off", off);
    };
    syncMotionOff();
    const observer = new MutationObserver(syncMotionOff);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    return () => {
      observer.disconnect();
      mm.revert();
    };
  }, []);

  return <MotionContext value={prefs}>{children}</MotionContext>;
}
