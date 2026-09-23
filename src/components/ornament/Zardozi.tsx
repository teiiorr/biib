import { useId } from "react";
import { cn } from "@/lib/cn";
import { safeId } from "@/lib/ornament/ids";
import { zardoziGeometry } from "@/lib/ornament/zardozi";

export interface ZardoziProps {
  readonly lines?: 2 | 3;
  readonly className?: string;
}

/** Zardoʻzi tasmasi: parallel oltin iplar va har 6 px da koʻndalang chok; kenglik 100 %. */
export function Zardozi({ lines = 2, className }: ZardoziProps) {
  const id = useId();
  const patternId = safeId("zardozi", id);
  const g = zardoziGeometry(lines);
  return (
    <svg
      className={cn("orn zardozi", className)}
      height={g.height}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width={g.pitch} height={g.height}>
          {g.rows.map((y) => (
            <line key={y} className="zardozi-thread" x1={0} x2={g.pitch} y1={y} y2={y} />
          ))}
          <path className="zardozi-stitch" d={g.stitch} />
        </pattern>
      </defs>
      <rect width="100%" height={g.height} fill={`url(#${patternId})`} />
    </svg>
  );
}
