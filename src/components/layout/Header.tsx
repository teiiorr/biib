import { AppearanceControl } from "@/components/glass/appearance/AppearanceControl";
import { ScrollEdge } from "@/components/glass/ScrollEdge";
import { Surface } from "@/components/glass/Surface";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";

import { BrandMark } from "./BrandMark";
import { DesktopNav } from "./DesktopNav";
import { LanguageMenu } from "./LanguageMenu";

interface HeaderProps {
  readonly locale: Locale;
  readonly dict: Dictionary;
}

/**
 * Kompyuter (≥1024): belgi chapda, oʻrtada navigatsiya kapsulasi, oʻngda til va koʻrinish guruhi.
 * Telefon: yupqa yuqori panel; sahifalar pastdagi tab-barda. Skroll cheti (§10.1.4) ikkala
 * oʻlchamda bitta: sarlavha ostidan oʻtayotgan matn qattiq chiziq oʻrniga xiralashib soʻnadi.
 */
export function Header({ locale, dict }: HeaderProps) {
  const brand = dict.common.brand;
  /* data-brand-mark: qahramon sahnasi belgini shu rasmga qoʻndiradi (useHeroScene). */
  const mark = <BrandLogo alt={brand.markAlt} eager attrs={{ "data-brand-mark": "" }} />;
  return (
    <header className="site-header" data-testid="header">
      <ScrollEdge position="bottom" />
      <div className="container-site header-row hidden lg:flex">
        {/* Belgi ham oʻz oynasida: ostidan oʻtayotgan matn nom bilan aralashmaydi, parda kerak emas. */}
        <Surface
          as="div"
          radius="control"
          padding={8}
          text
          adaptiveTone
          className="header-capsule header-brand"
        >
          <BrandMark locale={locale} name={brand.name}>
            {mark}
          </BrandMark>
        </Surface>
        <DesktopNav locale={locale} dict={dict.nav} />
        <Surface as="div" radius="control" padding={8} text adaptiveTone className="header-group">
          <LanguageMenu locale={locale} dict={dict.nav} />
          <AppearanceControl dict={dict.appearance} />
        </Surface>
      </div>
      <div className="lg:hidden" style={{ paddingTop: "var(--safe-top)" }}>
        <Surface
          as="div"
          radius="control"
          padding={0}
          text
          adaptiveTone
          className="top-bar mx-4 mt-2"
          data-top-bar=""
        >
          <BrandMark locale={locale} name={brand.name}>
            {mark}
          </BrandMark>
          <div className="header-group" data-top-bar-group="">
            <LanguageMenu locale={locale} dict={dict.nav} />
            <AppearanceControl dict={dict.appearance} />
          </div>
        </Surface>
      </div>
    </header>
  );
}
