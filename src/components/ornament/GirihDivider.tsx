import { useId } from "react";
import { cn } from "@/lib/cn";
import { girihPeriod, type GirihSymmetry } from "@/lib/girih";
import { safeId } from "@/lib/ornament/ids";
import { GirihDraw } from "./GirihDraw";

export interface GirihDividerProps {
  readonly symmetry?: GirihSymmetry;
  readonly draw?: boolean;
  readonly className?: string;
}

/**
 * Boʻlim ajratuvchi tasma: bitta davr SVG <pattern> orqali takrorlanadi (yengil),
 * chetlari niqob bilan soʻnadi. draw=true boʻlsa tasmalar koʻrinishga kirganda chiziladi.
 */
export function GirihDivider({ symmetry = 10, draw = false, className }: GirihDividerProps) {
  const id = useId();
  const patternId = safeId("girih-divider", id);
  const period = girihPeriod(symmetry, 40, 1.5);
  const svg = (
    <svg className={cn("orn girih-divider", className)} aria-hidden="true" role="presentation">
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={period.width}
          height={period.height}
          y={-period.height / 4}
        >
          {period.strands.map((d, i) => (
            <path key={i} className="orn-strand" d={d} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
  return draw ? <GirihDraw mode="enter">{svg}</GirihDraw> : svg;
}
