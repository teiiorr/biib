"use client";

import { useEffect, useRef } from "react";

import { ScrollTrigger, gsap, setupGsap } from "@/components/motion/gsap";
import { getDictionary } from "@/i18n/dictionaries";

import type { ArtProps } from "../registry";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Qogʻozdan qirqilgan baxmal parda: skroll bilan ochiladi, pin ≤100% viewport, oddiy skroll ishlaydi.
 * Kamaytirilgan harakatda parda ochiq holda turadi.
 */
export default function Curtain({ locale, children, className }: ArtProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const label = getDictionary(locale).projects.curtainLabel;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const left = root.querySelector<HTMLElement>("[data-curtain='left']");
    const right = root.querySelector<HTMLElement>("[data-curtain='right']");
    if (!left || !right) return;
    const html = document.documentElement;
    if (window.matchMedia(REDUCED).matches || html.getAttribute("data-motion") === "off") {
      root.setAttribute("data-open", "true");
      return;
    }
    setupGsap();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        end: "top 20%",
        scrub: 0.8,
      },
    });
    tl.to(left, { xPercent: -88, ease: "none" }, 0).to(right, { xPercent: 88, ease: "none" }, 0);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={ref} className={className ? `curtain ${className}` : "curtain"}>
      <div className="curtain-stage">{children}</div>
      <span className="curtain-panel curtain-left" data-curtain="left" aria-hidden="true" />
      <span className="curtain-panel curtain-right" data-curtain="right" aria-hidden="true" />
      <span className="curtain-valance" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
