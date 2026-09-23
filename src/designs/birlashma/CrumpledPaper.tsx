import type { ArtProps } from "../registry";

/** Xato sahifasi: gʻijimlangan varaq, chiziqli illyustratsiya. */
export default function CrumpledPaper({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className ? `crumpled ${className}` : "crumpled"}
      aria-hidden="true"
    >
      <path
        d="M52 34l38-12 46 9 26 31-8 40 12 38-34 22-52-4-38-24 6-46z"
        fill="var(--surface)"
        stroke="var(--ink-3)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M52 34l40 46-12 42M90 22l38 58 30 10M128 31l-18 52 40 34M64 148l40-26 44 8"
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
}
