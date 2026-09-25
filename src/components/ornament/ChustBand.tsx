import { cx } from "@/lib/cx";
import { CHUST_CELL, chustCell } from "@/lib/ornament/chust";

import { DrawOnView } from "./DrawOnView";

export interface ChustBandProps {
  /** Koʻrinishga kirganda chapdan oʻngga tikiladi (futer toji). */
  readonly draw?: boolean;
  readonly className?: string;
}

/* 1312 px kontent kengligiga 20 katak sigʻadi; torroq ekranda sigʻmaganlari keyingi qatorga oʻtib yashirinadi. */
const CELLS = 20;

/**
 * Chust doʻppisi hoshiyasi: past toʻrt markazli ravoqlar qatori, har birida osilgan qalampir.
 * Faqat ingichka chiziq (toʻldirish yoʻq), balandligi 24 px. Kataklar qatorni teng toʻldiradi,
 * ravoq tovonlari tutashadi; chiziq qalinligi choʻzilishdan qatʼi nazar 1 px.
 */
export function ChustBand({ draw = false, className }: ChustBandProps) {
  const cell = chustCell();
  const row = (
    <div className={cx("chust-band", className)} aria-hidden="true">
      {Array.from({ length: CELLS }, (_, i) => (
        <svg
          key={i}
          className="orn chust-cell"
          viewBox={`0 0 ${CHUST_CELL.width} ${CHUST_CELL.height}`}
          preserveAspectRatio="none"
          focusable="false"
        >
          <path className="orn-strand" d={cell.arch} />
          <path className="orn-strand chust-pod" d={cell.pod} />
        </svg>
      ))}
    </div>
  );
  return draw ? (
    <DrawOnView order="left-right" duration={0.5}>
      {row}
    </DrawOnView>
  ) : (
    row
  );
}
