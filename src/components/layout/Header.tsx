import { AppearanceControl } from "@/components/glass/appearance/AppearanceControl";
import { ScrollEdge } from "@/components/glass/ScrollEdge";
import { Surface } from "@/components/glass/Surface";
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
 * Telefon: yupqa yuqori panel; sahifalar pastdagi tab-barda.
 */
export function Header({ locale, dict }: HeaderProps) {
  return (
    <header className="site-header" data-testid="header">
      <div className="container-site header-row hidden lg:flex">
        <BrandMark locale={locale} dict={dict.common} />
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
        >
          <BrandMark locale={locale} dict={dict.common} className="pl-2" />
          <div className="header-group">
            <LanguageMenu locale={locale} dict={dict.nav} />
            <AppearanceControl dict={dict.appearance} />
          </div>
        </Surface>
        <ScrollEdge position="bottom" />
      </div>
    </header>
  );
}
