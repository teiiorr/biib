"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { setupGsap } from "@/components/motion/gsap";
import { useMotionAllowed } from "./use-motion-allowed";

export interface GanchParallaxProps {
  readonly children: ReactNode;
  readonly className?: string;
}

const POINTER_MAX = 12;

/** Skroll parallaksi qatlam `data-depth` ga koʻra; kursor parallaksi faqat aniq koʻrsatkichli katta ekranda. */
export function GanchParallax({ children, className }: GanchParallaxProps) {
  const scope = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();

  useGSAP(
    () => {
      if (!allowed || !scope.current) return;
      const gsap = setupGsap();
      // Trigger — qahramon oʻlchamidagi .ganch qatlami (oʻram display: contents).
      const box = scope.current.firstElementChild ?? scope.current;
      const layers = Array.from(scope.current.querySelectorAll<SVGSVGElement>(".ganch-layer"));
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth ?? 0);
        gsap.to(layer, {
          yPercent: -100 * depth,
          ease: "none",
          scrollTrigger: {
            trigger: box,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      const media = gsap.matchMedia();
      media.add("(hover: hover) and (pointer: fine) and (min-width: 1024px)", () => {
        const setters = layers.map((layer) => ({
          depth: Number(layer.dataset.depth ?? 0),
          x: gsap.quickTo(layer, "x", { duration: 0.6, ease: "power2.out" }),
          y: gsap.quickTo(layer, "y", { duration: 0.6, ease: "power2.out" }),
        }));
        const onMove = (event: PointerEvent): void => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            const k = (s.depth / 0.3) * POINTER_MAX;
            s.x(nx * 2 * k);
            s.y(ny * 2 * k);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
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
