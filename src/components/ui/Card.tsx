import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Karta — hamişa qattiq yuza. §3 böyiça şişa faqat suzuvçi chrome da,
 * röyxatlarda emas. Çegara öğir soya örniga ingiçka çiziq.
 */
export function Card({
  children,
  className,
  interactive = false,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Bosiladigan karta: fon ozgina çökadi, kötarilmaydi va kattalaşmaydi. */
  interactive?: boolean;
  as?: "article" | "div" | "li" | "figure";
}) {
  const Tag = as;

  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-md bg-elevated",
        "shadow-[inset_0_0_0_0.5px_var(--separator)] ",
        interactive && [
          "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
          "hover:bg-sunken focus-within:bg-sunken",
        ],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
