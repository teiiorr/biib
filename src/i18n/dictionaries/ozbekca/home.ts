// Avtomatik: scripts/transliterate.mts uz/home.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { home as source } from "../uz/home";

export const home: typeof source = {
  hero: {
    mission: "Bolalar va ösmirlar ijodi uçun sahna, studiya va körgazma taşkil qilamiz. Boş loyiha — UPOP TREND milliy kastingi.",
    ctaProjects: "UPOP TREND",
    ctaAbout: "Biz haqimizda",
    videoAlt: "Birlaşma belgisi qoronği sahnada, atrofida oltin va puşti ipak tölqinlari",
    scroll: "Pastga",
  },
  portal: {
    statement: "Har bir bola öz {{ovozini}}, {{rangini}} va {{sahnasini}} topsin deb işlaymiz. Viloyat studiyalaridan poytaxt konsertigaça bitta yöl.",
    label: "Darvoza",
  },
  upop: {
    heading: "UPOP TREND",
    lead: "Birlaşmaning boş loyihasi: 14–19 yoşli qöşiqçilar uçun milliy kasting, viloyat bosqiçlaridan poytaxt konsertigaça.",
    watch: "Videoni köriş",
    register: "upop.uz saytida röyxatdan ötiş",
    open: "Loyiha haqida",
  },
  news: {
    heading: "Yangiliklar",
    all: "Barça yangiliklar",
    lead: "Kasting, körgazma, studiya va seminarlar haqida sönggi xabarlar.",
  },
  people: {
    heading: "Rahbariyat va ekspertlar",
    lead: "Iş rejasini rahbariyat tuzadi, dasturlar sifatini ekspertlar kengaşi köradi.",
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
  },
};
