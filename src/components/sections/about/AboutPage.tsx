import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Picture } from "@/components/ui/Picture";
import { Prose } from "@/components/ui/Prose";
import { PullQuote } from "@/components/ui/PullQuote";
import { getMilestones, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

import { HistoryTimeline } from "./HistoryTimeline";

/* Yoʻnalishlar tartibi lugʻatdagi bilan: qoʻshiq, teatr, tasviriy sanʼat, animatsiya. */
const DIRECTION_ICONS = ["mic", "mask", "palette", "film"] as const;
interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Biz haqimizda (15.3): markazdagi sarlavha; maqsad markazdagi bitta oʻqish ustunida (ikki xatboshi
 * va kamtar iqtibos); matn ustunidagi UPOP TREND kadri; yoʻnalishlar teng toʻrda (chiziq va nomi, tavsifsiz);
 * tarix faqat yillari tasdiqlanganda; oxirida UPOP TREND lentasi. Sarlavhalar ostida tavsif yoʻq.
 * Harakat: sarlavhalar soʻzma-soʻz, matn va roʻyxatlar doira ritmida koʻtariladi.
 */
export function AboutPage({ locale, dict }: PageProps) {
  const a = dict.about;
  /* Tarix faqat yili tasdiqlangan bosqichlar bilan: yilsiz uchta yorliq tugallanmagan koʻrinardi. */
  const milestones = getMilestones().flatMap((m) =>
    m.status === "confirmed" && m.year !== null
      ? [{ id: m.id, year: m.year, title: t(m.title, locale), text: t(m.text, locale) }]
      : [],
  );
  return (
    <>
      <PageHero
        title={a.title}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "about"), label: dict.nav.about, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      {/* Sahifa sarlavhasidan keyin ikkinchi sarlavha yoʻq (egasining talabi): maqsad matni h1 ostida. */}
      <Section labelledBy="page-title">
        <Container>
          {/* Oʻqish ustuni maqola bilan bir xil: kompyuterda 3–10, kengroq ekranda 4–9 (65ch dan oshmaydi). */}
          <div className="grid-site">
            <Reveal
              className="about-mission col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4"
              attrs={{ "data-grid-item": "" }}
            >
              <Prose size="body-l">
                {a.mission.paragraphs.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </Prose>
              <PullQuote attribution={a.mission.quoteSource}>{a.mission.quote}</PullQuote>
            </Reveal>
          </div>
        </Container>
      </Section>
      {/* Egasining UPOP TREND tasviri: matnli sahifaga bitta keng kadr — maqsaddan yoʻnalishlarga oʻtish. */}
      <Section as="div" rhythm="section" className="about-media">
        <Container>
          {/* Kadr maqsad matni bilan aynan bir ustunlarda (egasining talabi): chetlar bir chiziqda.
              Ohang faqat suratda: sut rangli izoh ostida oyna tungi ohangga oʻtib qolmasin (10.1.3). */}
          <div className="grid-site">
            <figure
              className="about-media-figure col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4"
              data-grid-item=""
            >
              <MediaFrame ratio="16:9" tone="dark" motion={{ mode: "smooth", parallax: true }}>
                <Picture
                  src="/brand/upop-scene.jpg"
                  alt={a.media.alt}
                  fill
                  sizes="(min-width: 1440px) 640px, (min-width: 1024px) 66vw, 100vw"
                />
              </MediaFrame>
              <figcaption className="t-small text-ink-3">{a.media.caption}</figcaption>
            </figure>
          </div>
        </Container>
      </Section>
      <Section labelledBy="about-values" tone="light">
        <Container>
          <SectionHeader id="about-values" title={a.values.heading} split />
          <Reveal as="ul" className="about-list" stagger attrs={{ "data-audit": "gap" }}>
            {a.values.items.map((item, index) => (
              <li key={item} className="about-list-item feature t-h4 text-ink">
                <FeatureIcon name={DIRECTION_ICONS[index % DIRECTION_ICONS.length] ?? "star"} />
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
      {milestones.length > 0 ? (
        <Section labelledBy="about-history" tone="light" rhythm="band" className="about-history">
          <Container>
            <SectionHeader id="about-history" title={a.history.heading} split />
            <HistoryTimeline items={milestones} label={a.history.heading} />
          </Container>
        </Section>
      ) : null}
      {/* Lojuvard UPOP lentasi: sut-oq tarix sirtidan keyin sahifani yopadi. */}
      <Section labelledBy="about-next" tone="dark" rhythm="band" className="about-next upop-field">
        <Container>
          <SectionHeader
            id="about-next"
            title={a.next.heading}
            split
            actions={
              <LinkButton
                href={pathFor(locale, "projects")}
                variant="primary"
                size="56"
                icon="arrow-right"
                iconPosition="end"
              >
                {a.next.cta}
              </LinkButton>
            }
          />
        </Container>
      </Section>
    </>
  );
}
