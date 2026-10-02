import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ContentPicture } from "@/components/ui/ContentPicture";
import { getArtworks, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";

interface GallerySectionProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Faqat rozilik yozuvi bor ishlar chiqadi; imzoda ism, yosh, viloyat va asar nomi.
 * Ish boʻlmasa boʻlim umuman chizilmaydi (HomePage).
 */
export async function GallerySection({ locale, dict }: GallerySectionProps) {
  const artworks = await getArtworks();
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
                <ContentPicture
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
