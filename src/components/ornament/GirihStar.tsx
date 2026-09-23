import { cn } from "@/lib/cn";
import { girihStar, type GirihSymmetry } from "@/lib/girih";

export interface GirihStarProps {
  readonly symmetry?: GirihSymmetry;
  readonly size?: number;
  /** Halqasiz: faqat markaziy yulduz (til belgisi uchun). */
  readonly ring?: boolean;
  readonly label?: string;
  readonly className?: string;
}

/** Bitta yulduz medalyoni: chor-bogʻ kesishmasi va til belgisi asosi. */
export function GirihStar({
  symmetry = 10,
  size = 96,
  ring = true,
  label,
  className,
}: GirihStarProps) {
  const star = girihStar(symmetry, size, { ring });
  return (
    <svg
      className={cn("orn", className)}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {star.strands.map((d, i) => (
        <path key={i} className="orn-strand" d={d} />
      ))}
    </svg>
  );
}
