import { useLocale } from "next-intl";
import { PersonPortrait } from "./PersonPortrait";
import { pick } from "@/content";
import type { Person } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/** Rasmiy röyxat: qatʼiy tör, ingiçka ajratgiç, bezak yöq. */
export function PeopleRoster({
  people,
  roleLabel,
  className,
}: {
  people: readonly Person[];
  roleLabel: string;
  className?: string;
}) {
  const locale = useLocale() as Locale;

  return (
    <ul className={cn("grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {people.map((person) => (
        <li key={person.id} className="flex gap-4">
          <PersonPortrait person={person} className="w-24 shrink-0 sm:w-28" />
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-headline">{pick(person.name, locale)}</h3>
            <p className="text-footnote text-accent-text">
              <span className="sr-only">{roleLabel}: </span>
              {pick(person.role, locale)}
            </p>
            <p className="mt-1 text-callout text-label-secondary">{pick(person.bio, locale)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
