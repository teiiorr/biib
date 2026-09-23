import { cn } from "@/lib/cn";
import { chustBand } from "@/lib/ornament/chust";
import { DrawOnView } from "./DrawOnView";

export interface ChustBandProps {
  /** Koʻrinishga kirganda oʻzini chizadi (futer toji). */
  readonly draw?: boolean;
  readonly className?: string;
}

/** Chust doʻppisining 16 ravoqli hoshiyasi, toʻliq kenglikda; ravoqchalar currentColor bilan. */
export function ChustBand({ draw = false, className }: ChustBandProps) {
  const band = chustBand(16, 40, 30);
  const svg = (
    <svg
      className={cn("orn chust-band", className)}
      viewBox={`0 0 ${band.width} ${band.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {band.cells.map((cell) => (
        <g key={cell.x}>
          <path className="orn-strand" d={cell.arch} />
          <path className="chust-accent" d={cell.accent} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
  return draw ? (
    <DrawOnView mode="enter" duration={1.2}>
      {svg}
    </DrawOnView>
  ) : (
    svg
  );
}
