import { AppearanceControl } from "@/components/glass/appearance/AppearanceControl";
import { ScrollEdge } from "@/components/glass/ScrollEdge";
import { Surface } from "@/components/glass/Surface";
import { ZardoziMark } from "@/components/ornament/ZardoziMark";
import { ZardoziUnderline } from "@/components/ornament/ZardoziUnderline";
import { Picture } from "@/components/ui/Picture";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";

import type { NavMarks } from "./AboutTrigger";
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
  const brandText = { line1: brand.line1, line2: brand.line2, name: brand.name };
  /* data-brand-mark: qahramon sahnasi belgini shu rasmga qoʻndiradi (useHeroScene). */
  const mark = (
    <Picture
      src="/brand/mark.png"
      alt={brand.markAlt}
      width={40}
      height={40}
      eager
      attrs={{ "data-brand-mark": "" }}
    />
  );
  const navMarks: NavMarks = {
    underline: <ZardoziUnderline draw="hover" className="nav-underline" />,
    mark: <ZardoziMark className="nav-mark" />,
  };
  return (
    <header className="site-header" data-testid="header">
      <ScrollEdge position="bottom" />
      <div className="container-site header-row hidden lg:flex">
        <BrandMark locale={locale} brand={brandText}>
          {mark}
        </BrandMark>
        <DesktopNav locale={locale} dict={dict.nav} marks={navMarks} />
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
          <BrandMark locale={locale} brand={brandText} className="pl-2">
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
