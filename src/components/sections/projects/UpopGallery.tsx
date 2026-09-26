import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Picture } from "@/components/ui/Picture";
import { getUpopGallery, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";

import { InViewVideoLeaf } from "../lazy-leaves";

interface UpopGalleryProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * UPOP TREND galereyasi: 8 joyli tahririy toʻr (kompyuterda 12, planshetda 8, telefonda 2 ustun).
 * Har joyning oʻz ramkasi (sahna, oltin, oyna, chipta, kino lentasi, paspartu) va skroll bilan oʻz
 * kirishi bor; joylar src/content/upop-gallery.ts da izohdan chiqariladi. Roʻyxat boʻsh boʻlsa boʻlim
 * umuman chizilmaydi.
 */
export function UpopGallery({ locale, dict }: UpopGalleryProps) {
  const shots = getUpopGallery();
  if (shots.length === 0) return null;
  const p = dict.projects;
  return (
    <Section labelledBy="upop-gallery-title" className="upop-gallery">
      <Container>
        <SectionHeader id="upop-gallery-title" title={p.galleryHeading} split />
        <div className="upop-gallery-frame">
          <ul className="upop-gallery-grid">
            {shots.map((shot, index) => {
              const alt = shot.alt ? t(shot.alt, locale) : fill(p.galleryAlt, { n: index + 1 });
              return (
                <li
                  key={shot.src}
                  className="upop-shot"
                  data-frame={shot.frame}
                  data-motion={shot.motion}
                  data-tone="dark"
                >
                  {shot.frame === "ticket" ? (
                    <span className="upop-shot-stub t-micro tnum" aria-hidden="true">
                      <span>UPOP TREND</span>
                      <span>№ {String(index + 1).padStart(2, "0")}</span>
                    </span>
                  ) : null}
                  <div className="upop-shot-media">
                    {shot.kind === "video" ? (
                      <InViewVideoLeaf
                        src={shot.src}
                        {...(shot.poster ? { poster: shot.poster } : {})}
                        alt={alt}
                        pauseLabel={dict.common.actions.pause}
                        playLabel={dict.common.actions.play}
                      />
                    ) : (
                      <Picture
                        src={shot.src}
                        alt={alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
