import { cn } from "@/lib/cn";
import { Zardozi } from "./Zardozi";

export type ZardoziDraw = "hover" | "view" | "none";

export interface ZardoziUnderlineProps {
  /** hover: ota `.zardozi-host` hover/fokus/aria-current da chiziladi; view: ZardoziReveal ichida. */
  readonly draw?: ZardoziDraw;
  readonly lines?: 2 | 3;
  readonly className?: string;
}

/** Matn ostidagi zardoʻzi: ota element position: relative boʻlishi kerak. Faqat transform jonlanadi. */
export function ZardoziUnderline({ draw = "none", lines = 2, className }: ZardoziUnderlineProps) {
  return (
    <span
      className={cn("zardozi-underline", className)}
      data-draw={draw}
      {...(draw === "view" ? { "data-drawn": "false" } : {})}
      aria-hidden="true"
    >
      <Zardozi lines={lines} />
    </span>
  );
}
