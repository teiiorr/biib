import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type SectionTone = "light" | "dark";

interface SectionProps {
  readonly id?: string;
  /** Oyna shu qiymatni oʻqib ohangini moslaydi (10.1.3). */
  readonly tone?: SectionTone;
  readonly as?: "section" | "div" | "article" | "aside";
  readonly padded?: boolean;
  readonly labelledBy?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Boʻlim ritmi: 48/64/96 px; ichida 16/24/32. */
export function Section({
  id,
  tone,
  as: Tag = "section",
  padded = true,
  labelledBy,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      data-audit=""
      aria-labelledby={labelledBy}
      className={cn(padded && "section-pad", className)}
    >
      {children}
    </Tag>
  );
}
