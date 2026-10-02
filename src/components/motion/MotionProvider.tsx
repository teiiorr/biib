"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { setGlobalPause } from "@/lib/motion/ambient-governor";
import { loadEngineWhen } from "@/lib/motion/engine-timing";
import { motionAllowed } from "@/lib/motion/prefs";
import {
  getMotionPrefs,
  getServerMotionPrefs,
  subscribeMotionPrefs,
} from "@/lib/motion/prefs-store";
import { scheduleScrollRefresh } from "@/lib/motion/refresh";
import { onQueueDrain } from "@/lib/motion/scheduler";

import { getEngine, requestEngine } from "./engine";
import { GoldShineGate } from "./GoldShineGate";
import { MotionContext } from "./motion-context";

interface MotionProviderProps {
  readonly children: ReactNode;
}

/**
 * Ildizda bir marta ishlaydi: sozlamalarni kuzatadi, harakatga ruxsat boʻlsa dvigatelni gidratsiyadan keyin
 * brauzer boʻshaganda yoki foydalanuvchi birinchi marta harakat qilganda yuklaydi. Kontent dvigatelsiz ham toʻliq koʻrinadi.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const prefs = useSyncExternalStore(subscribeMotionPrefs, getMotionPrefs, getServerMotionPrefs);

  // Kech qurilgan sahnalar navbati tugaganda joylashuv bir marta qayta oʻlchanadi.
  useEffect(() => onQueueDrain(scheduleScrollRefresh), []);

  // Magnit effekti faqat aniq koʻrsatkichda (sichqoncha): kodi alohida boʻlakda, telefon uni yuklamaydi.
  useEffect(() => {
    if (!prefs.ready || prefs.isTouch || !motionAllowed(prefs)) return;
    let cancelled = false;
    let unmount: (() => void) | null = null;
    void import("@/lib/motion/magnetic").then(({ mountMagnetic }) => {
      if (!cancelled) unmount = mountMagnetic();
    });
    return () => {
      cancelled = true;
      unmount?.();
    };
  }, [prefs]);

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
    const cancelLoad = loadEngineWhen(() => {
      void requestEngine().then((engine) => {
        if (!cancelled) engine.setSmoothScroll(smooth);
      });
    });
    return () => {
      cancelled = true;
      cancelLoad();
    };
  }, [prefs]);

  return (
    <MotionContext value={prefs}>
      <GoldShineGate />
      {children}
    </MotionContext>
  );
}
