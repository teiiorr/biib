import { Doodle } from "./Doodles";
import type { ArtProps } from "../registry";

/**
 * Otkritka orqasi: oʻrtadagi ajratgich, manzil chiziqlari, marka va pochta muhri; skotch burchakda.
 * Kontent (sarlavha, matn, tugmalar) chap yarmida, otkritka koʻrinishi paper.css da.
 */
export default function Postcard({ copy, className }: ArtProps) {
  return (
    <span className={className ? `postcard-art ${className}` : "postcard-art"} aria-hidden="true">
      <span className="sr-only">{copy?.postcardLabel}</span>
      <span className="postcard-divider" />
      <svg className="postcard-lines" viewBox="0 0 300 120" preserveAspectRatio="none">
        <path
          d="M4 24c70-2 140-2 210 0 30 1 60 1 82-1M4 60c60 2 120 2 180 0 40-1 80-1 112 1M4 96c50-2 100-1 150 1 45 2 95 1 142-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className="postcard-stamp">
        <Doodle name="sun" size={32} tone="art-2" />
      </span>
      <svg className="postcard-postmark" viewBox="0 0 96 64">
        <circle cx="30" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30" cy="32" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        <path
          d="M56 22c12-4 24-4 36 0M56 32c12 4 24 4 36 0M56 42c12-4 24-4 36 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="paper-fixing paper-fixing-tape postcard-tape" />
    </span>
  );
}
