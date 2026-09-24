"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useEngineEffect } from "@/components/motion/engine";
import { EASE } from "@/lib/motion/constants";
import { doiraStaggerFn } from "@/lib/motion/doira";
import { belowViewport } from "@/lib/motion/viewport";
import { useMotionAllowed } from "./use-motion-allowed";

export interface XivaTimelineSceneProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Kompyuter: sahna CSS sticky (JS pin yoʻq), ustunlar 150 % balandlik davomida skrub bilan
 * koʻtariladi — oddiy skroll doim ishlaydi. Mobil: har ustun koʻrinishga kirganda bir marta.
 */
export function XivaTimelineScene({ children, className }: XivaTimelineSceneProps) {
  const scope = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();

  useEngineEffect(
    scope,
    ({ gsap }, { late }) => {
      if (!allowed || !scope.current) return;
      const stage = scope.current.querySelector(".xiva-stage");
      const items = scope.current.querySelectorAll(".xiva-item");
      if (!stage || items.length === 0) return;
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          items,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            stagger: { each: 0.5 / items.length },
            scrollTrigger: { trigger: stage, start: "top 60%", end: "bottom bottom", scrub: 0.8 },
          },
        );
      });
      media.add("(max-width: 1023px)", () => {
        items.forEach((item, index) => {
          if (late && !belowViewport(item, 0.88)) return;
          gsap.fromTo(
            item,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: EASE.out,
              delay: doiraStaggerFn()(index % 3),
              scrollTrigger: { trigger: item, start: "top 88%", once: true },
            },
          );
        });
      });
    },
    [allowed],
  );

  return (
    <div ref={scope} className={cn("contents", className)}>
      {children}
    </div>
  );
}
