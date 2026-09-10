import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { flagshipProject, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

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
                <span aria-hidden="true" className="block h-1.5 w-14 rounded-full bg-coral-ink" />

                <h2 className="mt-5 text-[clamp(2.1rem,5.4vw,3.4rem)] tracking-tight">
                  {t("heading")}
                </h2>

                <p className="mt-5 max-w-[54ch] text-[1.06rem] leading-relaxed text-ink-2 sm:text-[1.14rem]">
                  {t("lead")}
                </p>

                {project.external ? (
                  <a
                    href={project.external.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(buttonVariants({ size: "lg" }), "mt-8")}
                  >
                      {t("cta")}
                      <span className="opacity-80">{project.external.label}</span>
                      <Icon name="arrow-out" className="h-[1.05rem] w-[1.05rem]" />
                      <span className="sr-only">({tCommon("opensInNewTab")})</span>
                  </a>
                ) : null}
              </div>

              <ul className="flex flex-col divide-y divide-line border-y border-line lg:mt-2">
                {pick(project.facts, locale).map((fact) => (
                  <li key={fact} className="flex items-start gap-3 py-4">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral-ink"
                    />
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
