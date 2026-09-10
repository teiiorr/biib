import { cn } from "@/lib/cn";

/**
 * Qöl bilan çizilgan belgilar. Hammasi 32x32 törda, bir xil qalam:
 * yumaloq uçlar, non-scaling-stroke — ölçam özgarsa ham qalinlik bir xil.
 */

export type DoodleName =
  | "spark"
  | "star"
  | "squiggle"
  | "wave"
  | "sun"
  | "cloud"
  | "swirl"
  | "plane"
  | "heart"
  | "note"
  | "brush"
  | "zigzag"
  | "book"
  | "circle";

/** Töldirilgan belgilar — ularga stroke berilmaydi. */
const FILLED = new Set<DoodleName>(["spark"]);

const PATHS: Record<DoodleName, readonly string[]> = {
  spark: ["M16 3c1.4 7.6 4.6 10.8 12.4 12.2-7.6 1.7-10.7 4.9-12.1 12.5-1.5-7.5-4.7-10.7-12.3-12.2 7.4-1.6 10.6-4.8 12-12.5z"],
  star: ["M16 4.4l3.5 7.2 7.9 1-5.8 5.4 1.5 7.9-7.2-3.9-7.3 3.8 1.7-7.9-5.7-5.5 8-.8z"],
  squiggle: ["M3 20.4c3.4-8.2 6.7 8 10.1-.4 3.4-8.4 6.6 7.6 10-.5 1.3-3 2.7-4.2 4-3.6"],
  wave: ["M3 16.2c4.3-6.2 8.7 6.1 13 .1s8.8 6 13.1-.1"],
  sun: [
    "M22.2 16.1a6.1 6.1 0 1 1-12.3 0 6.1 6.1 0 0 1 12.3 0z",
    "M16 2.6v3.9M16 25.6v3.9M4.2 16.1H8M24.1 16.1h3.8M7.6 7.7l2.7 2.7M21.8 21.9l2.7 2.7M24.5 7.7l-2.7 2.7M10.3 21.9l-2.7 2.7",
  ],
  cloud: ["M8.2 23.4c-3 0-5.2-2.3-5-5 .2-2.8 2.7-4.6 5.3-4.2.4-4 3.8-7 7.8-7 3.5 0 6.6 2.4 7.5 5.7 3.5-.5 6.9 1.9 7.2 5.3.3 3.2-2.1 5.2-5.2 5.2z"],
  swirl: ["M4 25.6c-.6-6.6 4.4-12.6 11.1-13 5-.3 9.3 3 9.7 7.3.3 3.6-2.4 6.7-6 7-2.9.2-5.4-1.8-5.6-4.4-.2-2.1 1.4-3.9 3.4-4"],
  plane: ["M3 15.4 29.2 3.8l-8.8 24.4-4.7-8.6z", "M15.7 19.6 29.2 3.8", "M15.7 19.6l-4.6 7.5-.3-9.1"],
  heart: ["M16 27.4S4.4 20.2 4.4 12.5C4.4 8.6 7.4 6 10.9 6c2.4 0 4.3 1.2 5.2 3.1C17 7.2 18.9 6 21.3 6c3.5 0 6.5 2.6 6.5 6.5 0 7.7-11.8 14.9-11.8 14.9z"],
  note: [
    "M12.4 23.9V7.2l14.2-3.1v16.6",
    "M12.4 23.9a3.6 3.2 0 1 1-7.2 0 3.6 3.2 0 0 1 7.2 0zM26.6 20.7a3.6 3.2 0 1 1-7.2 0 3.6 3.2 0 0 1 7.2 0z",
  ],
  brush: [
    "M20.6 5.4 27 11.7 14.9 24 8.5 17.6z",
    "M8.5 17.6c-2.4 1-3.6 3.4-3.9 6.4-.2 2.1 1.2 3.5 3.3 3.3 3-.3 5.4-1.6 6.4-4",
  ],
  zigzag: ["M3 21.2 8.2 12l5.2 9.2L18.6 12l5.2 9.2L29 12"],
  book: [
    "M16 9.4C13 6.9 9.2 5.8 4.4 6.2v17.2c4.8-.4 8.6.7 11.6 3.2 3-2.5 6.8-3.6 11.6-3.2V6.2c-4.8-.4-8.6.7-11.6 3.2z",
    "M16 9.4v17.2",
  ],
  circle: ["M24.4 9.6C21.4 6.4 17.4 5 13.5 5.8 8 6.9 4 11.8 4.7 17c.7 5.1 6.2 8.5 11.9 7.7 5.3-.8 9.5-4.9 9.6-9.5.1-2.6-1.1-5-3.2-6.8"],
};

export interface DoodleProps {
  name: DoodleName;
  className?: string;
  /** Ekrandagi qalinlik, piksel. Bir sahifada 2 va 2.5 dan naryesi işlatilmaydi. */
  strokeWidth?: number;
  /** Bezak emas, maʼnoli bölsa — matn beriladi va aria-hidden olib taşlanadi. */
  title?: string;
}

export function Doodle({ name, className, strokeWidth = 2, title }: DoodleProps) {
  const paths = PATHS[name];
  const filled = FILLED.has(name);

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths.map((d, index) => (
        <path
          key={index}
          d={d}
          fill={filled ? "currentColor" : "none"}
          stroke={filled ? "none" : "currentColor"}
          strokeWidth={filled ? undefined : strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect={filled ? undefined : "non-scaling-stroke"}
        />
      ))}
    </svg>
  );
}
