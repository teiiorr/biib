"use client";

import { useLayoutEffect, useRef } from "react";

import { isNavEntry } from "@/lib/motion/transitions";

/**
 * hero-enter yordamchisi: mijoz navigatsiyasida kirish oʻtkazib yuboriladi (sahifa oʻtishi yagona
 * kirish, bitta element bir marta kiradi), animatsiyalar tugagach data-done qatlamlarni boʻshatadi.
 */
export function HeroEnter() {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hero = ref.current?.closest<HTMLElement>("[data-hero]");
    if (!hero) return;
    if (isNavEntry()) hero.setAttribute("data-enter", "skip");
    let cancelled = false;
    const release = (): void => {
      if (!cancelled) hero.setAttribute("data-done", "");
    };
    const running = hero
      .getAnimations({ subtree: true })
      .filter((a) => a instanceof CSSAnimation && a.animationName.startsWith("hero-"));
    if (running.length === 0) release();
    else void Promise.all(running.map((a) => a.finished)).then(release, release);
    return () => {
      cancelled = true;
      hero.removeAttribute("data-done");
      hero.removeAttribute("data-enter");
    };
  }, []);

  return <span ref={ref} hidden data-hero-enter="" />;
}
