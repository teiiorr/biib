import { useLocale } from "next-intl";
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

const DOT: Record<Accent, string> = {
  sun: "bg-sun-ink",
  coral: "bg-coral-ink",
  grass: "bg-grass-ink",
  pink: "bg-pink-ink",
  grape: "bg-grape-ink",
  blue: "bg-blue-deep",
};

export function ProjectTile({
  project,
  className,
}: {
  project: ProjectItem;
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
      <div className={cn("flex h-[8.5rem] flex-col justify-end gap-3 p-6", PANEL[project.accent])}>
        <span aria-hidden="true" className={cn("h-1.5 w-12 rounded-full", DOT[project.accent])} />
        <h3 className="lines-2 text-[1.42rem] leading-[1.15] tracking-tight sm:text-[1.5rem]">
          {pick(project.name, locale)}
        </h3>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="lines-2 text-[1.02rem] leading-[1.5] text-ink-2">
          {pick(project.tagline, locale)}
        </p>

        <ul className="mt-auto flex flex-col gap-2.5 border-t border-line pt-5">
          {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={cn("mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full", DOT[project.accent])}
              />
              <span className="lines-2 text-[0.98rem] leading-[1.5] text-ink-muted sm:lines-1">{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
