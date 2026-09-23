import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface MarkerUnderlineProps {
  readonly children: ReactNode;
  readonly tone?: "art-1" | "art-2" | "art-3" | "art-4" | "art-6";
  readonly className?: string;
}

/** Marker ostchizigʻi: qoʻlda tortilgan bitta shtrix, ochilishda chiziladi (700 ms). */
export function MarkerUnderline({ children, tone = "art-2", className }: MarkerUnderlineProps) {
  return (
    <span className={cn("marker-underline", `marker-${tone}`, className)}>
      {children}
      <svg
        className="marker-stroke"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 6.5c18-2.8 36-3.6 54-2.9 14 .5 28 .3 42 1.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength="1"
        />
      </svg>
    </span>
  );
}

interface MarkerTextProps {
  readonly text: string;
  readonly className?: string;
}

const TONES = ["art-2", "art-4", "art-1"] as const;
const MARK = /^\{\{([^}]+)\}\}$/;

/** {{soʻz}} belgilangan soʻzlar ostiga marker chizigʻi; bitta koʻrinishda uchtadan koʻp emas. */
export function MarkerText({ text, className }: MarkerTextProps) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  const markerIndex = parts.map((_, i) => parts.slice(0, i).filter((p) => MARK.test(p)).length);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const m = MARK.exec(part);
        if (!m) return <span key={i}>{part}</span>;
        const index = markerIndex[i] ?? 0;
        if (index >= 3) return <span key={i}>{m[1]}</span>;
        return (
          <MarkerUnderline key={i} tone={TONES[index % TONES.length] ?? "art-2"}>
            {m[1]}
          </MarkerUnderline>
        );
      })}
    </span>
  );
}
