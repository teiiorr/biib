import { cx } from "@/lib/cx";

export type DoodleName = "star" | "spiral" | "arrow" | "cloud" | "note" | "heart" | "sun";

/* Qoʻl titrashi bir marta chizilgan: har yoʻl aniq koordinatalarda, ish vaqtida tasodif yoʻq. */
const PATHS: Record<DoodleName, string> = {
  star: "M24 5.2l5.3 11.6 12.4 1.3-9.4 8.4 2.9 12.3L24 32.6l-11.1 6.1 2.7-12.4-9.2-8.6 12.5-1.1z",
  spiral:
    "M24 24c1.6-2.4 5.3-1.9 6.1.9 1.1 3.6-2.7 6.7-6.3 6.1-5.2-.9-7.4-6.8-5.6-11.3 2.4-6.1 10.3-8.1 15.5-4.6 6.6 4.5 7.2 14.2 2.3 20.1-6 7.3-17.9 6.9-23.4-.4",
  arrow:
    "M6 30c7.2-6.4 16.1-10.3 25.9-11.4M27.4 12.9c3.1 2.3 5.4 4.1 8.3 5.5-3 2.1-5.7 4.6-8.4 7.3",
  cloud:
    "M12.4 33.2c-4.6.3-7.9-4.1-6.1-8.1 1.2-2.6 4-3.6 6.6-3-1.1-5.8 3.7-10.9 9.3-9.8 2.4.4 4.4 2 5.6 4.1 2.9-2.4 7.4-1.5 9 1.9 1 2 .7 4.4-.5 6.1 3.4.5 5.4 4.2 3.9 7.3-1.1 2.2-3.5 3.1-5.8 2.9-7.4-.3-14.7-.6-22-.4",
  note: "M18 34.6c-.4-8.1-.6-16.2-.2-24.3 6.2-.9 12.4-1.1 18.5-.3-.4 8.3-.1 16.6.3 24.8-6.2.8-12.4.7-18.6-.2zM22 15h10M22 20h9M22 25h6",
  heart:
    "M24 38.5c-6.6-5.2-13.8-10.4-15.6-18.3-1.1-4.9 2.2-9.6 7.1-9.5 3.6.1 6.3 2.4 8.4 5.3 2.3-3.1 5.4-5.4 9.2-5.1 4.8.4 7.8 5.2 6.5 10-2.2 7.9-9.4 12.7-15.6 17.6z",
  sun: "M24 15.4a8.6 8.6 0 1 1-.4 17.2 8.6 8.6 0 0 1 .4-17.2zM24 4.6v5.2M24 38.2v5.3M4.8 24h5.2M38.1 24h5.2M10.3 10.6l3.6 3.6M34.1 34.1l3.7 3.7M37.6 10.4l-3.6 3.7M13.9 34.3l-3.6 3.5",
};

interface DoodleProps {
  readonly name: DoodleName;
  readonly size?: 24 | 32 | 48 | 64 | 96;
  readonly className?: string;
  /** Boʻyoq tokeni: art-1…art-7 yoki ink. */
  readonly tone?: "ink" | "art-1" | "art-2" | "art-3" | "art-4" | "art-5" | "art-6" | "art-7";
  readonly boil?: boolean;
}

/** Qoʻlda chizilgan bezak: marker chizigʻi, yumaloq uchlar. Doim aria-hidden. */
export function Doodle({ name, size = 48, className, tone = "ink", boil = false }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cx("doodle", `doodle-${tone}`, boil && "doodle-boil", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
