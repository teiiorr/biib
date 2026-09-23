import { cn } from "@/lib/cn";

export interface DividerProps {
  readonly orientation?: "horizontal" | "vertical";
  /** Bezak boʻlsa ekran oʻquvchisi uchun ajratuvchi emas. */
  readonly decorative?: boolean;
  readonly className?: string;
}

/* Oltin ingichka chiziq: bezak rangi accent-art. */
export function Divider({
  orientation = "horizontal",
  decorative = false,
  className,
}: DividerProps) {
  return (
    <hr
      {...(decorative ? { role: "presentation" } : {})}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      className={cn(
        "m-0 border-0 border-accent-art",
        orientation === "vertical" ? "self-stretch border-l" : "w-full border-t",
        className,
      )}
    />
  );
}
