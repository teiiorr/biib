import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { AppearanceProvider } from "@/lib/appearance/context";
import { APPEARANCE_BOOT_SCRIPT } from "@/lib/appearance/boot";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { TabBar } from "@/components/layout/TabBar";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { getContacts } from "@/content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALE_META, LOCALES } from "@/i18n/locales";
import { fontsFor } from "@/lib/fonts";
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
  const fonts = fontsFor(locale);

  return (
    <html
      lang={meta.htmlLang}
      data-orthography={meta.orthography === "2026" ? "2026" : undefined}
      data-design="atlas"
      data-theme="light"
      data-motion="on"
      className={fonts.className}
      style={fonts.style}
      suppressHydrationWarning
    >
      <head>
        {/* Mavzu va dizayn sahifa chizilishidan oldin qoʻyiladi, aks holda miltillash koʻrinadi. */}
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <AppearanceProvider>
          <MotionProvider>
            <LenisProvider>
              <SkipLink label={dict.common.skipToContent} />
              <Header locale={locale} dict={dict} />
              <main id="content" className="page-main" tabIndex={-1}>
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer locale={locale} dict={dict} />
              <TabBar locale={locale} dict={dict} />
            </LenisProvider>
          </MotionProvider>
        </AppearanceProvider>
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
