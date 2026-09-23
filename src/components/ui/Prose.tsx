import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ProseProps {
  /** Maqola matni body-l (yangilik), boshqa sahifalar body. */
  readonly size?: "body" | "body-l";
  readonly as?: "div" | "article" | "section";
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/* Maqola tanasi: 65ch, xatboshilar, osilgan belgili roʻyxatlar, izohlar. Stil ui.css da. */
export function Prose({ size = "body", as: Tag = "div", id, className, children }: ProseProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "ui-prose measure text-ink",
        size === "body-l" ? "t-body-l" : "t-body",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
