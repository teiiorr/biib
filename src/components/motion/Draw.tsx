"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DOIRA_UNIT, DURATION } from "@/lib/motion/constants";
import { motionAllowed } from "@/lib/motion/prefs";
import { doiraStaggerFn, EASE, gsap } from "./gsap";
import { useMotionPrefs } from "./motion-context";

const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

export interface DrawProps {
  /** Ichida SVG (girih, zardoʻzi, Chust bandi, palak). */
  readonly children: ReactNode;
  readonly className?: string;
  /** Sekund; sukut 1.6 s (--dur-draw). */
  readonly duration?: number;
  readonly start?: string;
  /** true: skrollni kutmay darhol chiziladi (404, aloqa bandi). */
  readonly immediate?: boolean;
  readonly stagger?: boolean;
}

/** draw: DrawSVG 0→100 %. Harakat taqiqlanganda naqsh statik, toʻliq chizilgan holda qoladi. */
export function Draw({
  children,
  className,
  duration = DURATION.draw,
  start = "top 80%",
  immediate = false,
  stagger = true,
}: DrawProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !allowed) return;
      const shapes = Array.from(root.querySelectorAll<SVGGeometryElement>(SHAPES));
      if (shapes.length === 0) return;
      const vars: gsap.TweenVars = {
        drawSVG: "0% 100%",
        duration,
        ease: EASE.out,
        // Chiziqlar zich; yarim birlik bilan ritm saqlanadi, umumiy vaqt oshib ketmaydi.
        stagger: stagger ? doiraStaggerFn(DOIRA_UNIT / 2) : 0,
      };
      if (!immediate) vars.scrollTrigger = { trigger: root, start, once: true };
      gsap.fromTo(shapes, { drawSVG: "0%" }, vars);
    },
    {
      scope: ref,
      dependencies: [allowed, duration, start, immediate, stagger],
      revertOnUpdate: true,
    },
  );

  return (
    <span ref={ref} className={cn("contents", className)}>
      {children}
    </span>
  );
}
