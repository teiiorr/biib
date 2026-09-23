import { cn } from "@/lib/cn";

export interface ScrollEdgeProps {
  /** Sarlavha uchun bottom, pastki tab-panel uchun top. */
  readonly position?: "bottom" | "top";
  readonly className?: string;
}

const LAYERS = [1, 2, 4, 8] as const;

/**
 * Progressiv xiralik: toʻrt qatlam, har biri kuchliroq blur va torroq maska.
 * Sarlavha ostidan oʻtayotgan kontent qattiq chiziq oʻrniga yumshoq soʻnadi.
 */
export function ScrollEdge({ position = "bottom", className }: ScrollEdgeProps) {
  return (
    <div className={cn("scroll-edge", className)} data-position={position} aria-hidden="true">
      {LAYERS.map((blur, index) => (
        <span key={blur} className="scroll-edge-layer" data-layer={index} />
      ))}
    </div>
  );
}
