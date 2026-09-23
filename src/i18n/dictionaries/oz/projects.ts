// Avtomatik: scripts/transliterate.mts uz/projects.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { projects as source } from "../uz/projects";

export const projects: typeof source = {
  title: "Лойиҳалар",
  lead: "Тўрт йўналиш, ҳар бирида ўз ёш чегараси, тартиби ва устози бор. Қатнашиш учун тавсия керак эмас.",
  index: "Лойиҳалар рўйхати",
  localNav: "Лойиҳалар бўйича навигатсия",
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
  upopNote: "Рўйхатдан ўтиш фақат upop.уз сайтида. Бу сайт кастингни ўтказмайди, фақат у ҳақида хабар беради.",
  openExternal: "upop.уз сайтига ўтиш",
  mediaPending: "Видео ташкилотдан келгач шу ерда чиқади",
  ageSticker: "{from}–{to} ёш",
  newSticker: "Янги",
  curtainLabel: "Саҳна пардаси",
};
