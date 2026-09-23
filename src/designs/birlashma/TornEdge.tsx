import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { paperEdgePath } from "./lib/paper-edge";
import { hashString } from "./lib/seed";

interface TornEdgeProps {
  readonly seed: string;
  readonly className?: string;
}

/** Boʻlimlar orasidagi yirtiq qogʻoz cheti: faqat yuqori qirra ishlatiladi. */
export function TornEdge({ seed, className }: TornEdgeProps) {
  const path = paperEdgePath(hashString(seed), "torn", 40);
  return (
    <svg
      className={cn("torn-edge", className)}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ "--torn-path": `path("${path}")` } as CSSProperties}
    >
      <path
        d={path.replace(
          /(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g,
          (_, x: string, y: string) => `${x} ${(Number(y) * 0.08).toFixed(2)}`,
        )}
        fill="var(--surface)"
      />
    </svg>
  );
}
