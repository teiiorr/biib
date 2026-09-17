import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LiquidPointer } from "@/components/brand/LiquidPointer";
import { Ambient, Grain } from "@/components/brand/Texture";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { getPathname } from "@/i18n/navigation";
import { LOCALE_META, type Locale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { appearanceInitScript } from "@/lib/appearance";
import { manrope, unbounded } from "@/lib/fonts";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale });
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biib.uz";

  return {
    metadataBase: new URL(site),
    title: { default: t("org.nameFull"), template: `%s — ${t("org.nameShort")}` },
    description: t("meta.homeDescription"),
    applicationName: t("org.nameFull"),
    alternates: {
      canonical: getPathname({ locale, href: "/" }),
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, getPathname({ locale: code, href: "/" })]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: t("org.nameFull"),
      title: t("org.nameFull"),
      description: t("meta.homeDescription"),
      locale,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html
      lang={locale}
      dir={LOCALE_META[locale as Locale].dir}
      className={`${unbounded.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Şişa zichligi birinçi çizişdan oldin qöyiladi. */}
        <script dangerouslySetInnerHTML={{ __html: appearanceInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Ambient />
        <a
          href="#main"
          className="sr-only rounded-sm bg-elevated px-4 py-2.5 text-callout font-semibold text-label shadow-ambient focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-alert)]"
        >
          {t("skipToContent")}
        </a>

        <NextIntlClientProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>

        <Grain />
        <LiquidPointer />
      </body>
    </html>
  );
}
