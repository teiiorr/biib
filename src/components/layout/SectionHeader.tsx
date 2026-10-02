import type { ReactNode } from "react";

import { SplitLines } from "@/components/motion/SplitLines";
import { Heading, headingClass, type HeadingSize } from "@/components/ui/Heading";
import { cx } from "@/lib/cx";

export interface SectionHeaderProps {
  /** Section shu id orqali aria-labelledby bilan nomlanadi. */
  readonly id: string;
  readonly title: string;
  /** Odatda 2; ichki kichik boʻlim (masalan, maxfiylik bandlari) uchun 3. */
  readonly level?: 2 | 3;
  /** Berilmasa darajadan olinadi (2 → t-h1); faqat tizimdagi oʻlchamlar. */
  readonly size?: HeadingSize;
  readonly split?: boolean;
  /** Sarlavhadan keyin oʻngda turadigan harakatlar (masalan, «Barchasi»). */
  readonly actions?: ReactNode;
  readonly className?: string;
}

/** Markazdagi katta oltin sarlavha, ostida tavsif yoʻq. Pastki masofa 32 / 48 px (ui.css, .section-header). */
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
          {title}
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
