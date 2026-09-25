import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

interface BoilProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Chiziq qaynashi: uchta feTurbulence urugʻi 10 kadr/s da almashadi (steps), siljish ≤1.5 px.
 * Bitta umumiy filtr toʻplami; matn va ikonkalarga qoʻyilmaydi. Harakat oʻchiq boʻlsa toʻxtaydi.
 */
export function Boil({ children, className }: BoilProps) {
  return (
    <span className={cx("boil", className)}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="boil-defs">
        <filter id="boil-1" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="2"
            seed="1"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
        </filter>
        <filter id="boil-2" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
        </filter>
        <filter id="boil-3" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="2"
            seed="13"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
        </filter>
      </svg>
      <span className="boil-frame">{children}</span>
    </span>
  );
}
