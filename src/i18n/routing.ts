import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "./locales";

/**
 * Slug lar barça tillarda lotinça. Kiril yöl ham işlaydi, ammo
 * havola rasmiy xatga yoki Telegramga %D1%8F... bölib tuşadi.
 * Üç özbek tili bitta slug ni bölişadi — bu bitta til.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,

  localePrefix: {
    mode: "always",
    prefixes: {
      "uz-Latn": "/uz",
      "uz-Cyrl": "/oz",
      "uz-Latn-x-reform": "/ozbekca",
    },
  },

  localeCookie: { name: "NEXT_LOCALE", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" },
  localeDetection: true,
  alternateLinks: true,

  pathnames: {
    "/": "/",

    "/about": {
      "uz-Latn": "/biz-haqimizda",
      "uz-Cyrl": "/biz-haqimizda",
      "uz-Latn-x-reform": "/biz-haqimizda",
      ru: "/o-nas",
      en: "/about",
    },

    "/projects": {
      "uz-Latn": "/loyihalar",
      "uz-Cyrl": "/loyihalar",
      "uz-Latn-x-reform": "/loyihalar",
      ru: "/proekty",
      en: "/projects",
    },

    "/news": {
      "uz-Latn": "/yangiliklar",
      "uz-Cyrl": "/yangiliklar",
      "uz-Latn-x-reform": "/yangiliklar",
      ru: "/novosti",
      en: "/news",
    },
    "/news/[slug]": {
      "uz-Latn": "/yangiliklar/[slug]",
      "uz-Cyrl": "/yangiliklar/[slug]",
      "uz-Latn-x-reform": "/yangiliklar/[slug]",
      ru: "/novosti/[slug]",
      en: "/news/[slug]",
    },

    "/council": {
      "uz-Latn": "/ekspertlar-kengashi",
      "uz-Cyrl": "/ekspertlar-kengashi",
      "uz-Latn-x-reform": "/ekspertlar-kengashi",
      ru: "/ekspertnyy-sovet",
      en: "/expert-council",
    },

    "/leadership": {
      "uz-Latn": "/rahbariyat",
      "uz-Cyrl": "/rahbariyat",
      "uz-Latn-x-reform": "/rahbariyat",
      ru: "/rukovodstvo",
      en: "/leadership",
    },

    "/partners": {
      "uz-Latn": "/hamkorlar",
      "uz-Cyrl": "/hamkorlar",
      "uz-Latn-x-reform": "/hamkorlar",
      ru: "/partnery",
      en: "/partners",
    },

    "/privacy": {
      "uz-Latn": "/maxfiylik",
      "uz-Cyrl": "/maxfiylik",
      "uz-Latn-x-reform": "/maxfiylik",
      ru: "/konfidentsialnost",
      en: "/privacy",
    },

    "/contacts": {
      "uz-Latn": "/aloqa",
      "uz-Cyrl": "/aloqa",
      "uz-Latn-x-reform": "/aloqa",
      ru: "/kontakty",
      en: "/contacts",
    },
  },
});

export type AppPathname = keyof typeof routing.pathnames;

/** Parametrsiz yönalişlar: <Link href> ga töğridan-töğri beriladi. */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
