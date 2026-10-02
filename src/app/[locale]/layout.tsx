import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import { notFound } from "next/navigation";

import { AppearanceBootFallback } from "@/lib/appearance/BootFallback";
import { AppearanceProvider } from "@/lib/appearance/context";
import { APPEARANCE_BOOT_SCRIPT } from "@/lib/appearance/boot";
import { PerfProbe } from "@/components/layout/PerfProbe";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { TabBar } from "@/components/layout/TabBar";
import { IconSprite } from "@/components/icons/IconSprite";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { getContacts } from "@/content";
import { getLiveDictionary } from "@/i18n/live-dictionary";
import { isLocale, LOCALE_META, LOCALES } from "@/i18n/locales";
import { fontPreloads, heroFontFace } from "@/lib/fonts";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { siteUrl } from "@/lib/site";
import { TapSound } from "@/lib/sound/TapSound";

import "@/styles/globals.css";

/* dynamicParams yopilsa, ichki nomaʼlum yoʻllar ham global 404 sahifasiga tushadi (NoFallbackError).
   Nomaʼlum til esa pastdagi notFound() orqali global 404 sahifasiga boradi. */
export const dynamicParams = true;

/* Sahifalar soatiga bir marta, admin saqlaganda esa cms tegi orqali darhol yangilanadi.
   Qiymat literal boʻlishi shart va lib/cms/load.ts faylidagi qiymat bilan bir xil turadi. */
export const revalidate = 3600;

/* opengraph-image fayllari sahifa metadatasidan oldin yigʻiladi; asos shu yerda berilmasa, ular
   localhost manziliga bogʻlanib, yigʻishda va har 404 sahifada ogohlantirish chiqaradi. */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
};

/* viewport-fit=cover tab-bar va sarlavha safe-area bilan ishlashi uchun kerak. Qoʻlda <meta> qoʻyilsa,
   Next oʻzinikini ham chiqaradi va sahifada ikkita viewport boʻlib qoladi. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /* Sayt faqat tungi mavzuda, shuning uchun brauzer panellari va aylantirgich ham qorongʻi. */
  colorScheme: "dark",
  themeColor: "#0a1026",
};

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
  const [dict, contacts] = await Promise.all([getLiveDictionary(locale), getContacts()]);
  const meta = LOCALE_META[locale];
  /* Shrift toʻplamlari preload orqali <head> qismiga koʻchadi; JSX ichidagi link ikki marta chiqib qolardi. */
  for (const href of fontPreloads(locale)) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  return (
    <html
      lang={meta.htmlLang}
      data-orthography={meta.orthography === "2026" ? "2026" : undefined}
      data-theme="dark"
      data-motion="on"
      data-sound="on"
      suppressHydrationWarning
    >
      <head>
        {/* Mavzu sahifa chizilishidan oldin qoʻyiladi, aks holda miltillash koʻrinadi. */}
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: heroFontFace(locale) }} />
      </head>
      <body>
        <IconSprite />
        <AppearanceBootFallback />
        <TapSound />
        <PerfProbe />
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
        {/* Xato va 404 sahifalari matnni shu yerdan oʻqiydi, shunda lugʻat mijoz JS boʻlagiga kirmaydi. */}
        <script
          id="biib-errors"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dict.errors).replace(/</g, "\\u003c"),
          }}
        />
        <JsonLd
          data={[organizationJsonLd({ locale, dict, contacts }), websiteJsonLd({ locale, dict })]}
        />
      </body>
    </html>
  );
}
