import type { ArtProps } from "../registry";

/** Tarix ipi bezagi: ip va kir qisqichlari; bosqichlar oʻzi Xiva roʻyxatida (CSS bilan qogʻozga aylanadi). */
export default function Clothespin({ className }: ArtProps) {
  return (
    <div
      className={className ? `clothesline-art ${className}` : "clothesline-art"}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="clothesline-rope">
        <path d="M0 8c250 30 500 30 1000 8" fill="none" stroke="var(--ink-3)" strokeWidth="2" />
      </svg>
    </div>
  );
}
