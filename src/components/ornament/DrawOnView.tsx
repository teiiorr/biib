"use client";

import { useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useEngineEffect } from "@/components/motion/engine";
import { EASE } from "@/lib/motion/constants";
import { doiraStaggerFn, doiraUnit } from "@/lib/motion/doira";
import { belowViewport } from "@/lib/motion/viewport";
import { useMotionAllowed } from "./use-motion-allowed";

export interface DrawOnViewProps {
  readonly children: ReactNode;
  /** doira: uchtalik guruhlar; left-right: chapdan oʻngga tekis chok (Chust toji). */
  readonly order?: "doira" | "left-right";
  /** Bitta chiziq davomiyligi, s. */
  readonly duration?: number;
  /** Toʻldirilgan qismlar (masalan ".chust-accent"): chizilmaydi, chiziqlardan keyin 300 ms da paydo boʻladi. */
  readonly fills?: string;
  readonly className?: string;
}

const DRAWABLE = "path, circle, ellipse, line, polyline, polygon";
/* Chapdan oʻngga chok butun qator uchun 1.2 s ichida tugaydi. */
const SWEEP = 1.2;

/**
 * draw (motion-plan 3.9): koʻrinishga kirganda qamrovdagi SVG chiziqlari bir marta DrawSVG bilan
 * chiziladi. Harakat taqiqlangan boʻlsa hech narsa qilmaydi: naqsh SSR dan toʻliq chizilgan keladi.
 * Chizilib boʻlgach qutiga data-drawn.
 */
export function DrawOnView({
  children,
  order = "doira",
  duration = 1.6,
  fills,
  className,
}: DrawOnViewProps) {
  const scope = useRef<HTMLDivElement>(null);
  const allowed = useMotionAllowed();

  useEngineEffect(
    scope,
    ({ gsap }) => {
      if (!allowed || !scope.current) return;
      // Oʻram display: contents, oʻlchami yoʻq: trigger birinchi bola.
      const box = scope.current.firstElementChild ?? scope.current;
      const filled = fills ? Array.from(scope.current.querySelectorAll(fills)) : [];
      const targets = Array.from(scope.current.querySelectorAll(DRAWABLE)).filter(
        (el) => !filled.includes(el),
      );
      if (targets.length === 0) return;
      // Kech kelgan dvigatel yoki sahifa oʻtishi: ekrandagi naqsh chizilgan holda qoladi.
      if (!belowViewport(box, 1)) return;
      const stagger =
        order === "left-right"
          ? { each: Math.min(0.075, (SWEEP - duration) / Math.max(1, targets.length - 1)) }
          : doiraStaggerFn(doiraUnit(targets.length));
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: box, start: "top 85%", once: true },
        onComplete: () => box.setAttribute("data-drawn", ""),
      });
      timeline.fromTo(
        targets,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration, ease: EASE.out, stagger },
        0,
      );
      if (filled.length > 0) {
        timeline.fromTo(filled, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: EASE.ui });
      }
    },
    [allowed, order, duration, fills],
  );

  return (
    <div ref={scope} className={cx("contents", className)}>
      {children}
    </div>
  );
}
