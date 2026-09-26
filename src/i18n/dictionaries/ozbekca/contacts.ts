// Avtomatik: scripts/transliterate.mts uz/contacts.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { contacts as source } from "../uz/contacts";

export const contacts: typeof source = {
  title: "Aloqa",
  details: {
    heading: "Rekvizitlar",
    address: "Manzil",
    phone: "Telefon",
    email: "Poçta",
    telegram: "Telegram",
    hours: "Iş vaqti",
    copy: "Nusxa oliş",
    copied: "Nusxa olindi",
  },
  map: {
    yandex: "Yandex Xaritada oçiş",
    google: "Google Xaritada oçiş",
  },
  form: {
    heading: "Xabar yuboriş",
    name: "Ismingiz",
    contact: "Telefon yoki poçta",
    message: "Xabar",
    consent: "Maʼlumotlarim {privacy} böyiça qayta işlanişiga roziman",
    consentLink: "maxfiylik siyosati",
    submit: "Yuboriş",
    sending: "Yuborilmoqda",
    success: "Xabar yuborildi. Rahmat, tez orada javob beramiz.",
    error: "Yuborib bölmadi. Telegram orqali yozing yoki keyinroq urinib köring.",
    tooFast: "Şakl juda tez töldirildi, qayta yuboring.",
    required: "Bu maydon majburiy",
    invalidContact: "Telefon raqami yoki poçta manzilini kiriting",
    tooShort: "Xabar kamida {min} belgidan iborat bölsin",
    consentRequired: "Yuboriş uçun rozilik kerak",
    fallbackHeading: "Telegram orqali yozing",
    fallbackCta: "Telegramda yoziş",
  },
  socials: {
    heading: "Ijtimoiy tarmoqlar",
  },
};
