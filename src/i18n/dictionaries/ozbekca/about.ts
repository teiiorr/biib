// Avtomatik: scripts/transliterate.mts uz/about.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { about as source } from "../uz/about";

export const about: typeof source = {
  title: "Biz haqimizda",
  lead: "Birlaşma bolalar va ösmirlar ijodini qöllab-quvvatlaydi: studiya oçadi, sahna beradi va işlarni körgazmaga olib çiqadi.",
  mission: {
    heading: "Maqsad",
    paragraphs: [
      "Har bir bola öz qiziqişini sinab körişi uçun yaqin joyda studiya, tajribali ustoz va tomoşabin bölişi kerak. Biz şu uçalasini bir joyga yiğamiz.",
      "Iş viloyatlardan boşlanadi: studiyalar şahar va tuman markazlarida oçiladi, eng yaxşi işlar poytaxt sahnasiga va körgazmalarga çiqadi.",
      "Ota-onalar uçun hamma narsa oçiq: maşğulot vaqti, şartlar va ustozlar oldindan eʼlon qilinadi.",
    ],
    quote: "Bola ijod qilganda unga sahna emas, işonç kerak. Sahna keyin topiladi.",
    quoteSource: "Birlaşma nizomidan",
  },
  values: {
    heading: "Yönalişlar",
    items: [
      {
        title: "Qöşiq va vokal",
        text: "UPOP TREND milliy kastingi va unga tayyorgarlik maşğulotlari.",
      },
      {
        title: "Teatr va sahna nutqi",
        text: "Teatr studiyalari: nutq, harakat, mavsum yakunida spektakl.",
      },
      {
        title: "Tasviriy sanʼat",
        text: "Rasm studiyalari va bolalar işlarining köçma körgazmalari.",
      },
      {
        title: "Animatsiya va adabiyot",
        text: "Animatsiya ustaxonasi: bola yozgan hikoyadan multfilmgaça.",
      },
    ],
  },
  history: {
    heading: "Tarix",
    lead: "Muhim bosqiçlar. Sanalar taşkilot tasdiğini kutmoqda.",
    pending: "Tarix sanalari taşkilotdan tasdiq kutmoqda",
    columnAlt: "Xiva Juma masjidi uslubidagi öyma yoğoç ustun",
  },
  documents: {
    heading: "Taʼsis hujjatlari",
    pending: "Hujjatlar taşkilot tomonidan taqdim etilgaç şu yerda çiqadi.",
  },
  next: {
    heading: "UPOP TREND",
    text: "Boş loyiha haqida batafsil: bosqiçlar, yoş çegarasi va röyxatdan ötiş.",
    cta: "Loyihaga ötiş",
  },
};
