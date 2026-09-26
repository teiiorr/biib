"use client";

import { useLayoutEffect, useRef } from "react";

import { useEngineEffect } from "@/components/motion/engine";
import { useMotionPrefs } from "@/components/motion/motion-context";
import { DURATION, EASE } from "@/lib/motion/constants";
import { doiraStaggerFn } from "@/lib/motion/doira";
import { motionAllowed } from "@/lib/motion/prefs";
import { belowViewport } from "@/lib/motion/viewport";
import { watchPending } from "@/lib/motion/watchdog";

/**
 * footer-arrive (motion-plan 3.17): toʻrt guruh 0.3 s dan doira ritmida koʻtariladi, pastki qator
 * (muallif ham) 1.1 s da oxirgi boʻlib keladi. Futer ekranda turgan boʻlsa (qisqa sahifa) hech narsa
 * yashirilmaydi.
 */
export function FooterArriveLeaf() {
  const anchor = useRef<HTMLSpanElement>(null);
  const footer = useRef<HTMLElement | null>(null);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const compact = prefs.breakpoint === "compact";

  useLayoutEffect(() => {
    footer.current = anchor.current?.closest<HTMLElement>(".site-footer") ?? null;
  }, []);

  useEngineEffect(
    footer,
    ({ gsap }) => {
      const root = footer.current;
      if (!root || !allowed) return;
      const groups = Array.from(root.querySelectorAll<HTMLElement>(".footer-group"));
      const bottom = root.querySelector<HTMLElement>(".footer-bottom");
      const first = groups[0];
      if (!first || !belowViewport(first, 1)) return;
      const targets = bottom ? [...groups, bottom] : groups;
      let timeline: gsap.core.Timeline | null = null;
      const watch = watchPending(root, targets, () => {
        timeline?.scrollTrigger?.kill(false, true);
        timeline?.play();
      });
      const rise = compact ? 16 : 24;
      timeline = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 85%", once: true, onEnter: watch.started },
      });
      timeline.from(
        groups,
        {
          autoAlpha: 0,
          y: rise,
          duration: DURATION.reveal,
          ease: EASE.out,
          stagger: doiraStaggerFn(),
          clearProps: "transform,opacity,visibility",
        },
        0.3,
      );
      if (bottom) {
        timeline.from(
          bottom,
          {
            autoAlpha: 0,
            y: 16,
            duration: DURATION.reveal,
            ease: EASE.out,
            clearProps: "transform,opacity,visibility",
          },
          1.1,
        );
      }
      return watch.dispose;
    },
    [allowed, compact],
  );

  return <span ref={anchor} hidden data-footer-arrive="" />;
}
