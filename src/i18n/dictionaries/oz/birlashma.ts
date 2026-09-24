// Avtomatik: scripts/transliterate.mts uz/birlashma.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { birlashma as source } from "../uz/birlashma";

export const birlashma: typeof source = {
  note: {
    hero: "Бу ерда ҳар бир чизиқ боланики",
    mission: "Саҳна кейин топилади",
  },
  stickers: {
    age: "{from}–{to} ёш",
    new: "Янги",
    free: "Бепул",
  },
  paperAlt: "Сканерланган қоғоз текстураси",
  chalkAlt: "Доска текстураси",
  pinAlt: "Магнит",
  clothespinAlt: "Кир қисқич",
  poster: "Концерт афишаси",
  ticket: "Чипта",
  curtain: "Парда",
  confettiLabel: "Қоғоз конфетти",
  horizon: "Қалам билан чизилган уфқ чизиғи",
  gallery: {
    wall: "Девор",
    caption: "{name}, {age} ёш, {region} · «{title}»",
  },
  sounds: {
    pencil: "Қалам овози",
    paper: "Қоғоз шитирлаши",
    xylophone: "Ксилофон",
  },
};
