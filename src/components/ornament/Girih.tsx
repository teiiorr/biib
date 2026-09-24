import { cn } from "@/lib/cn";
import { girihPattern, type GirihSymmetry } from "@/lib/girih";
import { GirihDraw } from "./GirihDraw";
import type { DrawMode } from "./DrawOnView";

export interface GirihProps {
  readonly symmetry?: GirihSymmetry;
  readonly width: number;
  readonly height: number;
  /** Asosiy yulduz diametri, px. */
  readonly cell?: number;
  readonly draw?: DrawMode | false;
  /** Maʼno tashisa (masalan OG rasm), nom beriladi; aks holda aria-hidden. */
  readonly label?: string;
  readonly className?: string;
}

const MAX_PATHS = 24;

/** Yuzlab boʻlak oʻrniga ≤24 yoʻl: DOM va HTML yengil, chizish ritmi guruhlar boʻyicha qoladi. */
function groupStrands(strands: readonly string[]): string[] {
  const per = Math.max(1, Math.ceil(strands.length / MAX_PATHS));
  const out: string[] = [];
  for (let i = 0; i < strands.length; i += per) out.push(strands.slice(i, i + per).join(" "));
  return out;
}

/**
 * Girih tasmalari (Kaplan/Hankin, Lu–Steinhardt plitkalari). Chiziq currentColor:
 * chaqiruvchi text-accent-art yoki text-accent-text beradi.
 */
export function Girih({
  symmetry = 10,
  width,
  height,
  cell = 96,
  draw = false,
  label,
  className,
}: GirihProps) {
  const pattern = girihPattern({ symmetry, width, height, cell });
  const svg = (
    <svg
      className={cn("orn", className)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid slice"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {groupStrands(pattern.strands).map((d, i) => (
        <path key={i} className="orn-strand" d={d} />
      ))}
    </svg>
  );
  return draw ? <GirihDraw mode={draw}>{svg}</GirihDraw> : svg;
}
