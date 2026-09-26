// Avtomatik: scripts/transliterate.mts uz/common.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { common as source } from "../uz/common";

export const common: typeof source = {
  brand: {
    name: "Болалар Ижодкорлиги Ижодий Бирлашмаси",
    tagline: "Ўзбекистонда болалар ва ўсмирлар ижодини қўллаб-қувватлайдиган бирлашма",
    markAlt: "Бирлашма белгиси",
  },
  skipToContent: "Асосий қисмга ўтиш",
  actions: {
    all: "Барчаси",
    home: "Бош саҳифага",
    retry: "Қайта уриниш",
    copy: "Нусха олиш",
    copied: "Нусха олинди",
    open: "Очиш",
    close: "Ёпиш",
    shareTelegram: "Телеграмда улашиш",
    copyLink: "Ҳаволани нусхалаш",
    linkCopied: "Ҳавола нусхаланди",
    pause: "Тўхтатиб туриш",
    play: "Давом эттириш",
    clear: "Тозалаш",
    send: "Юбориш",
    sending: "Юборилмоқда",
    previous: "Олдинги",
    next: "Кейинги",
  },
  hints: {
    external: "ташқи сайтда очилади",
    breadcrumbs: "Сиз шу ердасиз",
  },
  status: {
    updated: "Янгиланган",
  },
  placeholder: {
    photo: "Сурат кутилмоқда",
  },
  reading: {
    progress: "Ўқиш жараёни",
    value: "Мақоланинг {percent}% ўқилди",
  },
  time: {
    readingTime: "{minutes} дақиқа ўқиш",
  },
  age: {
    range: "{from}–{to} ёш",
    from: "{from} ёшдан",
  },
};
