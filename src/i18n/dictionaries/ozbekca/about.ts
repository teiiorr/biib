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
        text: "UPOP TREND kastingi va tayyorgarlik maşğulotlari.",
      },
      {
        title: "Teatr va sahna nutqi",
        text: "Sahna bolalari studiyalari: nutq, harakat, spektakl.",
      },
      {
        title: "Tasviriy sanʼat",
        text: "Rangli olam studiyalari va köçma körgazmalar.",
      },
      {
        title: "Animatsiya va adabiyot",
        text: "Ertak ustaxonasi: hikoyadan multfilmgaça.",
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
    heading: "Loyihalar",
    text: "Tört yönalişning har biri haqida batafsil.",
    cta: "Loyihalarga ötiş",
  },
};
