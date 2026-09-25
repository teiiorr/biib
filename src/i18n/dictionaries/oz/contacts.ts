// Avtomatik: scripts/transliterate.mts uz/contacts.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { contacts as source } from "../uz/contacts";

export const contacts: typeof source = {
  title: "Алоқа",
  lead: "Савол, таклиф ва ҳамкорлик учун. Иш кунлари бир кун ичида жавоб берамиз.",
  details: {
    heading: "Реквизитлар",
    address: "Манзил",
    phone: "Телефон",
    email: "Почта",
    telegram: "Телеграм",
    hours: "Иш вақти",
    hoursValue: "Душанба–жума, 09:00–18:00",
    copy: "Нусха олиш",
    copied: "Нусха олинди",
    pending: "Тасдиқ кутилмоқда",
  },
  map: {
    heading: "Харитада",
    yandex: "Яндекс Харитада очиш",
    google: "Google Харитада очиш",
    pending: "Манзил нуқтаси ташкилот тасдиғини кутмоқда",
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
    fallbackText: "Шакл ҳозирча уланмаган, хабарни тўғридан-тўғри Телеграмда юборишингиз мумкин.",
    fallbackCta: "Телеграмда ёзиш",
  },
  socials: {
    heading: "Ижтимоий тармоқлар",
  },
};
