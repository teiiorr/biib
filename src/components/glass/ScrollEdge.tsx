import { cn } from "@/lib/cn";

export interface ScrollEdgeProps {
  /** Sarlavha uchun bottom, pastki tab-panel uchun top. */
  readonly position?: "bottom" | "top";
  readonly className?: string;
}

const LAYERS = [1, 3] as const;

/**
 * Progressiv xiralik: ikki qatlam, har biri kuchliroq blur va torroq maska. Faqat oyna ustidagi
 * ingichka tasmada: oyna ortidagi kontent pardasiz koʻrinadi.
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
