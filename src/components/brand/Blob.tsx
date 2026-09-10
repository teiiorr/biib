import { cn } from "@/lib/cn";

/**
 * Bölim ortidagi organik şakllar. Haqiqiy yöllar, gradient emas —
 * gradientli "blob" darrov şablonga öxşab qoladi.
 */

export type BlobName = "sky" | "hill" | "pebble" | "petal" | "drop";

const PATHS: Record<BlobName, string> = {
  sky: "M512 118c52 66 68 170 34 246-34 76-118 124-210 140-92 16-192-2-244-60-52-58-56-156-26-234 30-78 94-136 176-158 82-22 218 4 270 66z",
  hill: "M78 402c-52-64-56-166-8-238 48-72 148-114 244-108 96 6 188 60 218 140 30 80-2 186-74 236-72 50-184 44-260 22-76-22-68-16-120-52z",
  pebble:
    "M446 96c62 42 100 132 88 216-12 84-74 162-158 190-84 28-190 6-242-56-52-62-50-168-14-248 36-80 106-134 178-146 72-12 86 2 148 44z",
  petal:
    "M300 44c110 0 214 76 244 178 30 102-14 224-108 280-94 56-238 46-306-32C62 392 70 254 122 168 174 82 190 44 300 44z",
  drop: "M336 62c86 26 152 108 162 202 10 94-36 200-116 250-80 50-194 44-256-20-62-64-72-186-38-278 34-92 162-180 248-154z",
};

export interface BlobProps {
  name: BlobName;
  className?: string;
  /** Tailwind rang sinfi, masalan text-blue-soft. Fill currentColor dan olinadi. */
  tone?: string;
}

export function Blob({ name, className, tone = "text-blue-soft" }: BlobProps) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={cn(
        // Kiçik ekranda şakl matnning ortidan öfadi — şuning uçun soyi paştroq.
        "pointer-events-none absolute opacity-35 sm:opacity-75",
        "dark:opacity-30 sm:dark:opacity-50",
        tone,
        className,
      )}
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} fill="currentColor" />
    </svg>
  );
}
