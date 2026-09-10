import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHead, SectionMore } from "@/components/sections/SectionHead";
import { PersonPortrait } from "@/components/sections/PersonPortrait";
import { peopleOf, pick } from "@/content";
import type { Locale } from "@/i18n/locales";

/** Ekspertlar kengaşi — sokin va qatʼiy qator. Böyoq bu yerda past. */
export function PeopleTeaser() {
  const t = useTranslations("home.people");
  const locale = useLocale() as Locale;
  const members = peopleOf("council").slice(0, 6);

  if (members.length === 0) return null;

  return (
    <section className="section-y bg-surface-2/60" aria-labelledby="home-people">
      <div className="page-w page-x">
        <SectionHead
          id="home-people"
          heading={t("heading")}
          lead={t("lead")}
        />

        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {members.map((person, index) => (
            <li key={person.id}>
              <Reveal delay={index * 70} className="flex flex-col items-center gap-3 text-center">
                <PersonPortrait person={person} index={index} className="w-full max-w-[9.5rem]" />
                <div className="w-full">
                  <p className="lines-2 font-display text-[1rem] font-bold leading-[1.25] text-ink">
                    {pick(person.name, locale)}
                  </p>
                  <p className="lines-2 mt-1 text-[0.9rem] leading-[1.4] text-ink-muted">
                    {pick(person.role, locale)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <SectionMore
          className="mt-10"
          delay={140}
          links={[
            { href: "/council", label: t("all") },
            { href: "/leadership", label: t("leadership") },
          ]}
        />
      </div>
    </section>
  );
}
