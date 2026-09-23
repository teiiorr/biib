import { headers } from "next/headers";

import { NotFoundView } from "@/components/sections/errors/NotFoundView";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";

/** Til segmenti not-found ichida params sifatida kelmaydi: yoʻlni sarlavhadan oʻqiymiz. */
export default async function NotFound() {
  const list = await headers();
  const path = list.get("x-invoke-path") ?? list.get("x-pathname") ?? list.get("referer") ?? "";
  const segment = path
    .replace(/^https?:\/\/[^/]+/, "")
    .split("/")
    .filter(Boolean)[0];
  const locale = isLocale(segment) ? segment : DEFAULT_LOCALE;
  return <NotFoundView locale={locale} dict={getDictionary(locale)} />;
}
