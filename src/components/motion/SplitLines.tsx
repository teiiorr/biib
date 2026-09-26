"use client";

import { useRef, type ReactNode } from "react";
import { DURATION, EASE } from "@/lib/motion/constants";
import { doiraStaggerFn, doiraUnit } from "@/lib/motion/doira";
import { motionAllowed } from "@/lib/motion/prefs";
import { enqueueSliced, viewportPriority } from "@/lib/motion/scheduler";
import { belowViewport } from "@/lib/motion/viewport";
import { watchPending, type PendingWatch } from "@/lib/motion/watchdog";
import { useEngineEffect } from "./engine";
import { useMotionPrefs } from "./motion-context";

/** h1 ataylab yoʻq: LCP sarlavha hech qachon boʻlinmaydi. */
type SplitTag = "h2" | "h3" | "h4" | "p" | "blockquote" | "div" | "span";

export interface SplitLinesProps {
  readonly as?: SplitTag;
  readonly children: ReactNode;
  readonly className?: string;
  readonly id?: string;
  readonly start?: string;
  /** words: qisqa sarlavha (≤ 8 soʻz) soʻzma-soʻz; lines: paragraf va iqtibos qatorma-qator. */
  readonly mode?: "lines" | "words";
}

/**
 * split-lines v2: soʻzlar yoki qatorlar niqob ostidan koʻtariladi (1000 ms, doira ritmi, guruh
 * 1.2 s ichida). Matn serverda oddiy holda (SEO); shriftlar kelgach boʻlish navbat orqali kadrlarga
 * taqsimlanadi, kirish tugagach asl DOM qaytariladi (niqob diakritikani kesib qolmaydi).
 */
export function SplitLines({
  as = "h2",
  children,
  className,
  id,
  start = "top 85%",
  mode = as === "h2" || as === "h3" || as === "h4" ? "words" : "lines",
}: SplitLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);

  useEngineEffect(
    ref,
    ({ gsap, SplitText }, { context }) => {
      const el = ref.current;
      if (!el || !allowed || done.current) return;
      if (!belowViewport(el, 1)) {
        done.current = true;
        return;
      }
      const words = mode === "words";
      let cancelled = false;
      let cancelJob: (() => void) | null = null;
      let split: SplitText | null = null;
      let watch: PendingWatch | null = null;

      const build = (): void => {
        // Shriftlar kutilganda foydalanuvchi pastga tushgan boʻlishi mumkin: koʻringan matn yashirilmaydi.
        if (cancelled || !belowViewport(el, 1)) {
          done.current = true;
          return;
        }
        context.add(() => {
          split = SplitText.create(el, {
            type: words ? "words,lines" : "lines",
            mask: words ? "words" : "lines",
            autoSplit: true,
            aria: "auto",
            linesClass: "split-line",
            wordsClass: "split-word",
            onSplit: (self) => {
              const parts = words ? self.words : self.lines;
              watch?.dispose();
              let tween: gsap.core.Tween | null = null;
              watch = watchPending(el, [el], () => {
                tween?.scrollTrigger?.kill(false, true);
                tween?.play();
              });
              const pending = watch;
              tween = gsap.from(parts, {
                yPercent: 120,
                duration: DURATION.lines,
                ease: EASE.out,
                stagger: doiraStaggerFn(doiraUnit(parts.length, 1.2, words ? 0.045 : 0.09)),
                // Ikki yoʻnalish (egasining talabi): ekrandan chiqqanda soʻzlar niqob ortiga qaytadi,
                // pastdan ham, yuqoridan ham qaytganda qayta koʻtariladi. Boʻlinish saqlanadi.
                scrollTrigger: {
                  trigger: el,
                  start,
                  end: "bottom 8%",
                  toggleActions: "play reverse play reverse",
                  onEnter: pending.started,
                },
              });
              return tween;
            },
          });
        });
      };

      void document.fonts.ready.then(() => {
        if (cancelled) return;
        cancelJob = enqueueSliced(build, viewportPriority(el));
      });

      return () => {
        cancelled = true;
        cancelJob?.();
        watch?.dispose();
        split?.revert();
      };
    },
    [allowed, start, mode],
  );

  // Teg birligi uchun bitta intrinsik tur: barcha ruxsat etilgan teglar HTMLElement beradi.
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
