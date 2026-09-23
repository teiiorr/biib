"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, type RefObject } from "react";
import { registerAmbient } from "@/lib/motion/ambient-governor";
import { PIN_LENGTH, SCRUB } from "@/lib/motion/constants";
import { motionAllowed } from "@/lib/motion/prefs";
import { gsap, ScrollTrigger } from "./gsap";
import { useMotionPrefs } from "./motion-context";

export interface PortalSceneOptions {
  /** Sahna timeline ini quradi; faqat transform/opacity/clip-path/filter. */
  readonly build: (tl: gsap.core.Timeline, scope: HTMLElement) => void;
  /** Viewportga nisbatan uzunlik; chegara desktop 1.5, mobil 1 (oshirib boʻlmaydi). */
  readonly length?: number;
  readonly pin?: boolean;
  readonly onProgress?: (progress: number) => void;
}

export interface PortalScene {
  /** 0–1, har kadrda yangilanadi; render emas, ref orqali oʻqiladi. */
  readonly progress: RefObject<number>;
}

/**
 * portal: skrablangan, pinlangan qisqa sahna (scrub 0.8), oddiy skroll bilan oʻtkazib yuboriladi.
 * Harakat taqiqlanganda sahna yakuniy holatda statik turadi. Skope elementiga --scene-progress yoziladi.
 */
export function usePortalScene(
  ref: RefObject<HTMLElement | null>,
  options: PortalSceneOptions,
): PortalScene {
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const progress = useRef(0);
  const activeRef = useRef(true);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const maxLength = prefs.breakpoint === "expanded" ? PIN_LENGTH.expanded : PIN_LENGTH.compact;
  const length = Math.min(options.length ?? maxLength, maxLength);
  const pin = options.pin ?? true;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const tl = gsap.timeline({ paused: true });
      optionsRef.current.build(tl, root);

      if (!allowed) {
        tl.progress(1);
        progress.current = 1;
        root.style.setProperty("--scene-progress", "1");
        return;
      }

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * length)}`,
        pin,
        scrub: SCRUB,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          progress.current = self.progress;
          root.style.setProperty("--scene-progress", self.progress.toFixed(3));
          if (activeRef.current) optionsRef.current.onProgress?.(self.progress);
        },
      });
    },
    { scope: ref, dependencies: [allowed, length, pin], revertOnUpdate: true },
  );

  useEffect(() => {
    const root = ref.current;
    if (!root || !allowed) return;
    // Pinlangan sahnani oʻchirib boʻlmaydi (sakrash), shuning uchun pauza faqat callbacklarni toʻxtatadi.
    return registerAmbient(root, "scene", {
      pause: () => {
        activeRef.current = false;
      },
      resume: () => {
        activeRef.current = true;
      },
    });
  }, [ref, allowed]);

  return { progress };
}
