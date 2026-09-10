"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { observeReveal } from "@/lib/reveal";

/**
 * Kalit sözning tagidagi qölda tortilgan çiziq. Skrollda özi çiziladi.
 * Bitta söz uçun möljallangan — uzun ibora ikki qatorga tuşib buziladi.
 */

const ACCENT: Record<string, string> = {
  sun: "text-sun",
  coral: "text-coral",
  grass: "text-grass",
  pink: "text-pink",
  grape: "text-grape",
  blue: "text-blue",
};

export interface MarkerUnderlineProps {
  children: ReactNode;
  accent?: keyof typeof ACCENT;
  delay?: number;
  className?: string;
}

export function MarkerUnderline({
  children,
  accent = "sun",
  delay = 260,
  className,
}: MarkerUnderlineProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => observeReveal(ref.current), []);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        ref={ref}
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none absolute -bottom-[0.2em] -left-[2%] z-0 h-[0.4em] w-[104%] overflow-visible",
          ACCENT[accent],
        )}
        style={{ ["--reveal-delay" as string]: `${delay}ms` }}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M4 10.6C40 5.4 78 3.4 112 4.6c28 1 54 3.2 84 1"
          pathLength={1}
          data-draw=""
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: "0.17em" }}
        />
        <path
          d="M22 14.2c34-3.2 68-4 102-2.4"
          pathLength={1}
          data-draw=""
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          opacity={0.55}
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: "0.085em", transitionDelay: `${delay + 180}ms` }}
        />
      </svg>
    </span>
  );
}
