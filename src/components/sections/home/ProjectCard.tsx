import { useLocale } from "next-intl";
import { GemBullet, GemCard } from "@/components/ui/GemCard";
import { pick } from "@/content";
import type { ProjectItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

export function ProjectCard({
  project,
  index,
  className,
}: {
  project: ProjectItem;
  index: number;
  className?: string;
}) {
  const locale = useLocale() as Locale;

  return (
    <GemCard accent={project.accent} index={index} className={cn("flex flex-col", className)}>
      <div className="flex flex-1 flex-col gap-3 p-5 pt-6 sm:p-6 sm:pt-7">
        <h3 className="max-w-[80%] text-title3">{project.name[locale]}</h3>
        <p className="text-callout text-accent-text">{pick(project.tagline, locale)}</p>

        <ul className="mt-auto flex flex-col gap-2 pt-2">
          {pick(project.facts, locale).map((fact) => (
            <li key={fact} className="flex gap-2.5 text-footnote text-label-secondary">
              <GemBullet />
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </GemCard>
  );
}
