import type { CSSProperties } from "react";
import type { Accent } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Haqiqiy surat va logotip mijozdan kelmaguniça turadigan örinlar.
 * Böyalgan maydon va yozuv: bo'ş kulrang quti tördan çiqib turadi,
 * bezakli çizma esa almaştiriş kerakligini yaşiradi.
 *
 * Almaştiriş: src/content dagi photo / cover / logo maydonini töldiriş kifoya.
 */

/** Ism-şarifning boş harflari, ikki sözdan ortiği olinmaydi. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join("");
}

export function PortraitPlaceholder({ name, className }: { name: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid h-full w-full place-items-center bg-graphite", className)}
    >
      <span className="font-[family-name:var(--font-display)] text-title2 text-gold opacity-70">
        {initials(name)}
      </span>
    </div>
  );
}

/** Muqova örni: samosvet bilan tonlangan maydon va mavzu nomi. */
export function CoverPlaceholder({
  topic,
  accent,
  className,
}: {
  topic: string;
  accent?: Accent;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={accent ? ({ "--gem": `var(--${accent})` } as CSSProperties) : undefined}
      className={cn(
        "flex h-full w-full items-end p-4",
        "bg-[color-mix(in_srgb,var(--gem,var(--violet))_14%,var(--bg-sunken))]",
        className,
      )}
    >
      <span className="font-[family-name:var(--font-display)] text-title3 text-label-secondary">
        {topic}
      </span>
    </div>
  );
}

export function PartnerLogoPlaceholder({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-14 w-full items-center justify-center rounded-sm px-3 text-center",
        "bg-fill-secondary",
        className,
      )}
    >
      <span className="text-footnote font-semibold text-label-secondary">{name}</span>
    </span>
  );
}
