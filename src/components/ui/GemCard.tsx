import type { CSSProperties, ReactNode } from "react";
import { Girih } from "@/components/brand/Texture";
import type { Accent } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Karta. Rangi şişaning öz tonidan keladi — bu materialning qismi,
 * ustiga yopiştirilgan bezak emas. Gradient çiziq, yoruğ dogʻ va
 * bo'ş katta raqam qöyilmaydi: ular hеç qanday maʼno taşimaydi.
 *
 * Samosvetning özi matn bölmaydi — violet ivory bilan 2.83:1 beradi.
 * Matn ivory va oltin bölib qoladi.
 */
export function GemCard({
  accent,
  children,
  className,
  interactive = false,
  as = "article",
}: {
  accent: Accent;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "article" | "div" | "li";
}) {
  const Tag = as;

  return (
    <Tag
      style={
        {
          "--gem": `var(--${accent})`,
          "--gem-line": `var(--${accent}-line)`,
        } as CSSProperties
      }
      className={cn(
        "glass glass-card group relative isolate overflow-hidden rounded-lg",
        "transition-[filter] duration-[var(--dur-base)] ease-[var(--ease-standard)]",
        interactive && "hover:brightness-110 focus-within:brightness-110",
        className,
      )}
    >
      <Girih className="opacity-[0.05]" />

      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

/** Röyxat belgisi — kiçik samosvet nuqtasi. */
export function GemBullet() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.5rem] block h-1.5 w-1.5 shrink-0 rounded-pill bg-[var(--gem-line,var(--gem))]"
    />
  );
}
