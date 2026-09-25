import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = "display-xl" | "display-l" | "h1" | "h2" | "h3" | "h4";

export interface HeadingProps {
  /** Semantik daraja: sahifada bitta h1, darajalar sakramaydi. */
  readonly level: HeadingLevel;
  /** Koʻrinish oʻlchami darajadan ajratilgan; berilmasa darajaga mos. */
  readonly size?: HeadingSize;
  /** Bir qatorli sarlavha: cap-height va baseline boʻyicha kesish. */
  readonly trim?: boolean;
  readonly align?: "start" | "center";
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

const SIZE_CLASS: Record<HeadingSize, string> = {
  "display-xl": "t-display-xl",
  "display-l": "t-display-l",
  h1: "t-h1",
  h2: "t-h2",
  h3: "t-h3",
  h4: "t-h4",
};

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = { 1: "h1", 2: "h2", 3: "h3", 4: "h4" };

export function Heading({
  level,
  size,
  trim = false,
  align = "start",
  id,
  className,
  children,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      id={id}
      className={cx(
        SIZE_CLASS[size ?? DEFAULT_SIZE[level]],
        "text-balance text-ink",
        trim && "text-trim",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
