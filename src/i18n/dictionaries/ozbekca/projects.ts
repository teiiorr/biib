// Avtomatik: scripts/transliterate.mts uz/projects.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { projects as source } from "../uz/projects";

export const projects: typeof source = {
  title: "Loyihalar",
  lead: "Tört yönaliş, har birida öz yoş çegarasi, tartibi va ustozi bor. Qatnaşiş uçun tavsiya kerak emas.",
  index: "Loyihalar röyxati",
  localNav: "Loyihalar böyiça navigatsiya",
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
  upopNote: "Röyxatdan ötiş faqat upop.uz saytida. Bu sayt kastingni ötkazmaydi, faqat u haqida xabar beradi.",
  openExternal: "upop.uz saytiga ötiş",
  mediaPending: "Video taşkilotdan kelgaç şu yerda çiqadi",
  ageSticker: "{from}–{to} yoş",
  newSticker: "Yangi",
  curtainLabel: "Sahna pardasi",
};
