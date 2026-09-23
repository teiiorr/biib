import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TextSize = "body-l" | "body" | "small" | "micro";
export type TextTone = "ink" | "ink-2" | "ink-3" | "inherit";

export interface TextProps {
  readonly as?: "p" | "span" | "div";
  readonly size?: TextSize;
  readonly tone?: TextTone;
  /** Oʻqish kengligi 65ch. */
  readonly measure?: boolean;
  readonly tnum?: boolean;
  readonly align?: "start" | "center";
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

const SIZE_CLASS: Record<TextSize, string> = {
  "body-l": "t-body-l",
  body: "t-body",
  small: "t-small",
  micro: "t-micro",
};

const TONE_CLASS: Record<TextTone, string> = {
  ink: "text-ink",
  "ink-2": "text-ink-2",
  "ink-3": "text-ink-3",
  inherit: "",
};

export function Text({
  as: Tag = "p",
  size = "body",
  tone = "inherit",
  measure = false,
  tnum = false,
  align = "start",
  id,
  className,
  children,
}: TextProps) {
  return (
    <Tag
      id={id}
      className={cn(
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        measure && "measure",
        tnum && "tnum",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
