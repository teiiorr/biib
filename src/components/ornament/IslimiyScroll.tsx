"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { setupGsap } from "@/components/motion/gsap";
import { useMotionAllowed } from "./use-motion-allowed";

export interface IslimiyScrollProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Islimiy skroll bilan oʻsadi: har poya oʻz `data-at` nuqtasida chizila boshlaydi,
 * kurtaklar poya yetib kelganda ochiladi. scrub 0.8, oddiy skroll doim ishlaydi.
 */
export function IslimiyScroll({ children, className }: IslimiyScrollProps) {
  const scope = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();

  useGSAP(
    () => {
      if (!allowed || !scope.current) return;
      const gsap = setupGsap();
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scope.current.firstElementChild ?? scope.current,
          start: "top 85%",
          end: "bottom 25%",
          scrub: 0.8,
        },
      });
      scope.current.querySelectorAll<SVGPathElement>(".islimiy-stem").forEach((stem) => {
        const at = Number(stem.dataset.at ?? 0);
        const span = Number(stem.dataset.span ?? 1);
        timeline.fromTo(stem, { drawSVG: "0%" }, { drawSVG: "100%", duration: span }, at);
      });
      scope.current.querySelectorAll<SVGPathElement>(".islimiy-bud").forEach((bud) => {
        const at = Number(bud.dataset.at ?? 0);
        timeline.from(bud, { scale: 0, duration: 0.08 }, at);
      });
    },
    { scope, dependencies: [allowed], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className={cn("contents", className)}>
      {children}
    </div>
  );
}
