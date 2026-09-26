// Avtomatik: scripts/transliterate.mts uz/news.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { news as source } from "../uz/news";

export const news: typeof source = {
  title: "Yangiliklar",
  backToList: "Barça yangiliklar",
  previous: "Oldingi xabar",
  next: "Keyingi xabar",
  empty: "Hozirça yangilik yöq.",
};
