// Avtomatik: scripts/transliterate.mts uz/projects.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { projects as source } from "../uz/projects";

export const projects: typeof source = {
  title: "UPOP TREND",
  lead: "Миллий қўшиқчилик кастинги: вилоят босқичлари, ярим финал ва пойтахтдаги якуний концерт. Ариза бепул, тавсия керак эмас.",
  facts: {
    heading: "Асосий маълумот",
    age: "Ёш",
    format: "Шакл",
    place: "Жой",
    schedule: "Вақт",
    cost: "Нарх",
    teacher: "Устоз",
    free: "Бепул",
    pending: "Тасдиқ кутилмоқда",
  },
  filmHeading: "Кастинг ҳақида видео",
  filmLead: "Лойиҳа ҳақида қисқа видео. Овози бор, босилганда юкланади.",
  playFilm: "Видеони ижро этиш",
  registrationHeading: "Рўйхатдан ўтиш",
  upopNote: "Рўйхатдан ўтиш фақат upop.uz сайтида. Бу сайт кастингни ўтказмайди, фақат у ҳақида хабар беради.",
  openExternal: "upop.uz сайтига ўтиш",
  mediaPending: "Видео ташкилотдан келгач шу ерда чиқади",
};
