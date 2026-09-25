// Avtomatik: scripts/transliterate.mts uz/contacts.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { contacts as source } from "../uz/contacts";

export const contacts: typeof source = {
  title: "Aloqa",
  lead: "Savol, taklif va hamkorlik uçun. Iş kunlari bir kun içida javob beramiz.",
  details: {
    heading: "Rekvizitlar",
    address: "Manzil",
    phone: "Telefon",
    email: "Poçta",
    telegram: "Telegram",
    hours: "Iş vaqti",
    hoursValue: "Duşanba–juma, 09:00–18:00",
    copy: "Nusxa oliş",
    copied: "Nusxa olindi",
    pending: "Tasdiq kutilmoqda",
  },
  map: {
    heading: "Xaritada",
    yandex: "Yandex Xaritada oçiş",
    google: "Google Xaritada oçiş",
    pending: "Manzil nuqtasi taşkilot tasdiğini kutmoqda",
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
    fallbackText: "Şakl hozirça ulanmagan, xabarni töğridan-töğri Telegramda yuborişingiz mumkin.",
    fallbackCta: "Telegramda yoziş",
  },
  socials: {
    heading: "Ijtimoiy tarmoqlar",
  },
};
