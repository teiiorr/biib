// Avtomatik: scripts/transliterate.mts uz/appearance.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { appearance as source } from "../uz/appearance";

export const appearance: typeof source = {
  panel: "Кўриниш",
  open: "Кўринишни созлаш",
  close: "Ёпиш",
  theme: {
    label: "Мавзу",
    light: "Ёруғ",
    dark: "Тунги",
    system: "Тизим",
  },
  transparency: "Шаффофлик",
  transparencyFrom: "Хира",
  transparencyTo: "Тиниқ",
  density: "Зичлик",
  densityFrom: "Юпқа",
  densityTo: "Қалин",
  reset: "Аслига қайтариш",
  sound: "Овоз",
  soundHint: "Мавзу ва саҳифа алмашганда енгил доира овози",
  motion: "Ҳаракат",
  motionHint: "Безак ҳаракатлари; матн ва саҳифа ўтишлари сақланади",
  design: "Дизайн",
  designAtlas: "Атлас",
  designAtlasHint: "Миллий нақшлар ва ойна",
  designBirlashma: "Бирлашма",
  designBirlashmaHint: "Болалар ижоди руҳида",
  valueText: "{value}%",
  reducedTransparency: "Тизимда шаффофлик камайтирилган, шу сабаб созлагичлар ўчирилган",
  previewAlt: "{design} дизайнининг кичик намунаси",
};
