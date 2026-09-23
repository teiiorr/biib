// Avtomatik: scripts/transliterate.mts uz/home.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { home as source } from "../uz/home";

export const home: typeof source = {
  hero: {
    mission: "Bolalar va ösmirlar ijodi uçun sahna, studiya va körgazma taşkil qilamiz: kastingdan multfilmgaça.",
    ctaProjects: "Loyihalar",
    ctaAbout: "Biz haqimizda",
    silkAlt: "Marğilon atlasining abr naqşi",
    scroll: "Pastga",
  },
  portal: {
    statement: "Har bir bola öz {{ovozini}}, {{rangini}} va {{sahnasini}} topsin deb işlaymiz. Viloyat studiyalaridan poytaxt konsertigaça bitta yöl.",
    label: "Darvoza",
  },
  projects: {
    heading: "Loyihalar",
    lead: "Tört yönaliş: qöşiq, teatr, tasviriy sanʼat va animatsiya.",
    all: "Barça loyihalar",
    open: "Loyihani oçiş",
    external: "upop.uz saytiga ötiş",
    starLabel: "Çor-boğ kesişmasi",
  },
  news: {
    heading: "Yangiliklar",
    all: "Barça yangiliklar",
    lead: "Kasting, körgazma va studiyalar haqida sönggi xabarlar.",
  },
  people: {
    heading: "Rahbariyat va ekspertlar",
    lead: "Loyihalar rejasini rahbariyat tuzadi, dasturlar sifatini ekspertlar kengaşi köradi.",
    leadership: "Rahbariyat",
    experts: "Ekspertlar kengaşi",
    scrollHint: "Portretlar qatori, yon tomonga suring",
  },
  partners: {
    heading: "Hamkorlar",
    all: "Barça hamkorlar",
  },
  contact: {
    heading: "Boğlaniş",
    lead: "Savol, taklif yoki hamkorlik uçun yozing: bir iş kuni içida javob beramiz.",
    open: "Aloqa sahifasi",
    telegram: "Telegramda yoziş",
  },
  gallery: {
    heading: "Bolalar galereyasi",
    lead: "Studiyalarda çizilgan işlar. Ism, yoş va viloyat ota-onaning roziligi bilan körsatiladi.",
    caption: "{name}, {age} yoş, {region}",
    pending: "Işlar ota-onalar roziligi bilan yiğilmoqda",
  },
  coloring: {
    heading: "Böyaş sahifasi",
    hint: "Rangni tanlang va rasmning bölagiga bosing. Klaviaturada: strelkalar, Enter.",
    palette: "Böyoqlar",
    region: "{index}-bölak",
    clear: "Tozalaş",
    canvasLabel: "Böyaş uçun çiziqli rasm",
    paints: [
      "Quyoş",
      "Marjon",
      "Maysa",
      "Puşti",
      "Uzum",
      "Havorang",
    ],
  },
};
