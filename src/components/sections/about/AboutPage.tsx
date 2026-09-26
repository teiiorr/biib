import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import type { IconName } from "@/components/icons/paths";
import { LinkButton } from "@/components/ui/LinkButton";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Prose } from "@/components/ui/Prose";
import { PullQuote } from "@/components/ui/PullQuote";
import { getFlagship, getMilestones, t } from "@/content";
import type { Dictionary } from "@/i18n/dictionaries";
import { hyphenate } from "@/i18n/hyphenate";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

import { InViewVideoLeaf } from "../lazy-leaves";
import { AboutLogoVideo } from "./AboutLogoVideo";
import { HistoryTimeline } from "./HistoryTimeline";

/* Yoʻnalishlar ustavdagi tartibda (6.10): adabiyot, teatr, kino va animatsiya, musiqa, tasviriy sanʼat,
   media va raqamli ijod. */
const DIRECTION_ICONS: readonly IconName[] = ["news", "mask", "film", "mic", "palette", "play"];
/* Vazifalar (2.2): kontent, iqtidor izlash, tanlovlar zanjiri, mahorat darslari, xalqaro, inklyuziya. */
const TASK_ICONS: readonly IconName[] = ["projects", "map-pin", "star", "users", "ticket", "heart"];
const HISTORY_ICONS: Readonly<Record<string, IconName>> = {
  founding: "users",
  registration: "building",
};
interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Biz haqimizda (15.3), matn birlashma ustavidan: markazdagi sarlavha; maqsad bitta oʻqish ustunida
 * (ikki xatboshi, ustavdan iqtibos, ustavni yuklab olish); matn ustunidagi UPOP TREND kadri; yoʻnalishlar
 * va asosiy vazifalar teng toʻrda (belgi va nomi, tavsifsiz);
 * tarix faqat yillari tasdiqlanganda; oxirida UPOP TREND lentasi. Sarlavhalar ostida tavsif yoʻq.
 * Harakat: sarlavhalar soʻzma-soʻz, matn va roʻyxatlar doira ritmida koʻtariladi.
 */
export function AboutPage({ locale, dict }: PageProps) {
  const a = dict.about;
  const upop = getFlagship().media.loop;
  /* Tarix faqat yili tasdiqlangan bosqichlar bilan: yilsiz uchta yorliq tugallanmagan koʻrinardi. */
  const milestones = getMilestones().flatMap((m) =>
    m.status === "confirmed" && m.year !== null
      ? [
          {
            id: m.id,
            year: m.year,
            title: t(m.title, locale),
            icon: HISTORY_ICONS[m.id] ?? "calendar",
          },
        ]
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
          {/* Egasining talabi: chapda belgi animatsiyasi, yonida matn — ikki ustun bir balandlikda, chetlar
              toʻr ustunlarida. Telefonda ustma-ust: avval belgi, keyin matn. */}
          <div className="grid-site about-intro">
            <Reveal
              className="about-intro-media col-span-4 md:col-span-8 lg:col-span-12 xl:col-span-5"
              attrs={{ "data-grid-item": "" }}
            >
              <MediaFrame ratio="1:1" tone="dark" motion={{ mode: "smooth" }}>
                <AboutLogoVideo label={dict.home.hero.videoAlt} />
              </MediaFrame>
            </Reveal>
            <Reveal
              className="about-mission col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 xl:col-span-7 xl:col-start-auto"
              attrs={{ "data-grid-item": "" }}
            >
              <Prose size="body-l">
                {a.mission.paragraphs.map((para) => (
                  <p key={para.slice(0, 24)}>{hyphenate(para, locale)}</p>
                ))}
              </Prose>
              <PullQuote attribution={a.mission.quoteSource}>
                {hyphenate(a.mission.quote, locale)}
              </PullQuote>
            </Reveal>
          </div>
        </Container>
      </Section>
      <Section labelledBy="about-values">
        <Container>
          <SectionHeader id="about-values" title={a.values.heading} split />
          <Reveal
            as="ul"
            className="about-list"
            stagger
            attrs={{ "data-audit": "gap", "data-columns": "3" }}
          >
            {a.values.items.map((item, index) => (
              <li key={item} className="about-list-item feature text-ink">
                <FeatureIcon name={DIRECTION_ICONS[index % DIRECTION_ICONS.length] ?? "star"} />
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
      <Section labelledBy="about-tasks">
        <Container>
          <SectionHeader id="about-tasks" title={a.tasks.heading} split />
          <Reveal
            as="ul"
            className="about-list"
            stagger
            attrs={{ "data-audit": "gap", "data-columns": "3" }}
          >
            {a.tasks.items.map((item, index) => (
              <li key={item} className="about-list-item feature text-ink">
                <FeatureIcon name={TASK_ICONS[index % TASK_ICONS.length] ?? "star"} />
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>
      {milestones.length > 0 ? (
        <Section labelledBy="about-history" rhythm="band" className="about-history">
          <Container>
            <SectionHeader id="about-history" title={a.history.heading} split />
            <HistoryTimeline items={milestones} label={a.history.heading} />
          </Container>
        </Section>
      ) : null}
      {/* Sahifa UPOP TREND lentasi bilan yopiladi (egasining talabi): sarlavha, ostida loyiha videosi
          (koʻrinishga kirganda oʻzi oʻynaydi, poster videoning oʻz birinchi kadri), eng pastda loyihaga
          oʻtish tugmasi. */}
      <Section labelledBy="about-next" tone="dark" rhythm="band" className="about-next upop-field">
        <Container>
          <SectionHeader id="about-next" title={a.next.heading} split />
          <div className="grid-site">
            <figure className="about-media-figure col-span-full" data-grid-item="">
              <MediaFrame ratio="16:9" tone="dark" motion={{ mode: "smooth", parallax: true }}>
                <InViewVideoLeaf
                  sources={upop.desktop}
                  mobileSources={upop.mobile}
                  poster={upop.poster}
                  alt={a.media.alt}
                  pauseLabel={dict.common.actions.pause}
                  playLabel={dict.common.actions.play}
                />
              </MediaFrame>
            </figure>
          </div>
          <div className="about-next-cta">
            <LinkButton
              href={pathFor(locale, "projects")}
              variant="primary"
              size="56"
              icon="arrow-right"
              iconPosition="end"
            >
              {a.next.cta}
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
