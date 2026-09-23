import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { paperEdgeDataUri, type EdgeKind } from "./lib/paper-edge";
import { hashString } from "./lib/seed";

export type Fixing = "tape" | "magnet" | "pin" | "none";

interface PaperSheetProps {
  readonly as?: "div" | "article" | "li" | "figure" | "section";
  readonly seed: string;
  readonly edge?: EdgeKind;
  readonly fixing?: Fixing;
  /** ±2° dan oshmaydi (§25.2). */
  readonly rotate?: number;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Qoʻlda qirqilgan qogʻoz varagʻi: 8–12 px radius, qirra notekisligi maskada, qogʻoz soyasi. */
export function PaperSheet({
  as: Tag = "div",
  seed,
  edge = "deckle",
  fixing = "none",
  rotate = 0,
  className,
  children,
}: PaperSheetProps) {
  const angle = Math.max(-2, Math.min(2, rotate));
  const style = {
    "--paper-mask": paperEdgeDataUri(hashString(seed), edge),
    "--paper-rotate": `${angle}deg`,
  } as CSSProperties;
  return (
    <Tag className={cn("paper-sheet", className)} style={style} data-fixing={fixing}>
      {fixing !== "none" ? (
        <span className={`paper-fixing paper-fixing-${fixing}`} aria-hidden="true" />
      ) : null}
      {children}
    </Tag>
  );
}
