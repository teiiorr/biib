"use client";

import { useRef, type RefObject } from "react";

import { motionAllowed } from "@/lib/motion/prefs";
import { belowViewport } from "@/lib/motion/viewport";

import { useEngineEffect } from "./engine";
import { buildMediaReveal, mediaTargets } from "./media-motion";
import { useMotionPrefs } from "./motion-context";

export interface MediaRevealOptions {
  /** false: kirish yoʻq (masalan, umumiy element bilan kelgan maqola muqovasi). */
  readonly enabled?: boolean;
  /** abr: ikat iplari kabi chapdan oʻngga olti pogʻonada; smooth: yumshoq ochilish. */
  readonly mode?: "abr" | "smooth";
  readonly delay?: number;
  /** Kirish tugagandagi masshtab: parallaks bor boʻlsa uning asosi (1 + chuqurlik). */
  readonly restScale?: number;
}

/** Ramka kesilib ochiladi, ichki qatlam 1.12 → 1. Ekranda turgan media (kech dvigatel, sahifa oʻtishi) yashirilmaydi. */
export function useMediaReveal(
  ref: RefObject<HTMLElement | null>,
  { enabled = true, mode = "abr", delay = 0, restScale = 1 }: MediaRevealOptions = {},
): void {
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const done = useRef(false);

  useEngineEffect(
    ref,
    (engine) => {
      const box = ref.current;
      if (!box || !allowed || !enabled || done.current) return;
      if (!belowViewport(box, 1)) {
        done.current = true;
        return;
      }
      const targets = mediaTargets(box);
      if (!targets) return;
      return buildMediaReveal(engine, box, targets, {
        mode,
        delay,
        restScale,
        onDone: () => {
          done.current = true;
        },
      });
    },
    [allowed, enabled, mode, delay, restScale],
  );
}
