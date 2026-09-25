// Avtomatik: scripts/transliterate.mts uz/errors.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { errors as source } from "../uz/errors";

export const errors: typeof source = {
  notFound: {
    title: "Sahifa topilmadi",
    text: "Bu manzilda sahifa yöq yoki u köçirilgan.",
    home: "Boş sahifaga",
    news: "Yangiliklarga",
  },
  error: {
    title: "Nimadir notöğri ketdi",
    text: "Sahifani qayta yuklab köring. Muammo takrorlansa, biz bilan boğlaning.",
    retry: "Qayta uriniş",
    home: "Boş sahifaga",
  },
  global: {
    title: "Sahifa topilmadi",
    text: "Bu manzilda sahifa yöq. Tilni tanlang:",
  },
};
