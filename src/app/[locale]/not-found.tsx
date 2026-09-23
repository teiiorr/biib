"use client";

import { useParams } from "next/navigation";

import { NotFoundView } from "@/components/sections/errors/NotFoundView";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";

/** Til segmenti not-found ga params sifatida kelmaydi: brauzer parametrlaridan oʻqiladi. */
export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return <NotFoundView locale={locale} dict={getDictionary(locale)} />;
}
