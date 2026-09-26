// Avtomatik: scripts/transliterate.mts uz/projects.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { projects as source } from "../uz/projects";

export const projects: typeof source = {
  title: "UPOP TREND",
  facts: {
    heading: "Асосий маълумот",
    age: "Ёш",
    format: "Шакл",
    place: "Жой",
    schedule: "Вақт",
    cost: "Нарх",
    teacher: "Устоз",
    free: "Бепул",
  },
  filmHeading: "Жараён",
  playFilm: "Видеони ижро этиш",
  galleryHeading: "Галерея",
  galleryAlt: "UPOP TREND: {n}-лавҳа",
  registrationHeading: "Рўйхатдан ўтиш",
  openExternal: "upop.uz сайтига ўтиш",
};
