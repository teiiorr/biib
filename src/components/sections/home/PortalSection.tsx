"use client";

import { useRef } from "react";

import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { usePortalScene } from "@/components/motion/usePortalScene";
import { Ravoq } from "@/components/ornament/Ravoq";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";

import { KeyWords } from "./KeyWords";

interface PortalSectionProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Portal sahnasi: butun ekranli ipak oʻngdagi ravoq oynasiga yigʻiladi, chapda missiya koʻtariladi.
 * Pin ≤150% (kompyuter) / ≤100% (telefon), scrub 0.8, oddiy skroll doim ishlaydi.
 */
export function PortalSection({ locale, dict }: PortalSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  usePortalScene(ref, {
    length: 1.4,
    build: (tl, scope) => {
      const window_ = scope.querySelector<HTMLElement>("[data-portal-window]");
      const text = scope.querySelector<HTMLElement>("[data-portal-text]");
      const words = scope.querySelectorAll<HTMLElement>(".key-word");
      if (window_) {
        tl.fromTo(
          window_,
          { scale: 1.9, xPercent: -18, yPercent: -4 },
          { scale: 1, xPercent: 0, yPercent: 0, ease: "none" },
          0,
        );
      }
      if (text) tl.fromTo(text, { y: 48, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.35);
      tl.call(
        () => {
          for (const w of words) w.setAttribute("data-reveal", "done");
        },
        undefined,
        0.9,
      );
    },
  });

  return (
    <section
      ref={ref}
      className="home-portal"
      data-testid="portal-scene"
      aria-labelledby="portal-title"
    >
      <Container className="home-portal-grid">
        <div className="home-portal-text" data-portal-text="">
          <p className="t-label text-accent-text" id="portal-title">
            {dict.home.portal.label}
          </p>
          <p className="t-h2 home-portal-statement">
            <KeyWords text={dict.home.portal.statement} />
          </p>
          <p
            className="t-note text-ink-3 home-portal-note birlashma:block hidden"
            aria-hidden="true"
          >
            {dict.birlashma.note.mission}
          </p>
        </div>
        <div
          className="home-portal-window birlashma:hidden"
          data-portal-window=""
          aria-hidden="true"
        >
          <Ravoq ratio="3:4" className="home-portal-ravoq">
            <DesignArt slot="home-portal" locale={locale} className="home-portal-silk" />
          </Ravoq>
        </div>
      </Container>
    </section>
  );
}
