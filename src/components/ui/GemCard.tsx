import type { CSSProperties, ReactNode } from "react";
import { Girih } from "@/components/brand/Texture";
import type { Accent } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Karta — hamişa qattiq yuza: şişa faqat suzuvçi chrome da (§3).
 * Xarakter ranggdan keladi: har kartaning öz samosveti yuqori qirrada,
 * raqam ortidagi yumşoq dogʻda va roʻyxat belgilarida körinadi.
 *
 * Samosvetning özi matn bölmaydi — violet ivory bilan 2.83:1 beradi.
 * Matn ivory va oltin bölib qoladi.
 */
export function GemCard({
  accent,
  index,
  children,
  className,
  interactive = false,
  as = "article",
}: {
  accent: Accent;
  /** Karta tartibi. Berilsa, burçakda katta raqam bölib turadi. */
  index?: number;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "article" | "div" | "li";
}) {
  const Tag = as;

  return (
    <Tag
      style={{ "--gem": `var(--${accent})` } as CSSProperties}
      className={cn(
        "group relative isolate overflow-hidden rounded-lg bg-elevated",
        "shadow-[inset_0_0_0_0.5px_var(--separator)]",
        "transition-colors duration-[var(--dur-base)] ease-[var(--ease-standard)]",
        interactive && "hover:bg-sunken focus-within:bg-sunken",
        className,
      )}
    >
      {/* Yuqori qirradagi samosvet çizigʻi — kartaning imzosi. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 z-10 h-[2px]",
          "bg-[linear-gradient(90deg,var(--gem),color-mix(in_srgb,var(--gem)_20%,transparent))]",
          "opacity-70 transition-opacity duration-[var(--dur-base)]",
          "group-hover:opacity-100 group-focus-within:opacity-100",
        )}
      />

      <Girih className="opacity-[0.05]" />

      {index !== undefined ? (
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-3 z-0">
          <span className="absolute -inset-3 rounded-pill bg-[color-mix(in_srgb,var(--gem)_16%,transparent)] blur-md" />
          <span className="relative font-[family-name:var(--font-display)] text-title1 font-bold text-gold opacity-25">
            {String(index).padStart(2, "0")}
          </span>
        </span>
      ) : null}

      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

/** Röyxat belgisi — kiçik samosvet kvadrati. */
export function GemBullet() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.45rem] block h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gem)]"
    />
  );
}
