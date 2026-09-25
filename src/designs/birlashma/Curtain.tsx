"use client";

import { useRef } from "react";

import { useEngineEffect } from "@/components/motion/engine";
import { useMotionAllowed } from "@/components/ornament/use-motion-allowed";
import { belowViewport } from "@/lib/motion/viewport";

import type { ArtProps } from "../registry";

/**
 * Qogʻozdan qirqilgan baxmal parda: skroll bilan ochiladi, pin ≤100% viewport, oddiy skroll ishlaydi.
 * Kamaytirilgan harakatda va dvigatel kelguncha parda ochiq holda turadi.
 */
export default function Curtain({ copy, children, className }: ArtProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const allowed = useMotionAllowed();

  useEngineEffect(
    ref,
    ({ gsap, ScrollTrigger }, { late }) => {
      const root = ref.current;
      if (!root || !allowed) return;
      // Dvigatel kech keldi, parda ekranda ochiq turibdi: yarmigacha yopilib sakramaydi.
      if (late && !belowViewport(root, 1)) return;
      const left = root.querySelector<HTMLElement>("[data-curtain='left']");
      const right = root.querySelector<HTMLElement>("[data-curtain='right']");
      if (!left || !right) return;
      root.removeAttribute("data-open");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 80%", end: "top 20%", scrub: 0.8 },
      });
      tl.to(left, { xPercent: -88, ease: "none" }, 0).to(right, { xPercent: 88, ease: "none" }, 0);
      return () => {
        root.setAttribute("data-open", "true");
        ScrollTrigger.refresh();
      };
    },
    [allowed],
  );

  return (
    // data-media-owner: ichidagi media ramkasining harakati pardaniki (ikkinchi kirish yoʻq).
    <div
      ref={ref}
      className={className ? `curtain ${className}` : "curtain"}
      data-open="true"
      data-media-owner=""
    >
      <div className="curtain-stage">{children}</div>
      <span className="curtain-panel curtain-left" data-curtain="left" aria-hidden="true" />
      <span className="curtain-panel curtain-right" data-curtain="right" aria-hidden="true" />
      <span className="curtain-valance" aria-hidden="true" />
      <span className="sr-only">{copy?.curtainLabel}</span>
    </div>
  );
}
