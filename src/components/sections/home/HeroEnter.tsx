"use client";

import { useLayoutEffect, useRef } from "react";

import { isNavEntry } from "@/lib/motion/transitions";

/**
 * Nomdagi har soʻzga umumiy oltin plitkadagi oʻrni: --title-w (nom kengligi) va --word-x (soʻzning
 * chap chekkasi). Shunda yaltirash tasmasi butun nom boʻylab bitta boʻlib oʻtadi (motion.css).
 */
function measureShine(title: HTMLElement): void {
  const box = title.getBoundingClientRect();
  if (box.width === 0) return;
  title.style.setProperty("--title-w", `${Math.round(box.width)}px`);
  for (const word of title.querySelectorAll<HTMLElement>(".hero-word-in")) {
    const x = word.getBoundingClientRect().left - box.left;
    word.style.setProperty("--word-x", `${Math.round(x)}px`);
  }
  title.setAttribute("data-shine", "");
}

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
    const title = hero.querySelector<HTMLElement>(".home-hero-title");
    /* Shrift va oʻlcham oʻzgarsa soʻzlar suriladi: oʻrinlar qayta oʻlchanadi. */
    const shine = title ? new ResizeObserver(() => measureShine(title)) : null;
    if (title) {
      measureShine(title);
      shine?.observe(title);
      void document.fonts.ready.then(() => measureShine(title));
    }
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
      shine?.disconnect();
      hero.removeAttribute("data-done");
      hero.removeAttribute("data-enter");
    };
  }, []);

  return <span ref={ref} hidden data-hero-enter="" />;
}
