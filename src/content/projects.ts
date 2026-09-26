import type { Project } from "./types";

/**
 * Yagona loyiha: UPOP TREND. Matnlar qoralama (draft): tashkilot tasdiqlaguncha sahifa noindex.
 * Joy, vaqt va ustoz tashkilotdan kelishi kerak (pending). Media egasi bergan fayllardan (draft).
 */
export const PROJECTS: readonly Project[] = [
  {
    key: "upop-trend",
    status: "draft",
    flagship: true,
    name: {
      uz: "UPOP TREND",
      oz: "UPOP TREND",
      ozbekca: "UPOP TREND",
      ru: "UPOP TREND",
      en: "UPOP TREND",
    },
    tagline: {
      uz: "Milliy qoʻshiqchilik kastingi",
      oz: "Миллий қўшиқчилик кастинги",
      ozbekca: "Milliy qöşiqçilik kastingi",
      ru: "Национальный вокальный кастинг",
      en: "National singing auditions",
    },
    age: {
      from: 14,
      to: 19,
      status: "draft",
    },
    format: {
      value: {
        uz: "Viloyat bosqichlari, yarim final va poytaxtdagi yakuniy konsert",
        oz: "Вилоят босқичлари, ярим финал ва пойтахтдаги якуний концерт",
        ozbekca: "Viloyat bosqiçlari, yarim final va poytaxtdagi yakuniy konsert",
        ru: "Областные этапы, полуфинал и финальный концерт в столице",
        en: "Regional rounds, a semi-final and a final concert in the capital",
      },
      status: "draft",
    },
    place: {
      value: null,
      status: "pending",
    },
    schedule: {
      value: null,
      status: "pending",
    },
    cost: {
      free: true,
      status: "draft",
    },
    teacher: {
      value: null,
      status: "pending",
    },
    highlights: {
      uz: [
        "Ariza bepul, tavsiya kerak emas",
        "14 yoshdan 19 yoshgacha",
        "Yakuniy konsert poytaxt sahnasida",
      ],
      oz: [
        "Ариза бепул, тавсия керак эмас",
        "14 ёшдан 19 ёшгача",
        "Якуний концерт пойтахт саҳнасида",
      ],
      ozbekca: [
        "Ariza bepul, tavsiya kerak emas",
        "14 yoşdan 19 yoşgaça",
        "Yakuniy konsert poytaxt sahnasida",
      ],
      ru: [
        "Заявка бесплатная, рекомендации не нужны",
        "От 14 до 19 лет",
        "Финальный концерт на столичной сцене",
      ],
      en: [
        "Applying is free, no reference needed",
        "From 14 to 19 years old",
        "Final concert on a stage in the capital",
      ],
    },
    external: {
      href: "https://upop.uz",
      label: "upop.uz",
    },
    media: {
      loop: {
        desktop: { webm: "/media/upop-live-d.webm", mp4: "/media/upop-live-d.mp4" },
        mobile: { webm: "/media/upop-live-m.webm", mp4: "/media/upop-live-m.mp4" },
        poster: "/media/upop-live-poster.avif",
        width: 1280,
        height: 720,
        alt: {
          uz: "Milliy libosdagi toʻrt qiz sahnada: doira, dutor va mikrofon, ortda suzani naqshi",
          oz: "Миллий либосдаги тўрт қиз саҳнада: доира, дутор ва микрофон, ортда сўзана нақши",
          ozbekca:
            "Milliy libosdagi tört qiz sahnada: doira, dutor va mikrofon, ortda suzani naqşi",
          ru: "Четыре девушки в национальных костюмах на сцене: дойра, дутар и микрофон, позади узор сюзане",
          en: "Four young women in national dress on stage with a doira, a dutar and a microphone, a suzani pattern behind them",
        },
        status: "draft",
      },
      film: {
        src: "/media/upop-video.mp4",
        poster: "/media/upop-video-poster.avif",
        duration: 54,
        alt: {
          uz: "Loyiha muhokamasi: yigʻilish stolida chiqish qilayotgan rahbar",
          oz: "Лойиҳа муҳокамаси: йиғилиш столида чиқиш қилаётган раҳбар",
          ozbekca: "Loyiha muhokamasi: yiğiliş stolida çiqiş qilayotgan rahbar",
          ru: "Обсуждение проекта: выступление руководителя за столом совещания",
          en: "A discussion of the project: a speaker at the meeting table",
        },
        status: "draft",
      },
      wordmark: {
        src: "/brand/upop-logo.png",
        width: 900,
        height: 703,
        alt: {
          uz: "UPOP TREND logotipi",
          oz: "UPOP TREND логотипи",
          ozbekca: "UPOP TREND logotipi",
          ru: "Логотип UPOP TREND",
          en: "The UPOP TREND logo",
        },
      },
    },
  },
];
