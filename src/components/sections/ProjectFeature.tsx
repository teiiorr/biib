import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { pick } from "@/content";
import type { Accent, ProjectItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/**
 * Loyihalar sahifasidagi keng lavha. Üç xil ritm: böyalgan panel,
 * oçiq maydon va böyalgan sarlavha ustuni. İç tuzilişi barçasida bir xil,
 * şuning uçun sarlavha, izoh va faktlar hamma joyda bir çiziqda turadi.
 */

const PANEL: Record<Accent, string> = {
  sun: "bg-sun-soft",
  coral: "bg-coral-soft",
  grass: "bg-grass-soft",
  pink: "bg-pink-soft",
  grape: "bg-grape-soft",
  blue: "bg-blue-soft",
};

const BAR: Record<Accent, string> = {
  sun: "bg-sun",
  coral: "bg-coral",
  grass: "bg-grass",
  pink: "bg-pink",
  grape: "bg-grape",
  blue: "bg-blue",
};

export type FeatureVariant = "panel" | "open" | "offset";

export function ProjectFeature({
  project,
  variant,
  index,
}: {
  project: ProjectItem;
  variant: FeatureVariant;
  index: number;
}) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const head = (
    <Reveal>
      <div
        className={cn(
          variant === "offset" &&
            cn("rounded-[1.5rem] border border-line p-7 sm:p-9", PANEL[project.accent]),
        )}
      >
        <span
          aria-hidden="true"
          className={cn("block h-1.5 w-14 rounded-full", BAR[project.accent])}
        />

        <h2 className="mt-5 text-[clamp(1.85rem,4.4vw,2.7rem)] tracking-tight">
          {pick(project.name, locale)}
        </h2>

        <p className="mt-3 text-[1.1rem] font-semibold leading-[1.5] text-ink">
          {pick(project.tagline, locale)}
        </p>
      </div>
    </Reveal>
  );

  const body = (
    <div>
      <div className="flex flex-col gap-4 text-[1.04rem] leading-relaxed text-ink-2">
        {pick(project.body, locale).map((paragraph, i) => (
          <Reveal key={paragraph} delay={90 + i * 70}>
            <p>{paragraph}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300}>
        <div className="mt-7 border-t border-line pt-5">
          <h3 className="font-display text-[0.9rem] font-extrabold uppercase tracking-wide text-ink-muted">
            {t("factsLabel")}
          </h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {pick(project.facts, locale).map((fact) => (
              <li key={fact} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={cn("mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full", BAR[project.accent])}
                />
                <span className="lines-2 text-[1rem] leading-[1.5] text-ink-2">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {project.external ? (
        <Reveal delay={360} pop>
          <a
            href={project.external.href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(buttonVariants({ size: "lg" }), "mt-7")}
          >
              {t("visitSite")}
              <span className="opacity-80">{project.external.label}</span>
              <Icon name="arrow-out" className="h-[1.05rem] w-[1.05rem]" />
              <span className="sr-only">({tCommon("opensInNewTab")})</span>
          </a>
        </Reveal>
      ) : null}
    </div>
  );

  return (
    <section
      aria-label={pick(project.name, locale)}
      className={cn(
        variant === "panel" ? "py-4" : "section-y",
        index > 0 && variant === "open" && "border-t border-line",
      )}
    >
      <div className="page-w page-x">
        <div
          className={cn(
            variant === "panel" &&
              cn(
                "rounded-[1.75rem] border border-line p-7 sm:rounded-[2.25rem] sm:p-10 lg:p-14",
                PANEL[project.accent],
              ),
          )}
        >
          <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
            {head}
            {body}
          </div>
        </div>
      </div>
    </section>
  );
}
