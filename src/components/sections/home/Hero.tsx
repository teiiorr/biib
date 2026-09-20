import { useTranslations } from "next-intl";
import { GoldText } from "@/components/brand/GoldText";
import { HeroArch } from "@/components/brand/HeroArch";
import { LivingVideo, VideoToggle } from "@/components/brand/LivingVideo";
import { Reveal } from "@/components/brand/Reveal";
import { Aura } from "@/components/brand/Texture";
import { LinkButton } from "@/components/ui/LinkButton";
import { BRAND_NAME } from "@/content/org";
import type { CSSProperties } from "react";

/**
 * Qahramon — jonli sahna. Töliq ekranda UPOP sahnasining jonli kadri
 * (poster darrov, video kadrga kirgaç oçiladi; reduced-motion da surat
 * qoladi). Ustida ravoq darvozasi ostidagi serif nom qatorma-qatorma
 * kötariladi, skrollda sahna suzib ketadi — kinematografiya, his.
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Jonli sahna: nafas oladigan fon. */}
      <div aria-hidden="true" className="hero-bg absolute inset-0 -z-10">
        <LivingVideo src="/brand/upop-live.mp4" poster="/brand/upop-scene.jpg" posterAlt="" control />
      </div>

      {/* Parda: tepada yengil, matn turgan pastda zich — kontrast AA. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(5_12_20/0.5)_0%,rgb(5_12_20/0.12)_30%,rgb(5_12_20/0.22)_55%,rgb(5_12_20/0.74)_78%,rgb(5_12_20/0.92)_100%)]"
      />

      {/* Video pauzasi — WCAG 2.2.2. Media qatlami aria-hidden, tugma emas. */}
      <div className="page pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-end">
        <VideoToggle
          pauseLabel={t("videoPause")}
          playLabel={t("videoPlay")}
          className="pointer-events-auto"
        />
      </div>

      <div className="hero-stage flex flex-1 flex-col">
        <div className="page relative flex flex-1 flex-col items-center justify-end pb-4 text-center">
          {/* Nom ortidagi samosvet aurasi — ekranda bittasi (§16.5). */}
          <Aura className="hero-aura" />

          <HeroArch>
            <h1
              lang="uz-Latn"
              className="text-balance font-semibold uppercase leading-[1.04] tracking-[0.05em] text-label text-[clamp(2.2rem,6.4vw,5rem)]"
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

          <Reveal delay={520} className="relative mt-5">
            <p className="read text-body text-label-secondary">{t("subtitle")}</p>
          </Reveal>
        </div>

        {/*
         * Tugmalar sarlavha öqiga markazlanadi — butun qahramon bitta
         * marosim ustunida. Mobilda ustma-ust: asosiy tugma tepada,
         * desktopda row-reverse uni öngga qöyadi (öqiş tartibi saqlanadi).
         */}
        <Reveal
          delay={640}
          className="page flex flex-col items-center gap-3 pb-10 pt-6 sm:flex-row-reverse sm:justify-center"
        >
          <LinkButton href="/contacts" size="lg" className="w-full justify-center sm:w-auto">
            {t("ctaPrimary")}
          </LinkButton>
          <LinkButton
            href="/projects"
            variant="secondary"
            size="lg"
            className="w-full justify-center sm:w-auto"
          >
            {t("ctaSecondary")}
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
