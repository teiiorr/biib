import { useLocale } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { PersonPortrait } from "./PersonPortrait";
import { pick } from "@/content";
import type { Person } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/**
 * Rasmiy röyxat: qatʼiy tör, ingiçka çegara, böyoq deyarli yöq.
 * "council" — ixçam tör, "leadership" — kengroq va issiqroq.
 */
export function PeopleRoster({
  people,
  variant,
  roleLabel,
}: {
  people: readonly Person[];
  variant: "council" | "leadership";
  roleLabel: string;
}) {
  const locale = useLocale() as Locale;
  const council = variant === "council";

  return (
    <ul
      className={cn(
        "row-even grid gap-x-6 gap-y-10",
        council ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {people.map((person, index) => (
        <li key={person.id}>
          <Reveal
            delay={(index % 3) * 90}
            className={cn(
              "flex gap-5",
              council ? "flex-col sm:flex-row sm:items-start" : "flex-col sm:flex-row",
            )}
          >
            <PersonPortrait
              person={person}
              index={index}
              shape={council ? "circle" : "square"}
              className={cn("shrink-0", council ? "w-28 sm:w-32" : "w-full sm:w-44")}
            />

            <div className="flex flex-col gap-1.5">
              <h3 className={cn("lines-2 leading-[1.25]", council ? "text-[1.2rem]" : "text-[1.34rem]")}>
                {pick(person.name, locale)}
              </h3>
              <p className="lines-1 text-[0.98rem] font-semibold leading-[1.5] text-blue-deep">
                <span className="sr-only">{roleLabel}: </span>
                {pick(person.role, locale)}
              </p>
              <p className="lines-3 mt-1 text-[1rem] leading-[1.6] text-ink-2">
                {pick(person.bio, locale)}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
