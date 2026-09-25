// Avtomatik: scripts/transliterate.mts uz/news.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { news as source } from "../uz/news";

export const news: typeof source = {
  title: "Yangiliklar",
  lead: "Kasting, körgazma, studiya va seminarlar haqida xabarlar.",
  latest: "Sönggi xabar",
  readMore: "Öqiş",
  backToList: "Barça yangiliklar",
  share: "Ulaşiş",
  progress: "Öqiş jarayoni",
  previous: "Oldingi xabar",
  next: "Keyingi xabar",
  draftNote: "Bu matn qoralama: sana va tafsilotlar taşkilot tasdiğidan keyin çiqadi.",
  topic: "Mavzu",
  empty: "Hozirça yangilik yöq.",
};
