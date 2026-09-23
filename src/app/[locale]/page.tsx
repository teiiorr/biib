import type { Metadata } from "next";

import { HomePage } from "@/components/sections/home/HomePage";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { buildMetadata } from "@/lib/seo/metadata";
import { statusForPage } from "@/lib/seo/status";

interface PageProps {
  readonly params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    key: "home",
    dict: getDictionary(locale),
    status: statusForPage("home"),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <HomePage locale={locale} dict={getDictionary(locale)} />;
}
