import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { qalampirPath } from "@/lib/ornament/chust";

export interface QalampirProps {
  /** Oʻqish jarayoni 0–1. */
  readonly progress: number;
  /** aria-label (lugʻat: ornament.qalampir). */
  readonly label: string;
  /** aria-valuetext (lugʻat: ornament.qalampirValue, foiz qoʻyilgan). */
  readonly valueText: string;
  readonly className?: string;
}

const POD = qalampirPath(24, 40);
const clamp = (v: number): number => Math.min(1, Math.max(0, v));

/** Toʻrt qalampir birin-ketin toʻladi: maqola oʻqish koʻrsatkichi (role=progressbar). */
export function Qalampir({ progress, label, valueText, className }: QalampirProps) {
  const p = clamp(progress);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
      aria-valuetext={valueText}
      className={cx("qalampir", className)}
    >
      {[0, 1, 2, 3].map((i) => {
        const fill = clamp(p * 4 - i);
        const style = { "--fill": fill.toFixed(3) } as CSSProperties;
        return (
          <svg
            key={i}
            className="orn qalampir-pod"
            viewBox="0 0 24 40"
            aria-hidden="true"
            focusable="false"
          >
            <path className="qalampir-fill" d={POD} style={style} />
            <path className="qalampir-outline" d={POD} />
          </svg>
        );
      })}
    </div>
  );
}
