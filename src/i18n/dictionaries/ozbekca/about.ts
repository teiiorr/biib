// Avtomatik: scripts/transliterate.mts uz/about.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { about as source } from "../uz/about";

export const about: typeof source = {
  title: "Biz haqimizda",
  mission: {
    heading: "Maqsad",
    paragraphs: [
      "Har bir bola öz qiziqişini sinab körişi uçun yaqin joyda studiya, tajribali ustoz va tomoşabin bölişi kerak. Biz şu uçalasini bir joyga yiğamiz.",
      "Iş viloyatlardan boşlanadi: studiyalar şahar va tuman markazlarida oçiladi, eng yaxşi işlar poytaxt sahnasiga va körgazmalarga çiqadi.",
    ],
    quote: "Bola ijod qilganda unga sahna emas, işonç kerak. Sahna keyin topiladi.",
    quoteSource: "Birlaşma nizomidan",
  },
  media: {
    caption: "UPOP TREND loyihasining vizual obrazi",
    alt: "Milliy atlas va adras liboslaridagi tört qiz rubob, doira va mikrofon bilan; orqada sözana naqşlari",
  },
  values: {
    heading: "Yönalişlar",
    items: [
      "Qöşiq va vokal",
      "Teatr va sahna nutqi",
      "Tasviriy sanʼat",
      "Animatsiya va adabiyot",
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
