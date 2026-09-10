import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { getPathname } from "@/i18n/navigation";
import { LOCALE_META, type Locale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { nunito, rubik } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f9ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1526" },
  ],
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
    title: {
      default: t("org.nameFull"),
      template: `%s — ${t("org.nameShort")}`,
    },
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
      className={`${rubik.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Mavzuni hidratsiyadan oldin qöyadi — sahifa oq bölib çaqnamaydi. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-btn bg-surface px-4 py-3 font-display font-bold text-blue-deep shadow-soft focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
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
      </body>
    </html>
  );
}
