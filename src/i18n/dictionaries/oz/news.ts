// Avtomatik: scripts/transliterate.mts uz/news.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { news as source } from "../uz/news";

export const news: typeof source = {
  title: "Янгиликлар",
  backToList: "Барча янгиликлар",
  previous: "Олдинги хабар",
  next: "Кейинги хабар",
  photos: {
    label: "Суратлар",
    previous: "Олдинги сурат",
    next: "Кейинги сурат",
    alt: "{title}: {n}-сурат",
  },
  related: "Бошқа янгиликлар",
  empty: "Ҳозирча янгилик йўқ.",
};
