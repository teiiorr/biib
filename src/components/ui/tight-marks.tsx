import { Fragment, type ReactNode } from "react";

const MARKS = /([ʻʼ])/;

/**
 * Sarlavhada ʻ va ʼ belgilarini alohida qutiga oladi: Manrope UZ da katta oʻlchamda bu belgi keng
 * yonboshli, «Bogʻlanish» soʻz ichida teshik boʻlib koʻrinardi (ui.css .tight-mark yonboshni qisqartiradi).
 */
export function tightMarks(text: string): ReactNode {
  if (!MARKS.test(text)) return text;
  return text.split(MARKS).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="tight-mark">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
