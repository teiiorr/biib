import "server-only";
import { cache } from "react";

import { loadSnapshot } from "@/lib/cms/load";

import { getDictionary, type Dictionary } from "./dictionaries";
import type { Locale } from "./locales";
import { withTextOverrides } from "./text-overrides";

/**
 * Repodagi lugʻat ustiga paneldan yozilgan matnlar (snapshot.texts) qoʻyiladi. Mijoz komponentlari
 * lugʻatni props orqali oladi, shu sabab JS hajmi oshmaydi.
 */
export const getLiveDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const { texts } = await loadSnapshot();
  return withTextOverrides(getDictionary(locale), texts, locale);
});
