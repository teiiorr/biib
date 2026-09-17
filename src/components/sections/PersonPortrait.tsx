import Image from "next/image";
import { useLocale } from "next-intl";
import { PortraitPlaceholder } from "@/components/brand/Placeholder";
import { pick } from "@/content";
import type { Person } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

export function PersonPortrait({
  person,
  shape = "square",
  className,
}: {
  person: Person;
  shape?: "circle" | "square";
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const name = pick(person.name, locale);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-graphite shadow-[inset_0_0_0_0.5px_var(--line-gold)]",
        shape === "circle" ? "aspect-square rounded-pill" : "aspect-[4/5] rounded-md",
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
        <PortraitPlaceholder name={name} />
      )}
    </div>
  );
}
