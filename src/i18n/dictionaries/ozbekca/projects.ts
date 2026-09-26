// Avtomatik: scripts/transliterate.mts uz/projects.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { projects as source } from "../uz/projects";

export const projects: typeof source = {
  title: "UPOP TREND",
  facts: {
    heading: "Asosiy maʼlumot",
    age: "Yoş",
    format: "Şakl",
    place: "Joy",
    schedule: "Vaqt",
    cost: "Narx",
    teacher: "Ustoz",
    free: "Bepul",
  },
  filmHeading: "Jarayon",
  playFilm: "Videoni ijro etiş",
  registrationHeading: "Röyxatdan ötiş",
  openExternal: "upop.uz saytiga ötiş",
};
