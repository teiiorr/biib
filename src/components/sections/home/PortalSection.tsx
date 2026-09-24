"use client";

import { useRef } from "react";

import { Container } from "@/components/layout/Container";
import { DesignArt } from "@/components/layout/DesignArt";
import { usePortalScene } from "@/components/motion/usePortalScene";
import { Ravoq } from "@/components/ornament/Ravoq";
import { ZardoziText } from "@/components/ornament/ZardoziText";
import type { Locale } from "@/i18n/locales";

export interface PortalCopy {
  readonly label: string;
  readonly statement: string;
  readonly note: string;
}

interface PortalSectionProps {
  readonly locale: Locale;
  /* Faqat shu boʻlim matni: butun lugʻat RSC yukiga kirmaydi. */
  readonly copy: PortalCopy;
}

/**
 * Portal sahnasi: butun ekranli ipak oʻngdagi ravoq oynasiga yigʻiladi, chapda missiya koʻtariladi.
 * Pin ≤150% (kompyuter) / ≤100% (telefon), scrub 0.8, oddiy skroll doim ishlaydi.
 */
export function PortalSection({ locale, copy }: PortalSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  usePortalScene(ref, {
    length: 1.4,
    build: (tl, scope) => {
      const window_ = scope.querySelector<HTMLElement>("[data-portal-window]");
      const text = scope.querySelector<HTMLElement>("[data-portal-text]");
      const words = scope.querySelectorAll<HTMLElement>(".zardozi-word");
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
    settle: (scope) => {
      for (const w of scope.querySelectorAll(".zardozi-word"))
        w.setAttribute("data-reveal", "done");
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
            {copy.label}
          </p>
          <p className="t-h2 home-portal-statement">
            <ZardoziText text={copy.statement} lines={2} draw="none" className="portal-words" />
          </p>
          <p
            className="t-note text-ink-3 home-portal-note birlashma:block hidden"
            aria-hidden="true"
          >
            {copy.note}
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
