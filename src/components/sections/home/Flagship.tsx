import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LivingVideo } from "@/components/brand/LivingVideo";
import { Reveal } from "@/components/brand/Reveal";
import { GemBullet } from "@/components/ui/GemCard";
import { ExternalButton } from "@/components/ui/LinkButton";
import { flagshipProject, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import type { CSSProperties } from "react";

/**
 * Boş loyiha — butun ekranli jonli sahna. Fondagi surat Higgsfield
 * orqali jonlantirilgan: qizlar nafas oladi, soçlar sekin tebranadi.
 * prefers-reduced-motion da faqat asl surat qoladi.
 */
export function Flagship() {
  const t = useTranslations("home.flagship");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const project = flagshipProject();

  return (
    <section
      aria-labelledby="home-flagship"
      style={{ "--gem": "var(--magenta)", "--gem-line": "var(--magenta-line)" } as CSSProperties}
      className="relative isolate overflow-hidden"
    >
      <LivingVideo
        src="/brand/upop-live.mp4"
        poster="/brand/upop-scene.jpg"
        posterAlt={t("bannerAlt")}
      />

      {/* Matn ostidagi zich parda: video har qançalik yorugʻ bölsa ham
          pastki üçdan bir qismida kontrast kafolatlanadi. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_28_38/0.22)_0%,rgb(10_28_38/0.06)_38%,rgb(10_28_38/0.55)_66%,rgb(10_28_38/0.94)_88%)]"
      />

      <div className="page relative z-10 flex min-h-[100svh] flex-col">
        <h2 id="home-flagship" className="sr-only">
          {t("heading")}
        </h2>

        {/*
         * Katta logotip joyi. Mijoz yangi faylni bergaç şu Image
         * almaştiriladi — ölçam va örin şu yerda qoladi.
         */}
        <div id="flagship-logo-slot" className="flex flex-1 items-center justify-center py-20">
          <Reveal>
            <Image
              src="/brand/upop-logo.png"
              alt=""
              width={900}
              height={703}
              sizes="(max-width: 768px) 60vw, 380px"
              className="h-auto w-[min(58vw,24rem)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
            />
          </Reveal>
        </div>

        <div className="pb-12 md:pb-16">
          <Reveal className="max-w-xl">
            <p className="text-body text-label md:text-headline">{t("lead")}</p>

            <ul className="mt-5 flex flex-col gap-2">
              {pick(project.facts, locale).map((fact) => (
                <li key={fact} className="flex gap-2.5 text-callout text-label-secondary">
                  <GemBullet />
                  {fact}
                </li>
              ))}
            </ul>
          </Reveal>

          {project.external ? (
            <Reveal delay={120} className="mt-7 flex justify-end">
              <ExternalButton
                href={project.external.href}
                newTabLabel={tCommon("opensInNewTab")}
                size="lg"
              >
                {t("cta")}
              </ExternalButton>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
