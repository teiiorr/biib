import "server-only";
import { cache } from "react";

import { loadSnapshot } from "@/lib/cms/load";

import { getDictionary, type Dictionary } from "./dictionaries";
import type { Locale } from "./locales";
import { withTextOverrides } from "./text-overrides";

/**
 * Sahifa, metadata va OG rasm uchun lugʻat: repodagi matn ustidan paneldan yozilgan almashtirishlar
 * (snapshot.texts). Mijoz komponentlari lugʻatni props bilan oladi: yangi JS qoʻshilmaydi.
 */
export const getLiveDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const { texts } = await loadSnapshot();
  return withTextOverrides(getDictionary(locale), texts, locale);
});
