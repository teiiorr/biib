import { useLocale, useTranslations } from "next-intl";
import { Doodle } from "@/components/brand/Doodle";
import { Icon } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { Button } from "@/components/ui/Button";
import { flagshipProject, pick } from "@/content";
import type { Locale } from "@/i18n/locales";

/** Boş loyiha — UPOP TREND. Böyalgan keng lavha, ikki ustun. */
export function Flagship() {
  const t = useTranslations("home.flagship");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const project = flagshipProject();

  return (
    <section id="flagship" className="scroll-mt-24 pt-4 sm:pt-8">
      <div className="page-w page-x">
        <Reveal pop>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-coral-soft sm:rounded-[2.25rem]">
            <div className="grid gap-9 p-7 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14 lg:p-14">
              <div>
                <h2 className="flex flex-wrap items-center gap-3 text-[clamp(2.1rem,5.4vw,3.4rem)] tracking-tight">
                  {t("heading")}
                  <Doodle
                    name="spark"
                    title={t("note")}
                    className="h-7 w-7 text-coral-ink sm:h-9 sm:w-9"
                  />
                </h2>

                <p className="mt-5 max-w-[54ch] text-[1.06rem] leading-relaxed text-ink-2 sm:text-[1.14rem]">
                  {t("lead")}
                </p>

                {project.external ? (
                  <Button asChild size="lg" className="mt-8">
                    <a href={project.external.href} target="_blank" rel="noreferrer noopener">
                      {t("cta")}
                      <span className="opacity-80">{project.external.label}</span>
                      <Icon name="arrow-out" className="h-[1.05rem] w-[1.05rem]" />
                      <span className="sr-only">({tCommon("opensInNewTab")})</span>
                    </a>
                  </Button>
                ) : null}
              </div>

              <ul className="flex flex-col divide-y divide-line border-y border-line lg:mt-2">
                {pick(project.facts, locale).map((fact) => (
                  <li key={fact} className="flex items-start gap-3 py-4">
                    <Doodle name="spark" className="mt-[0.35rem] h-4 w-4 shrink-0 text-coral" />
                    <span className="lines-2 text-[1.02rem] leading-[1.5] text-ink">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
