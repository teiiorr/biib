import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { getArtworks, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";

interface GallerySectionProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Bolalar galereyasi (25.4.1): faqat rozilik yozuvi bor ishlar; imzo — ism, yosh, viloyat, nom.
 * Ish yoʻq boʻlsa boʻlim umuman chizilmaydi (HomePage); kutilayotgani content-pending.md da.
 */
export function GallerySection({ locale, dict }: GallerySectionProps) {
  const artworks = getArtworks();
  const g = dict.home.gallery;
  return (
    <Section labelledBy="home-gallery">
      <Container>
        <SectionHeader id="home-gallery" title={g.heading} split />
        <Reveal
          as="ul"
          className="gallery-wall"
          stagger
          attrs={{ "data-card-group": "" }}
          label={g.heading}
        >
          {artworks.map((art) => (
            <li key={art.id} className="gallery-item" data-card="">
              <figure>
                <Picture
                  src={art.src}
                  alt={t(art.title, locale)}
                  width={art.width}
                  height={art.height}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <figcaption className="t-small text-ink-2" data-card-title="">
                  {fill(g.caption, {
                    name: art.firstName,
                    age: art.age,
                    region: t(art.region, locale),
                  })}
                </figcaption>
              </figure>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
