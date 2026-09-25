"use client";

import { useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useEngineEffect } from "@/components/motion/engine";
import { EASE } from "@/lib/motion/constants";
import { belowViewport } from "@/lib/motion/viewport";
import { useMotionAllowed } from "./use-motion-allowed";

export interface PalakBloomProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Gullash (§14.3 «bloom»): 0.92 → 1 masshtab, zanjir halqalari navbat bilan chiziladi,
 * nuqtali halqa oxirida paydo boʻladi. Nuqtali yoʻl DrawSVG bilan chizilmaydi: chok naqshi buziladi.
 */
export function PalakBloom({ children, className }: PalakBloomProps) {
  const scope = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();

  useEngineEffect(
    scope,
    ({ gsap }, { late }) => {
      if (!allowed || !scope.current) return;
      const svg = scope.current.querySelector("svg");
      const loops = scope.current.querySelectorAll(".palak-loop");
      const ring = scope.current.querySelector(".palak-ring");
      if (!svg) return;
      if (late && !belowViewport(svg)) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 85%", once: true },
      });
      timeline.fromTo(
        svg,
        { scale: 0.92, opacity: 0, transformOrigin: "50% 50%" },
        { scale: 1, opacity: 1, duration: 1.4, ease: EASE.out },
        0,
      );
      if (loops.length > 0) {
        timeline.fromTo(
          loops,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.4, ease: EASE.out, stagger: { each: 0.9 / loops.length } },
          0.1,
        );
      }
      if (ring) timeline.fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.8);
    },
    [allowed],
  );

  return (
    <div ref={scope} className={cx("contents", className)}>
      {children}
    </div>
  );
}
