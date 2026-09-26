// Avtomatik: scripts/transliterate.mts uz/about.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { about as source } from "../uz/about";

export const about: typeof source = {
  title: "Biz haqimizda",
  mission: {
    paragraphs: [
      "Bolalar ijodkorligi ijodiy birlaşmasi bolalar va ösmirlar ijodkorligini qöllab-quvvatlaş, bolalar uçun milliy kontent yaratiş sohasida işlaydigan ijodkorlar va mutaxassislarni birlaştiradi. Birlaşma jamoat birlaşmasi şaklidagi nodavlat notijorat taşkilot bölib, 2026-yilda Özbekiston Respublikasi Adliya vazirligida davlat röyxatidan ötgan.",
      "Birlaşma adabiyot, teatr, kino, animatsiya, musiqa, tasviriy sanʼat va media sohalarida bolalar uçun yuksak saviyali milliy kontent yaratilişini rağbatlantiradi, respublikaning barça hududlaridan, ayniqsa çekka tumanlardan iqtidorli bolalarni izlab topib, ularni ijodiy yönaltiradi. Faoliyat ixtiyoriylik, oşkoralik, teng huquqlilik, özini özi boşqariş va qonuniylik tamoyillariga asoslanadi.",
    ],
    quote: "Birlaşmaning asosiy maqsadi – bolalar va ösmirlar ijodkorligini tizimli ravişda qöllab-quvvatlaş… hamda milliy madaniyat, maʼnaviy qadriyatlar va soğlom turmuş tarzini bolalar ongiga ijodiy vositalar orqali singdirişdan iborat.",
    quoteSource: "Birlaşma ustavi, 2.1-band",
    charter: "Birlaşma ustavi",
    charterHint: "PDF, 1 MB",
  },
  media: {
    caption: "UPOP TREND loyihasining vizual obrazi",
    alt: "Milliy atlas va adras liboslaridagi tört qiz rubob, doira va mikrofon bilan; orqada sözana naqşlari",
  },
  values: {
    heading: "Yönalişlar",
    items: [
      "Adabiyot",
      "Teatr",
      "Kino va animatsiya",
      "Musiqa",
      "Tasviriy sanʼat",
      "Media va raqamli ijod",
    ],
  },
  tasks: {
    heading: "Asosiy vazifalar",
    items: [
      "Bolalar uçun multfilmlar, audiohikoyalar, ertaklar, qöşiqlar, adabiy va raqamli mahsulotlar yaratilişiga kömaklaşiş",
      "Barça hududlardan, ayniqsa çekka tumanlardan iqtidorli bolalar va ösmirlarni izlab topiş",
      "«Mahalla – tuman – viloyat – respublika» zanjirida körik-tanlovlar va festivallar ötkaziş",
      "Tajribali ijodkor va pedagoglarning mahorat darslarini, tanlovlarga tayyorlov kurslarini taşkil etiş",
      "Özbekiston bolalari asarlarini nufuzli xalqaro festival va tanlovlarda namoyiş etiş",
      "Nogironligi bölgan bolalar uçun inklyuziv ijodiy ustaxonalar yaratişga kömaklaşiş",
    ],
  },
  history: {
    heading: "Tarix",
  },
  next: {
    heading: "UPOP TREND",
    cta: "Loyihaga ötiş",
  },
};
