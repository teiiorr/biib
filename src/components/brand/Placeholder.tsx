import type { Accent } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Surat va logotip mijozdan kelmaguniça turadigan örinlar.
 * Rasm çizilmaydi — böyalgan maydon va yozuv. Şunda ham böş quti körinmaydi,
 * ham nimani almaştiriş kerakligi darrov bilinadi.
 *
 * Almaştiriş: src/content dagi photo / cover / logo maydonini töldiriş kifoya.
 */

const TONE: Record<Accent, { panel: string; text: string }> = {
  sun: { panel: "bg-sun-soft", text: "text-sun-ink" },
  coral: { panel: "bg-coral-soft", text: "text-coral-ink" },
  grass: { panel: "bg-grass-soft", text: "text-grass-ink" },
  pink: { panel: "bg-pink-soft", text: "text-pink-ink" },
  grape: { panel: "bg-grape-soft", text: "text-grape-ink" },
  blue: { panel: "bg-blue-soft", text: "text-blue-deep" },
};

/** Ism-şarifning boş harflari. Ikki sözdan ortiği olinmaydi. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join("");
}

export function PortraitPlaceholder({
  name,
  accent = "blue",
  className,
}: {
  name: string;
  accent?: Accent;
  className?: string;
}) {
  const tone = TONE[accent];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid h-full w-full place-items-center",
        tone.panel,
        tone.text,
        className,
      )}
    >
      <span className="font-display text-[clamp(1.5rem,18cqw,2.6rem)] font-extrabold tracking-tight opacity-80">
        {initials(name)}
      </span>
    </div>
  );
}

/** Yangilik muqovasi örni: böyalgan maydon va mavzu sözi katta yozuvda. */
export function CoverPlaceholder({
  topic,
  accent = "blue",
  className,
}: {
  topic: string;
  accent?: Accent;
  className?: string;
}) {
  const tone = TONE[accent];
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-full w-full items-end p-5 sm:p-6", tone.panel, className)}
    >
      <span
        className={cn(
          "font-display text-[clamp(1.5rem,6cqw,2.4rem)] font-extrabold leading-none tracking-tight",
          tone.text,
        )}
      >
        {topic}
      </span>
    </div>
  );
}

/** Hamkor logotipi örni: böyalgan maydon va taşkilot nomi. */
export function PartnerLogoPlaceholder({
  name,
  accent = "blue",
  className,
}: {
  name: string;
  accent?: Accent;
  className?: string;
}) {
  const tone = TONE[accent];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "lines-2 block w-full text-center font-display text-[0.98rem] font-bold leading-[1.35]",
        tone.text,
        className,
      )}
    >
      {name}
    </span>
  );
}
