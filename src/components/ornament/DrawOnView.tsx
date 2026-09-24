"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useEngineEffect } from "@/components/motion/engine";
import { EASE } from "@/lib/motion/constants";
import { doiraStaggerFn } from "@/lib/motion/doira";
import { belowViewport } from "@/lib/motion/viewport";
import { useMotionAllowed } from "./use-motion-allowed";

export type DrawMode = "enter" | "scrub";

export interface DrawOnViewProps {
  readonly children: ReactNode;
  /** enter: koʻrinishga kirganda bir marta chiziladi; scrub: skroll bilan birga. */
  readonly mode?: DrawMode;
  readonly duration?: number;
  /** Palak gullashi: chizish bilan birga 0.92 → 1 masshtab. */
  readonly bloom?: boolean;
  readonly className?: string;
}

const DRAWABLE = "path, circle, ellipse, line, polyline, polygon";

/**
 * Qamrovdagi barcha SVG chiziqlarini DrawSVG bilan chizadi. Harakat taqiqlangan boʻlsa
 * hech narsa qilmaydi: naqsh SSR dan toʻliq chizilgan keladi.
 */
export function DrawOnView({
  children,
  mode = "enter",
  duration = 1.6,
  bloom = false,
  className,
}: DrawOnViewProps) {
  const scope = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();

  useEngineEffect(
    scope,
    ({ gsap }, { late }) => {
      if (!allowed || !scope.current) return;
      // Oʻram display: contents, oʻlchami yoʻq: trigger va gullash nishoni birinchi bola.
      const box = scope.current.firstElementChild ?? scope.current;
      const targets = scope.current.querySelectorAll(DRAWABLE);
      if (targets.length === 0) return;
      const unit = Math.min(0.09, 1.2 / targets.length);
      if (mode === "scrub") {
        gsap.fromTo(
          targets,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            stagger: { each: unit / 3 },
            scrollTrigger: {
              trigger: box,
              start: "top 92%",
              end: "bottom 55%",
              scrub: 0.8,
            },
          },
        );
        return;
      }
      // Kech kelgan dvigatel: ekrandagi naqsh chizilgan holda qoladi.
      if (late && !belowViewport(box)) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: box, start: "top 85%", once: true },
      });
      timeline.fromTo(
        targets,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration, ease: EASE.out, stagger: doiraStaggerFn(unit) },
        0,
      );
      if (bloom) {
        timeline.fromTo(
          box,
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: EASE.out, transformOrigin: "50% 50%" },
          0,
        );
      }
    },
    [allowed, mode, duration, bloom],
  );

  return (
    <div ref={scope} className={cn("contents", className)}>
      {children}
    </div>
  );
}
