"use client";

import { getDictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";

import type { ArtProps } from "../registry";

/** Oʻqish jarayoni qalam chizigʻi sifatida: progress 0–1, role=progressbar. */
export default function PencilProgress({ locale, progress = 0, className }: ArtProps) {
  const dict = getDictionary(locale).ornament;
  const percent = Math.round(Math.max(0, Math.min(1, progress)) * 100);
  return (
    <div
      className={className ? `pencil-progress ${className}` : "pencil-progress"}
      role="progressbar"
      aria-label={dict.pencilProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={fill(dict.qalampirValue, { percent })}
    >
      <svg
        viewBox="0 0 100 6"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pencil-line"
      >
        <path
          d="M1 3.4c12-1.2 24-1.6 36-1 12 .5 24 .4 36-.4 9-.6 17-.4 26 .3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength="1"
          style={{ strokeDasharray: 1, strokeDashoffset: 1 - percent / 100 }}
        />
      </svg>
    </div>
  );
}
