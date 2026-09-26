import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Prose } from "@/components/ui/Prose";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill, formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";

/* Bolalar uchun qisqa izoh: maʼlumot yigʻilmaydi, rozilik, olib tashlash. */
const KID_ICONS = ["shield", "heart", "check"] as const;
interface PageProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

const UPDATED = "2026-09-24";

/* Oʻqish ustuni maqola va «Biz haqimizda» bilan bir xil: kompyuterda 3–10, kengroq ekranda 4–9.
   Xulosa kartasi, matn va sana shu ustunning chetlarida turadi. */
const COLUMN = "col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4";

/**
 * Maxfiylik: sarlavha, bolalar uchun qisqa xulosa va toʻrtta huquqiy band (qisqa bandlar birlashtirilgan:
 * har sarlavha ostida toʻliq matn bloki). Har band markazdagi sarlavha va uning ostida 12 ustunli
 * toʻrdagi 65ch ustunda chapdan oʻqiladigan matn. Yangilangan sana — matn oxirida sokin izoh.
 */
export function PrivacyPage({ locale, dict }: PageProps) {
  const p = dict.privacy;
  const last = p.sections.at(-1)?.id;
  return (
    <>
      <PageHero
        title={p.title}
        breadcrumbs={[
          { href: pathFor(locale, "home"), label: dict.nav.home },
          { href: pathFor(locale, "privacy"), label: dict.nav.privacy, current: true },
        ]}
        breadcrumbsLabel={dict.common.hints.breadcrumbs}
      />
      <Section labelledBy="privacy-kid">
        <Container>
          <SectionHeader id="privacy-kid" title={p.kid.heading} />
          <div className="grid-site">
            <ul className={`privacy-kid ${COLUMN}`} data-grid-item="">
              {p.kid.items.map((item, index) => (
                <li key={item} className="feature t-body-l">
                  <FeatureIcon name={KID_ICONS[index % KID_ICONS.length] ?? "check"} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
      <Section>
        <Container className="privacy-sections">
          {p.sections.map((s) => (
            <Reveal
              as="section"
              key={s.id}
              id={s.id}
              className="privacy-section"
              labelledBy={`${s.id}-h`}
              distance={16}
            >
              <SectionHeader id={`${s.id}-h`} title={s.heading} />
              <div className="grid-site">
                <Prose className={COLUMN}>
                  {s.paragraphs.map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                  {/* Soʻrov qayerga yuborilishi oxirgi bandda aytiladi: havola shu yerda. */}
                  {s.id === last ? (
                    <p>
                      <Link
                        href={pathFor(locale, "contacts")}
                        className="privacy-contact-link text-tint underline"
                      >
                        {dict.nav.contacts}
                      </Link>
                    </p>
                  ) : null}
                </Prose>
              </div>
            </Reveal>
          ))}
          <div className="grid-site">
            <div className={`privacy-updated ${COLUMN}`}>
              <p className="t-small text-ink-3 tnum">
                {fill(p.updated, { date: formatDate(locale, UPDATED) })}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
