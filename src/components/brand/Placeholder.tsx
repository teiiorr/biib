import { cn } from "@/lib/cn";

/**
 * Haqiqiy surat va logotip mijozdan kelmaguniça turadigan örinlar.
 * Böyalgan maydon va yozuv, boşqa hеç narsa: bo'ş kulrang quti tördan
 * çiqib turadi, bezakli çizma esa almaştiriş kerakligini yaşiradi.
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
      className={cn("grid h-full w-full place-items-center bg-sunken", className)}
    >
      <span className="text-title2 text-label-secondary">{initials(name)}</span>
    </div>
  );
}

export function CoverPlaceholder({ topic, className }: { topic: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-full w-full items-end bg-sunken p-4", className)}
    >
      <span className="text-title3 text-label-secondary">{topic}</span>
    </div>
  );
}

export function PartnerLogoPlaceholder({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-14 w-full items-center justify-center rounded-sm bg-sunken px-3 text-center",
        className,
      )}
    >
      <span className="text-footnote font-semibold text-label-secondary">{name}</span>
    </span>
  );
}
