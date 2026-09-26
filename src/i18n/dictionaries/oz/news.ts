// Avtomatik: scripts/transliterate.mts uz/news.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { news as source } from "../uz/news";

export const news: typeof source = {
  title: "Янгиликлар",
  backToList: "Барча янгиликлар",
  previous: "Олдинги хабар",
  next: "Кейинги хабар",
  related: "Бошқа янгиликлар",
  empty: "Ҳозирча янгилик йўқ.",
};
