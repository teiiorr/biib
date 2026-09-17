import { useTranslations } from "next-intl";
import { GoldText } from "@/components/brand/GoldText";
import { Reveal } from "@/components/brand/Reveal";
import { Aura, Girih } from "@/components/brand/Texture";
import { LinkButton } from "@/components/ui/LinkButton";

/**
 * Ekranga çiqiş: aura, oltin kalit söz, ikki çaqiruv.
 * Bölimning yagona muallif jesti — aura; qolgani sokin.
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate overflow-hidden">
      <Girih className="opacity-[0.04]" />
      <Aura className="-right-[18%] -top-[42%] w-[min(86vw,780px)] md:-right-[6%]" />

      <div className="page relative pb-14 pt-12 md:pb-20 md:pt-20">
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
    </section>
  );
}
