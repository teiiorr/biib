import { cn } from "@/lib/cn";
import { xivaColumn, type XivaVariant } from "@/lib/ornament/xiva";

export interface XivaColumnProps {
  readonly variant: XivaVariant;
  readonly seed: string | number;
  readonly className?: string;
}

/** Parametrik oʻyma yogʻoch ustun: har variant oʻz oʻyma tili, nisbatlar urugʻdan. Ranglar --wood-* tokenlari. */
export function XivaColumn({ variant, seed, className }: XivaColumnProps) {
  const column = xivaColumn(variant, seed);
  return (
    <svg
      className={cn("orn xiva-column", className)}
      viewBox={`0 0 ${column.width} ${column.height}`}
      aria-hidden="true"
      focusable="false"
      data-variant={variant}
    >
      <path className="xiva-body" d={column.body} />
      {column.carvings.map((d, i) => (
        <path key={i} className="xiva-carving" d={d} />
      ))}
      <path className="xiva-rim" d={column.rim} />
    </svg>
  );
}
