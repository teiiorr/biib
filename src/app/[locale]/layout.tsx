import type { ReactNode } from "react";
import { preload } from "react-dom";
import { notFound } from "next/navigation";

import { AppearanceProvider } from "@/lib/appearance/context";
import { APPEARANCE_BOOT_SCRIPT } from "@/lib/appearance/boot";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { TabBar } from "@/components/layout/TabBar";
import { IconSprite } from "@/components/icons/IconSprite";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { getContacts } from "@/content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALE_META, LOCALES } from "@/i18n/locales";
import { FONT_CLASS, fontPreloads, heroFontFace } from "@/lib/fonts";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

import "@/styles/globals.css";

/* Fallback ochiq: aks holda ichki nomaʼlum yoʻllar ham global 404 ga tushadi (NoFallbackError).
   Nomaʼlum til pastdagi notFound() bilan global 404 ga boradi. */
export const dynamicParams = true;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const meta = LOCALE_META[locale];
  /* Til toʻplamlari (≤4) sarlavhaga preload sifatida koʻchadi; JSX link ikki marta chiqar edi. */
  for (const href of fontPreloads(locale)) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  return (
    <html
      lang={meta.htmlLang}
      data-orthography={meta.orthography === "2026" ? "2026" : undefined}
      data-design="atlas"
      data-theme="light"
      data-motion="on"
      className={FONT_CLASS}
      suppressHydrationWarning
    >
      <head>
        {/* Mavzu va dizayn sahifa chizilishidan oldin qoʻyiladi, aks holda miltillash koʻrinadi. */}
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style dangerouslySetInnerHTML={{ __html: heroFontFace(locale) }} />
      </head>
      <body>
        <IconSprite />
        <AppearanceProvider>
          <MotionProvider>
            <SkipLink label={dict.common.skipToContent} />
            <Header locale={locale} dict={dict} />
            <main id="content" className="page-main" tabIndex={-1}>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer locale={locale} dict={dict} />
            <TabBar locale={locale} nav={dict.nav} hints={dict.common.hints} />
          </MotionProvider>
        </AppearanceProvider>
        {/* Xato va 404 sahifalari (mijoz komponentlari) matnni shu yerdan oʻqiydi: lugʻat JS ga kirmaydi. */}
        <script
          id="biib-errors"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ ...dict.errors, paints: dict.home.coloring.paints }).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <JsonLd
          data={[
            organizationJsonLd({ locale, dict, contacts: getContacts() }),
            websiteJsonLd({ locale, dict }),
          ]}
        />
      </body>
    </html>
  );
}
