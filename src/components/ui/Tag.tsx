import type { ReactNode } from "react";
import type { ArtSlot } from "@/content/types";
import { cn } from "@/lib/cn";

export type TagTone = "neutral" | "accent" | ArtSlot;

export interface TagProps {
  readonly tone?: TagTone;
  readonly as?: "span" | "li";
  readonly className?: string;
  readonly children: ReactNode;
}

/* Toʻrtburchak, 6 px radius; hech qachon kapsula emas. Art ranglari ui.css da. */
export function Tag({ tone = "neutral", as: Component = "span", className, children }: TagProps) {
  return (
    <Component
      data-tone={tone}
      className={cn(
        "ui-tag t-micro inline-flex min-h-6 items-center gap-1 rounded-s px-2 py-1",
        tone === "neutral" && "border border-line bg-surface-2 text-ink-2",
        tone === "accent" && "bg-tint text-on-tint",
        className,
      )}
    >
      <span className="text-trim">{children}</span>
    </Component>
  );
}
