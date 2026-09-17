import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { PersonPortrait } from "@/components/sections/PersonPortrait";
import { SectionHead, SectionMore } from "@/components/sections/SectionHead";
import { peopleOf, pick } from "@/content";
import type { Locale } from "@/i18n/locales";

/** Rasmiy bölim: qatʼiy tör, samosvet yöq — bu yerda sokinlik kerak. */
export function PeopleTeaser() {
  const t = useTranslations("home.people");
  const locale = useLocale() as Locale;
  const members = peopleOf("council").slice(0, 6);

  if (members.length === 0) return null;

  return (
    <section className="panel section" aria-labelledby="home-people">
      <div className="page">
        <Reveal>
          <SectionHead id="home-people" heading={t("heading")} lead={t("lead")} />
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {members.map((person, index) => (
            <Reveal as="li" key={person.id} delay={index * 60} className="flex flex-col gap-2.5">
              <PersonPortrait person={person} shape="circle" className="w-full max-w-32" />
              <div>
                <p className="text-callout font-semibold text-label">{pick(person.name, locale)}</p>
                <p className="mt-0.5 text-footnote text-label-secondary">
                  {pick(person.role, locale)}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120} className="mt-8">
          <SectionMore
            links={[
              { href: "/council", label: t("all") },
              { href: "/leadership", label: t("leadership") },
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
