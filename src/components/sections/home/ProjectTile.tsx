import { useLocale } from "next-intl";
import { Doodle } from "@/components/brand/Doodle";
import { pick } from "@/content";
import type { Accent, ProjectItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/**
 * Loyiha kartasi. Balandliklar qatʼiy: sarlavha maydoni bir xil,
 * izoh ikki qator, faktlar pastda. Matn uzun bölsa kesiladi —
 * qatordagi kartalar hamma tilda bir çiziqda turadi.
 */

const PANEL: Record<Accent, string> = {
  sun: "bg-sun-soft",
  coral: "bg-coral-soft",
  grass: "bg-grass-soft",
  pink: "bg-pink-soft",
  grape: "bg-grape-soft",
  blue: "bg-blue-soft",
};

const MARK: Record<Accent, string> = {
  sun: "text-sun-ink",
  coral: "text-coral-ink",
  grass: "text-grass-ink",
  pink: "text-pink-ink",
  grape: "text-grape-ink",
  blue: "text-blue-deep",
};

const DOT: Record<Accent, string> = {
  sun: "text-sun",
  coral: "text-coral",
  grass: "text-grass",
  pink: "text-pink",
  grape: "text-grape",
  blue: "text-blue",
};

/** Har loyihaga öz belgisi — kartalar bir-biriga öxşab qolmasin. */
const SIGN = ["star", "brush", "note", "book"] as const;

export function ProjectTile({
  project,
  index,
  className,
}: {
  project: ProjectItem;
  index: number;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const facts = pick(project.facts, locale);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft",
        "transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)]",
        "hover:-translate-y-1.5 hover:shadow-lift",
        className,
      )}
    >
      <div className={cn("flex h-[8.5rem] items-end justify-between gap-4 p-6", PANEL[project.accent])}>
        <h3 className="lines-2 text-[1.42rem] leading-[1.15] tracking-tight sm:text-[1.5rem]">
          {pick(project.name, locale)}
        </h3>
        <Doodle
          name={SIGN[index % SIGN.length] ?? "star"}
          className={cn(
            "h-8 w-8 shrink-0 transition-transform duration-500 ease-[var(--ease-pop)]",
            "group-hover:-rotate-12 group-hover:scale-110",
            MARK[project.accent],
          )}
          strokeWidth={2.2}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="lines-2 text-[1.02rem] leading-[1.5] text-ink-2">
          {pick(project.tagline, locale)}
        </p>

        <ul className="mt-auto flex flex-col gap-2.5 border-t border-line pt-5">
          {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-2.5">
              <Doodle
                name="spark"
                className={cn("mt-[0.3rem] h-3.5 w-3.5 shrink-0", DOT[project.accent])}
              />
              <span className="lines-2 text-[0.98rem] leading-[1.5] text-ink-muted sm:lines-1">{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
