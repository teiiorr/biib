import type { ReactNode } from "react";

import { SplitLines } from "@/components/motion/SplitLines";
import { Heading, headingClass, type HeadingSize } from "@/components/ui/Heading";
import { tightMarks } from "@/components/ui/tight-marks";
import { cx } from "@/lib/cx";

export interface SectionHeaderProps {
  /** Sarlavha id si: boʻlim shu id orqali nomlanadi (Section labelledBy). */
  readonly id: string;
  readonly title: string;
  /** Sukut 2; ichki kichik boʻlim (masalan maxfiylik bandlari) uchun 3. */
  readonly level?: 2 | 3;
  /** Sukut: daraja boʻyicha (2 → t-h1). Faqat tizim ichidagi oʻlcham beriladi. */
  readonly size?: HeadingSize;
  /** Sarlavha koʻrinishga kirganda soʻzma-soʻz koʻtariladi (split-lines). */
  readonly split?: boolean;
  /** Sarlavha ostida oʻng tomonda turadigan harakatlar qatori (masalan «Barchasi»). */
  readonly actions?: ReactNode;
  readonly className?: string;
}

/**
 * Yagona boʻlim boshi: katta, markazdagi oltin sarlavha; ixtiyoriy harakatlar undan keyin oʻngda.
 * Sarlavha ostida tavsif yoʻq (egasining talabi). Pastki masofa 32 / 48 px (ui.css .section-header).
 */
export function SectionHeader({
  id,
  title,
  level = 2,
  size,
  split = false,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cx("section-header", className)}>
      {split ? (
        <SplitLines as={`h${level}`} id={id} className={headingClass(level, size, "center")}>
          {tightMarks(title)}
        </SplitLines>
      ) : (
        <Heading level={level} align="center" id={id} {...(size ? { size } : {})}>
          {title}
        </Heading>
      )}
      {actions ? <div className="section-header-actions">{actions}</div> : null}
    </div>
  );
}
