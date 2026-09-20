import { useLocale } from "next-intl";
import { GemBullet, GemCard } from "@/components/ui/GemCard";
import { pick } from "@/content";
import type { ProjectItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/** Ölçamlar kartaning öz kengligiga qarab ösadi, ekranga emas. */
export function ProjectCard({
  project,
  className,
}: {
  project: ProjectItem;
  className?: string;
}) {
  const locale = useLocale() as Locale;

  return (
    <GemCard accent={project.accent} className={cn("min-h-72", className)}>
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-[calc(var(--ravoq-h,74px)-28px)] @[20rem]:px-8 @[20rem]:pb-8">
        <h3 className="text-title3 @[20rem]:text-title2">{project.name[locale]}</h3>
        <p className="text-callout text-accent-text @[20rem]:text-body">
          {pick(project.tagline, locale)}
        </p>

        <ul className="mt-auto flex flex-col gap-2.5 pt-3">
          {pick(project.facts, locale).map((fact) => (
            <li
              key={fact}
              className="flex gap-3 text-footnote text-label-secondary @[20rem]:text-callout"
            >
              <GemBullet />
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </GemCard>
  );
}
