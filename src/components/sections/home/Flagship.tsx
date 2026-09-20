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
 * Boş loyiha. Katta jonli kadr romda, yonida faqat logotip — orasida
 * ingiçka oltin ayirgiç; matn esa pastda, töliq kenglikda. Video
 * Higgsfield orqali jonlantirilgan; reduced-motion da surat qoladi.
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
      className="section"
    >
      <div className="page">
        <h2 id="home-flagship" className="sr-only">
          {t("heading")}
        </h2>

        <div className="grid gap-y-9 lg:grid-cols-[1.6fr_auto_0.9fr] lg:items-center lg:gap-x-10">
          {/*
           * Katta logotip joyi. Mijoz yangi faylni bergaç şu Image
           * almaştiriladi — ölçam va örin şu yerda qoladi.
           */}
          <div
            id="flagship-logo-slot"
            className="flex justify-center lg:order-3 lg:col-start-3"
          >
            <Reveal>
              <Image
                src="/brand/upop-logo.png"
                alt=""
                width={900}
                height={703}
                sizes="(max-width: 768px) 52vw, 300px"
                className="h-auto w-[min(52vw,15rem)] lg:w-[min(20vw,18rem)]"
              />
            </Reveal>
          </div>

          {/* Rom bilan logotip orasidagi ingiçka oltin ayirgiç. */}
          <div
            aria-hidden="true"
            className="hidden lg:order-2 lg:col-start-2 lg:block lg:h-[72%] lg:w-px lg:self-center lg:bg-[linear-gradient(180deg,transparent,rgb(201_162_90/0.55),transparent)]"
          />

          {/* Jonli kadr romda: şişa qirra, atrofida yumşoq şuʼla. */}
          <Reveal className="lg:order-1 lg:col-start-1">
            <figure className="media-frame glass glass-card relative isolate rounded-xl p-2.5 sm:p-3">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <LivingVideo
                  src="/brand/upop-live.mp4"
                  poster="/brand/upop-scene.jpg"
                  posterAlt={t("bannerAlt")}
                />
              </div>
              <figcaption className="sr-only">{t("bannerAlt")}</figcaption>
            </figure>
          </Reveal>

          {/* Matn pastda, töliq kenglikda. */}
          <div className="lg:order-4 lg:col-span-3">
            <Reveal>
              <p className="read text-body text-label md:text-headline">{t("lead")}</p>

              <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
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
                  className="w-full justify-center sm:w-auto"
                >
                  {t("cta")}
                </ExternalButton>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
