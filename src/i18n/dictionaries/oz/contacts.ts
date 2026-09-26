// Avtomatik: scripts/transliterate.mts uz/contacts.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { contacts as source } from "../uz/contacts";

export const contacts: typeof source = {
  title: "Алоқа",
  details: {
    heading: "Реквизитлар",
    address: "Манзил",
    phone: "Телефон",
    email: "Почта",
    telegram: "Телеграм",
    hours: "Иш вақти",
    copy: "Нусха олиш",
    copied: "Нусха олинди",
  },
  map: {
    yandex: "Яндекс Харита",
    google: "Google Харита",
  },
  form: {
    heading: "Хабар юбориш",
    name: "Исмингиз",
    contact: "Телефон ёки почта",
    message: "Хабар",
    consent: "Маълумотларим {privacy} бўйича қайта ишланишига розиман",
    consentLink: "махфийлик сиёсати",
    submit: "Юбориш",
    sending: "Юборилмоқда",
    success: "Хабар юборилди. Раҳмат, тез орада жавоб берамиз.",
    error: "Юбориб бўлмади. Телеграм орқали ёзинг ёки кейинроқ уриниб кўринг.",
    tooFast: "Шакл жуда тез тўлдирилди, қайта юборинг.",
    required: "Бу майдон мажбурий",
    invalidContact: "Телефон рақами ёки почта манзилини киритинг",
    tooShort: "Хабар камида {min} белгидан иборат бўлсин",
    consentRequired: "Юбориш учун розилик керак",
    fallbackHeading: "Телеграм орқали ёзинг",
    fallbackCta: "Телеграмда ёзиш",
  },
  socials: {
    heading: "Ижтимоий тармоқлар",
  },
};
