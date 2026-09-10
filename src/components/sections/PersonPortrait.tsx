import Image from "next/image";
import { useLocale } from "next-intl";
import { PortraitPlaceholder } from "@/components/brand/Placeholder";
import { pick } from "@/content";
import type { Accent, Person } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/** Rasmiy bölimlar uçun portret. Böyoq bu yerda sokin, tör qatʼiy. */

const CYCLE: readonly Accent[] = ["blue", "sun", "grass", "coral", "grape", "pink"];

export function PersonPortrait({
  person,
  index,
  shape = "circle",
  className,
}: {
  person: Person;
  index: number;
  shape?: "circle" | "square";
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const accent = CYCLE[index % CYCLE.length] ?? "blue";
  const name = pick(person.name, locale);

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-surface-2",
        shape === "circle" ? "aspect-square rounded-full" : "aspect-[4/5] rounded-card",
        className,
      )}
    >
      {person.photo ? (
        <Image
          src={person.photo}
          alt={name}
          fill
          sizes="(max-width: 640px) 45vw, 220px"
          className="object-cover"
        />
      ) : (
        <PortraitPlaceholder name={name} accent={accent} />
      )}
    </div>
  );
}
