import { getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import { GoldText } from "@/components/brand/GoldText";
import { HeroArch } from "@/components/brand/HeroArch";
import { HeroLive } from "@/components/brand/HeroLive";
import { Reveal } from "@/components/brand/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { BRAND_NAME } from "@/content/org";
import type { CSSProperties } from "react";

/**
 * Olovli qahramon: butun ekran. Oq belgi qimirlamaydi — atrofidagi
 * olov va uçqunlar Higgsfield videosida uzluksiz yonadi. Nomi niqob
 * içidan qatorma-qator kötariladi, skrollda sahna suzib ketadi.
 * Fon ikki yönalişda alohida kadr.
 */
export function Hero() {
  const t = useTranslations("home.hero");

  const shared = { alt: "", sizes: "100vw", quality: 88 };
  const { props: mobile } = getImageProps({
    ...shared,
    src: "/brand/hero-fire-mobile.jpg",
    width: 1080,
    height: 1920,
  });
  const { props: desktop } = getImageProps({
    ...shared,
    src: "/brand/hero-fire.jpg",
    width: 1920,
    height: 1080,
  });

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Fon: poster darrov, skroll-video tayyor bölgaç ustiga çiqadi. */}
      <div aria-hidden="true" className="hero-bg absolute inset-0 -z-10">
        <picture className="absolute inset-0">
          <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes="100vw" />
          <img
            {...desktop}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        <HeroLive desktopBase="/brand/hero-logo-d" mobileBase="/brand/hero-logo-m" />
      </div>

      {/* Parda pastda — matn şu yerda turadi, belgi tepada oçiq qoladi. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_20_28/0.34)_0%,rgb(6_20_28/0.04)_26%,rgb(6_20_28/0.1)_52%,rgb(6_20_28/0.62)_76%,rgb(6_20_28/0.85)_100%)]"
      />

      <div className="hero-stage flex flex-1 flex-col">
        <div className="page flex flex-1 flex-col items-center justify-end pb-4 text-center">
          <HeroArch>
            <h1
              lang="uz-Latn"
              className="text-balance font-semibold uppercase leading-[1.06] tracking-[0.04em] text-label text-[clamp(1.8rem,5.8vw,4.2rem)]"
            >
              <span className="hero-line">
                <span style={{ "--line-delay": "160ms" } as CSSProperties}>{BRAND_NAME.line1}</span>
              </span>
              <span className="hero-line">
                <span style={{ "--line-delay": "360ms" } as CSSProperties}>
                  <GoldText>{BRAND_NAME.line2}</GoldText>
                </span>
              </span>
            </h1>
          </HeroArch>

          <Reveal delay={520} className="mt-5">
            <p className="read text-body text-label-secondary">{t("subtitle")}</p>
          </Reveal>
        </div>

        <Reveal delay={640} className="page flex flex-wrap items-center justify-end gap-3 pb-9 pt-5">
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
