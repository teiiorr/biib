import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { formats } from "./formats";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // [locale] segmenti nomaʼlum yöllarni ham tutadi, şuning uçun tekşiruv kerak.
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    timeZone: "Asia/Tashkent",
    messages: (await import(`../../messages/${locale}.json`)).default,
    formats,
    onError(error) {
      if (process.env.NODE_ENV !== "production") console.error(error);
    },
    getMessageFallback({ key, namespace }) {
      return [namespace, key].filter(Boolean).join(".");
    },
  };
});
