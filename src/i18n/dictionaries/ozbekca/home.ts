// Avtomatik: scripts/transliterate.mts uz/home.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { home as source } from "../uz/home";

export const home: typeof source = {
  hero: {
    ctaProjects: "UPOP TREND",
    ctaAbout: "Biz haqimizda",
    videoAlt: "Birlaşma belgisi qoronği sahnada, atrofida oltin va puşti ipak tölqinlari",
  },
  portal: {
    statement: "Har bir bola öz ovozini, rangini va sahnasini topsin deb işlaymiz. Viloyat studiyalaridan poytaxt konsertigaça bitta yöl.",
    label: "Darvoza",
  },
  upop: {
    heading: "UPOP TREND",
    register: "upop.uz saytida röyxatdan ötiş",
    open: "Loyiha haqida",
  },
  news: {
    heading: "Yangiliklar",
    all: "Barça yangiliklar",
  },
  people: {
    heading: "Rahbariyat va ekspertlar",
    leadership: "Rahbariyat",
    experts: "Ekspertlar kengaşi",
  },
  partners: {
    heading: "Hamkorlar",
    all: "Barça hamkorlar",
  },
  contact: {
    heading: "Boğlaniş",
    open: "Aloqa sahifasi",
    telegram: "Telegramda yoziş",
  },
  gallery: {
    heading: "Bolalar galereyasi",
    caption: "{name}, {age} yoş, {region}",
  },
};
