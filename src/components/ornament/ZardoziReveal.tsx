"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { doiraDelay } from "@/components/motion/gsap";

export interface ZardoziRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/** Koʻrinishga kirganda ichidagi zardoʻzi chiziqlarini doira ritmida chizadi (CSS transform oʻtishi). */
export function ZardoziReveal({ children, className }: ZardoziRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const targets = host.querySelectorAll<HTMLElement>('.zardozi-underline[data-draw="view"]');
    if (targets.length === 0) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        targets.forEach((target, index) => {
          timers.push(
            window.setTimeout(
              () => target.setAttribute("data-drawn", "true"),
              doiraDelay(index) * 1000,
            ),
          );
        });
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    // Oʻram display: contents, oʻlchami yoʻq: kuzatuv birinchi bolada.
    observer.observe(host.firstElementChild ?? host);
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <span ref={ref} className={cn("contents", className)}>
      {children}
    </span>
  );
}
