import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/* Sahifa zamini tungi: boʻlim faqat qorongʻi lenta sifatida belgilanadi; yorugʻ ohang faqat yorugʻ rasmlarda. */
export type SectionTone = "dark";

/**
 * section — qoʻshni boʻlimlar orasida 48/64/96 (har tomonda yarmi); band — rangli lenta ichi;
 * hero — sahifa boshi (oyna sarlavhasi ostidan qisqa); none — boʻshliqni boʻlimning oʻzi beradi.
 */
export type SectionRhythm = "section" | "band" | "hero" | "none";

const RHYTHM_CLASS: Record<SectionRhythm, string | null> = {
  section: "section-pad",
  band: "section-band",
  hero: "section-hero",
  none: null,
};

interface SectionProps {
  readonly id?: string;
  /** Oyna shu qiymatni oʻqib ohangini moslaydi (10.1.3). */
  readonly tone?: SectionTone;
  readonly as?: "section" | "div" | "article" | "aside";
  readonly rhythm?: SectionRhythm;
  readonly labelledBy?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Boʻlim ritmi: boʻlimlar orasida 48/64/96 px; ichida 16/24/32. */
export function Section({
  id,
  tone,
  as: Tag = "section",
  rhythm = "section",
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
      className={cn(RHYTHM_CLASS[rhythm], className)}
    >
      {children}
    </Tag>
  );
}
