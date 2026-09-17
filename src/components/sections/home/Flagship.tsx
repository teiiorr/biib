import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ExternalButton } from "@/components/ui/LinkButton";
import { flagshipProject, pick } from "@/content";
import type { Locale } from "@/i18n/locales";

/** Boş loyiha. Qattiq panel: şişa bu yerda kerak emas. */
export function Flagship() {
  const t = useTranslations("home.flagship");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const project = flagshipProject();

  return (
    <section className="page pb-4" aria-labelledby="home-flagship">
      <div className="overflow-hidden rounded-xl bg-elevated shadow-[inset_0_0_0_0.5px_var(--separator)]">
        <div className="grid items-stretch lg:grid-cols-[1.05fr_1fr]">
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-80">
            <Image
              src="/brand/upop-banner.jpg"
              alt={t("bannerAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 p-6 md:p-8">
            {/* Tabiiy ölçam 900×703. Noto'g'ri nisbat berilsa rasm çözilib ketadi. */}
            <Image
              src="/brand/upop-logo.png"
              alt=""
              width={900}
              height={703}
              sizes="160px"
              /* self-start bölmasa flex ustun rasmni kengligiga çözadi. */
              className="h-auto w-40 self-start"
            />

            <h2 id="home-flagship" className="sr-only">
              {t("heading")}
            </h2>

            <p className="text-body text-label-secondary">{t("lead")}</p>

            <ul className="flex flex-col gap-1.5 text-callout text-label-secondary">
              {pick(project.facts, locale).map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>

            {project.external ? (
              <div className="mt-auto flex justify-end pt-2">
                <ExternalButton
                  href={project.external.href}
                  newTabLabel={tCommon("opensInNewTab")}
                  size="lg"
                >
                  {t("cta")}
                </ExternalButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
