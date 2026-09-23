import { cn } from "@/lib/cn";
import { splitMarked } from "@/lib/ornament/marked-text";
import { ZardoziReveal } from "./ZardoziReveal";
import { ZardoziUnderline } from "./ZardoziUnderline";

export interface ZardoziTextProps {
  /** "{{soʻz}}" belgili matn (masalan home.portal.statement). Koʻpi bilan uchta soʻz. */
  readonly text: string;
  readonly lines?: 2 | 3;
  /** view: koʻrinishga kirganda chiziladi; none: darhol chizilgan. */
  readonly draw?: "view" | "none";
  readonly className?: string;
}

/** Belgilangan soʻzlar <em> (urgʻu), ostida zardoʻzi; rang faqat chiziqda, matn siyoh rangida qoladi. */
export function ZardoziText({ text, lines = 2, draw = "view", className }: ZardoziTextProps) {
  const runs = splitMarked(text, 3);
  const content = (
    <span className={cn(className)}>
      {runs.map((run, i) =>
        run.marked ? (
          <em key={i} className="zardozi-word">
            {run.text}
            <ZardoziUnderline draw={draw} lines={lines} className="text-accent-art" />
          </em>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </span>
  );
  return draw === "view" ? <ZardoziReveal>{content}</ZardoziReveal> : content;
}
