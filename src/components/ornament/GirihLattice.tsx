import { useId } from "react";
import { cn } from "@/lib/cn";
import { girihPeriod, type GirihSymmetry } from "@/lib/girih";
import { safeId } from "@/lib/ornament/ids";

export interface GirihLatticeProps {
  readonly symmetry?: GirihSymmetry;
  readonly cell?: number;
  readonly className?: string;
}

/** Xira fon panjarasi (qahramon ipagi ichida): doim aria-hidden, chaqiruvchi position: relative beradi. */
export function GirihLattice({ symmetry = 10, cell = 120, className }: GirihLatticeProps) {
  const id = useId();
  const patternId = safeId("girih-lattice", id);
  const period = girihPeriod(symmetry, cell, 2);
  return (
    <svg className={cn("orn girih-lattice", className)} aria-hidden="true" role="presentation">
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={period.width}
          height={period.height}
        >
          {period.strands.map((d, i) => (
            <path key={i} className="orn-strand" d={d} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
