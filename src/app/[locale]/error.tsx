"use client";

import { useParams } from "next/navigation";

import { ErrorPageView } from "@/components/sections/errors/ErrorPageView";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ reset }: ErrorProps) {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return <ErrorPageView locale={locale} dict={getDictionary(locale)} retry={reset} />;
}
