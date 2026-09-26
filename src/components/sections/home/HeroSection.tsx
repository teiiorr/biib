import { preload } from "react-dom";

import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { LinkButton } from "@/components/ui/LinkButton";
import { Picture } from "@/components/ui/Picture";
import { HERO_LOGO_OVERLAY, HERO_MEDIA, HERO_PORTRAIT_MEDIA } from "@/content/brand";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { heroFontPreload } from "@/lib/fonts";

import { HeroEnter } from "./HeroEnter";
import { HeroTitle } from "./HeroTitle";

interface HeroSectionProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/* Tik boʻlmagan hamma ekran 16:9 posterni oladi; preload media <source> bilan bir xil boʻlishi shart. */
const LANDSCAPE_MEDIA = `not (${HERO_PORTRAIT_MEDIA})`;

/**
 * Darvoza: egasining videosi (belgi kadr markazida), nom kadr ostida markazda, ikki harakat uning
 * ostida oʻng chetda. Poster serverda va LCP; video badiiy uyadan boʻsh vaqtda keladi.
 * Kadr ikkala mavzuda ham qorongʻi: ohang doim «dark», matn --hero-ink, ostida lojuvard ostlik.
 */
export function HeroSection({ locale, dict }: HeroSectionProps) {
  const { landscape, portrait } = HERO_MEDIA;
  preload(heroFontPreload(locale), { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload(portrait.poster, { as: "image", fetchPriority: "high", media: HERO_PORTRAIT_MEDIA });
  preload(landscape.poster, { as: "image", fetchPriority: "high", media: LANDSCAPE_MEDIA });

  return (
    <section
      className="home-hero"
      data-hero=""
      data-audit=""
      data-testid="portal-scene"
      aria-labelledby="hero-title"
    >
      <HeroEnter />
      <div className="home-hero-art">
        {/* Ohang faqat shu qatlamda: kadr ikkala mavzuda qorongʻi, sarlavha oynasi shuni oʻqiydi. */}
        <div className="home-hero-media" data-hero-media="" data-tone="dark" aria-hidden="true">
          <picture className="home-hero-picture">
            <source media={HERO_PORTRAIT_MEDIA} srcSet={portrait.poster} type="image/avif" />
            <img
              src={landscape.poster}
              width={landscape.width}
              height={landscape.height}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="home-hero-poster"
            />
          </picture>
        </div>
        {/* Video tavsifi (aria-label) oʻqilishi uchun uya aria-hidden emas. */}
        <DesignArt
          slot="home-hero"
          meaningful
          className="home-hero-slot"
          copy={{
            videoAlt: dict.home.hero.videoAlt,
            pauseLabel: dict.common.actions.pause,
            playLabel: dict.common.actions.play,
          }}
        />
      </div>
      <div className="home-hero-dim" data-hero-dim="" aria-hidden="true" />
      <div className="home-hero-content" data-hero-content="">
        <Container className="home-hero-grid">
          <HeroTitle name={dict.common.brand.name} />
          <div className="home-hero-actions">
            <LinkButton href={pathFor(locale, "projects")} variant="primary" size="56">
              {dict.home.hero.ctaProjects}
            </LinkButton>
            <LinkButton href={pathFor(locale, "about")} variant="glass" size="56">
              {dict.home.hero.ctaAbout}
            </LinkButton>
            {/* Halqa boshqaruvi shu uyaga portal bilan keladi: harakatlar qatorida, hech narsa ustida emas. */}
            <span className="home-hero-control" data-hero-control="" />
          </div>
        </Container>
      </div>
      {/* Sahna belgisi: kadrdagi oq doira bilan bir xil chizma, skrollda sarlavha belgisiga qoʻnadi. */}
      <Picture
        src={HERO_LOGO_OVERLAY.src}
        width={HERO_LOGO_OVERLAY.size}
        height={HERO_LOGO_OVERLAY.size}
        alt=""
        className="home-hero-logo"
        attrs={{ "data-hero-logo": "" }}
        ariaHidden
      />
    </section>
  );
}
