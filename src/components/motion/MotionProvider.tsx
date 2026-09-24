"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { whenIdle } from "@/lib/idle";
import { setGlobalPause } from "@/lib/motion/ambient-governor";
import { motionAllowed } from "@/lib/motion/prefs";
import {
  getMotionPrefs,
  getServerMotionPrefs,
  subscribeMotionPrefs,
} from "@/lib/motion/prefs-store";
import { scheduleScrollRefresh } from "@/lib/motion/refresh";

import { getEngine, requestEngine } from "./engine";
import { MotionContext } from "./motion-context";

interface MotionProviderProps {
  readonly children: ReactNode;
}

/**
 * Ildizda bir marta: sozlamalar (600/1024, reduced-motion, touch, Harakat tugmasi) kuzatiladi,
 * harakat ruxsat etilsa dvigatel boʻsh vaqtda yuklanadi. Mazmun dvigatelsiz ham toʻliq koʻrinadi.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const prefs = useSyncExternalStore(subscribeMotionPrefs, getMotionPrefs, getServerMotionPrefs);

  useEffect(() => {
    if (!prefs.ready) return;
    setGlobalPause("motion-off", prefs.motionOff);
    const allowed = motionAllowed(prefs);
    const smooth = allowed && !prefs.isTouch;
    const present = getEngine();
    if (present) {
      present.setSmoothScroll(smooth);
      scheduleScrollRefresh();
      return;
    }
    if (!allowed) return;
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      void requestEngine().then((engine) => {
        if (cancelled) return;
        engine.setSmoothScroll(smooth);
        scheduleScrollRefresh();
      });
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [prefs]);

  return <MotionContext value={prefs}>{children}</MotionContext>;
}
