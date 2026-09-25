// Avtomatik: scripts/transliterate.mts uz/news.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { news as source } from "../uz/news";

export const news: typeof source = {
  title: "Янгиликлар",
  lead: "Кастинг, кўргазма, студия ва семинарлар ҳақида хабарлар.",
  latest: "Сўнгги хабар",
  readMore: "Ўқиш",
  backToList: "Барча янгиликлар",
  share: "Улашиш",
  progress: "Ўқиш жараёни",
  previous: "Олдинги хабар",
  next: "Кейинги хабар",
  draftNote: "Бу матн қоралама: сана ва тафсилотлар ташкилот тасдиғидан кейин чиқади.",
  topic: "Мавзу",
  empty: "Ҳозирча янгилик йўқ.",
};
