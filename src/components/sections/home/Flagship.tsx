import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { flagshipProject, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/**
 * Boş loyiha — UPOP TREND. Qoronği sahna paneli: rang ikkala mavzuda
 * bir xil, çunki bu loyihaning öz brendi.
 *
 * Banner çapga qirqilgan (object-left): öng tomonida logotip bor edi,
 * u sarlavhadagi logotip bilan takrorlanib qolmasin.
 */
export function Flagship() {
  const t = useTranslations("home.flagship");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const project = flagshipProject();

  return (
    <section id="flagship" className="scroll-mt-24 pt-4 sm:pt-8">
      <div className="page-w page-x">
        <Reveal pop>
          <div className="overflow-hidden rounded-[1.75rem] bg-stage-bg sm:rounded-[2.25rem]">
            <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch lg:gap-12 lg:p-9">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <Image
                  src="/brand/upop-banner.jpg"
                  alt={t("bannerAlt")}
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover object-left"
                />
              </div>

              <div className="pb-3 lg:py-4 lg:pr-4">
                <h2>
                  <Image
                    src="/brand/upop-logo.png"
                    alt={t("heading")}
                    width={900}
                    height={703}
                    sizes="(max-width: 640px) 190px, 230px"
                    className="h-auto w-[11.5rem] sm:w-[14rem]"
                  />
                </h2>

                <p className="mt-6 max-w-[52ch] text-[1.04rem] leading-relaxed text-stage-ink-2 sm:text-[1.1rem]">
                  {t("lead")}
                </p>

                <ul className="mt-7 flex flex-col divide-y divide-stage-line border-y border-stage-line">
                  {pick(project.facts, locale).map((fact) => (
                    <li key={fact} className="flex items-start gap-3 py-3.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-sun"
                      />
                      <span className="lines-2 text-[1rem] leading-[1.5] text-stage-ink">
                        {fact}
                      </span>
                    </li>
                  ))}
                </ul>

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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
