// Avtomatik: scripts/transliterate.mts uz/projects.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { projects as source } from "../uz/projects";

export const projects: typeof source = {
  title: "UPOP TREND",
  lead: "Milliy qöşiqçilik kastingi: viloyat bosqiçlari, yarim final va poytaxtdagi yakuniy konsert. Ariza bepul, tavsiya kerak emas.",
  facts: {
    heading: "Asosiy maʼlumot",
    age: "Yoş",
    format: "Şakl",
    place: "Joy",
    schedule: "Vaqt",
    cost: "Narx",
    teacher: "Ustoz",
    free: "Bepul",
    pending: "Tasdiq kutilmoqda",
  },
  filmHeading: "Kasting haqida video",
  filmLead: "Loyiha haqida qisqa video. Ovozi bor, bosilganda yuklanadi.",
  playFilm: "Videoni ijro etiş",
  registrationHeading: "Röyxatdan ötiş",
  upopNote: "Röyxatdan ötiş faqat upop.uz saytida. Bu sayt kastingni ötkazmaydi, faqat u haqida xabar beradi.",
  openExternal: "upop.uz saytiga ötiş",
  mediaPending: "Video taşkilotdan kelgaç şu yerda çiqadi",
};
