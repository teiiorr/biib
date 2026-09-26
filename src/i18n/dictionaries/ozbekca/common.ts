// Avtomatik: scripts/transliterate.mts uz/common.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { common as source } from "../uz/common";

export const common: typeof source = {
  brand: {
    name: "Bolalar Ijodkorligi Ijodiy Birlaşmasi",
    tagline: "Özbekistonda bolalar va ösmirlar ijodini qöllab-quvvatlaydigan birlaşma",
    markAlt: "Birlaşma belgisi",
  },
  skipToContent: "Asosiy qismga ötiş",
  actions: {
    all: "Barçasi",
    home: "Boş sahifaga",
    retry: "Qayta uriniş",
    copy: "Nusxa oliş",
    copied: "Nusxa olindi",
    open: "Oçiş",
    close: "Yopiş",
    shareTelegram: "Telegramda ulaşiş",
    copyLink: "Havolani nusxalaş",
    linkCopied: "Havola nusxalandi",
    pause: "Töxtatib turiş",
    play: "Davom ettiriş",
    clear: "Tozalaş",
    send: "Yuboriş",
    sending: "Yuborilmoqda",
    previous: "Oldingi",
    next: "Keyingi",
  },
  hints: {
    external: "taşqi saytda oçiladi",
    breadcrumbs: "Siz şu yerdasiz",
  },
  status: {
    awaiting: "Tasdiq kutilmoqda",
    pending: "Maʼlumot taşkilotdan tasdiq kutmoqda",
    updated: "Yangilangan",
  },
  placeholder: {
    photo: "Surat kutilmoqda",
  },
  reading: {
    progress: "Öqiş jarayoni",
    value: "Maqolaning {percent}% öqildi",
  },
  time: {
    readingTime: "{minutes} daqiqa öqiş",
  },
  age: {
    range: "{from}–{to} yoş",
    from: "{from} yoşdan",
  },
};
