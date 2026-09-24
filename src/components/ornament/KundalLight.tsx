"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useEngineEffect } from "@/components/motion/engine";
import { useMotionAllowed } from "./use-motion-allowed";

export interface KundalLightProps {
  readonly children: ReactNode;
  readonly className?: string;
}

const W = 1200;
const H = 400;

/**
 * Yumshoq yurar yorugʻlik: kompyuterda kursor ortidan (fePointLight x/y — filtr atributi),
 * sensorli ekranda skroll bilan chapdan oʻngga. Harakat oʻchiq boʻlsa yorugʻlik qotib turadi.
 */
export function KundalLight({ children, className }: KundalLightProps) {
  const scope = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();

  useEngineEffect(
    scope,
    ({ gsap }) => {
      if (!allowed || !scope.current) return;
      const light = scope.current.querySelector(".kundal-light");
      const panel = scope.current.parentElement;
      if (!light || !panel) return;
      const media = gsap.matchMedia();
      media.add("(hover: hover) and (pointer: fine)", () => {
        const toX = gsap.quickTo(light, "attr:x", { duration: 0.8, ease: "power2.out" });
        const toY = gsap.quickTo(light, "attr:y", { duration: 0.8, ease: "power2.out" });
        const onMove = (event: PointerEvent): void => {
          const rect = panel.getBoundingClientRect();
          toX(((event.clientX - rect.left) / rect.width) * W);
          toY(((event.clientY - rect.top) / rect.height) * H - 120);
        };
        panel.addEventListener("pointermove", onMove, { passive: true });
        return () => panel.removeEventListener("pointermove", onMove);
      });
      media.add("(hover: none), (pointer: coarse)", () => {
        gsap.fromTo(
          light,
          { attr: { x: W * 0.1 } },
          {
            attr: { x: W * 0.9 },
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
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
