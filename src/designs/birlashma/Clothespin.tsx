import type { ArtProps } from "../registry";

/** Tarix ipi: ikki mix orasida osilgan ip; kir qisqichlari kartalarning oʻzida (paper.css). */
export default function Clothespin({ className }: ArtProps) {
  return (
    <div
      className={className ? `clothesline-art ${className}` : "clothesline-art"}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="clothesline-rope">
        <path
          d="M6 10c200 26 400 30 494 26 94-4 300-8 494-26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M6 10c200 26 400 30 494 26 94-4 300-8 494-26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity="0.5"
          transform="translate(0 2)"
        />
      </svg>
      <span className="clothesline-nail clothesline-nail-left" />
      <span className="clothesline-nail clothesline-nail-right" />
    </div>
  );
}
