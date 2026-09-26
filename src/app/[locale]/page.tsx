import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePage } from "@/components/sections/home/HomePage";
import { getPageStatus } from "@/content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import { buildMetadata, notFoundMetadata } from "@/lib/seo/metadata";

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
    status: await getPageStatus("home"),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomePage locale={locale} dict={getDictionary(locale)} />;
}
