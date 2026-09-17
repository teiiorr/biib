import { useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { pick } from "@/content";
import type { ProjectItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

export function ProjectCard({ project, className }: { project: ProjectItem; className?: string }) {
  const locale = useLocale() as Locale;

  return (
    <Card as="article" className={cn("flex flex-col gap-3 p-5", className)}>
      <h3 className="text-title3">{pick(project.name, locale)}</h3>
      <p className="text-callout text-label-secondary">{pick(project.tagline, locale)}</p>

      <ul className="mt-1 flex flex-col gap-1 text-footnote text-label-secondary">
        {pick(project.facts, locale).map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </Card>
  );
}
