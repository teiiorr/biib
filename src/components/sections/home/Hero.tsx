import { useTranslations } from "next-intl";
import { GoldText } from "@/components/brand/GoldText";
import { LogoScene } from "@/components/brand/LogoScene";
import { Reveal } from "@/components/brand/Reveal";
import { Aura, Girih } from "@/components/brand/Texture";
import { LinkButton } from "@/components/ui/LinkButton";
import { BRAND_NAME } from "@/content/org";

/**
 * Ekranga çiqiş: çapda matn, öngda jonli 3D belgi.
 * Bölimning muallif jesti — belgining özi; qolgani sokin.
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate overflow-hidden">
      <Girih className="opacity-[0.04]" />
      <Aura className="-right-[18%] -top-[42%] w-[min(86vw,780px)] md:-right-[6%]" />

      <div className="page relative grid items-center gap-10 pb-14 pt-10 md:pb-20 md:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div>
          <Reveal as="header">
            <h1 className="max-w-[16ch] text-title1 md:text-display">
              {t("titleStart")} <GoldText>{t("titleAccent")}</GoldText>
            </h1>

            <p className="read mt-5 text-body text-label-secondary">{t("subtitle")}</p>
          </Reveal>

          <Reveal delay={140} className="mt-9 flex flex-wrap items-center justify-end gap-3">
            <LinkButton href="/projects" variant="secondary" size="lg">
              {t("ctaSecondary")}
            </LinkButton>
            <LinkButton href="/contacts" size="lg">
              {t("ctaPrimary")}
            </LinkButton>
          </Reveal>
        </div>

        <Reveal delay={100} className="order-first lg:order-none">
          <LogoScene
            label={BRAND_NAME.full}
            className="mx-auto max-w-[15rem] sm:max-w-[17rem] lg:max-w-[22rem]"
          />
        </Reveal>
      </div>
    </section>
  );
}
