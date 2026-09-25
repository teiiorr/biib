import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePage } from "@/components/sections/home/HomePage";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import { buildMetadata, notFoundMetadata } from "@/lib/seo/metadata";
import { statusForPage } from "@/lib/seo/status";

interface PageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  // Sahifa va layout parallel chiziladi: nomaʼlum til bu yerda ham toʻxtatiladi, aks holda 500.
  if (!isLocale(locale)) return notFoundMetadata();
  return buildMetadata({
    locale,
    key: "home",
    dict: getDictionary(locale),
    status: statusForPage("home"),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomePage locale={locale} dict={getDictionary(locale)} />;
}
