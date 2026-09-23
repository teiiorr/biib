import type { Milestone } from "./types";

/** Tarix sanalari tashkilotdan kelmagan: ustunlar tuzilmaviy oʻrinbosar bilan chiziladi. */
export const MILESTONES: readonly Milestone[] = [
  {
    id: "founding",
    status: "pending",
    year: null,
    title: {
      uz: "Birlashma taʼsis etildi",
      oz: "Бирлашма таъсис этилди",
      ozbekca: "Birlaşma taʼsis etildi",
      ru: "Основание объединения",
      en: "The association is founded",
    },
    text: {
      uz: "Taʼsis sanasi va hujjati tashkilotdan tasdiq kutmoqda.",
      oz: "Таъсис санаси ва ҳужжати ташкилотдан тасдиқ кутмоқда.",
      ozbekca: "Taʼsis sanasi va hujjati taşkilotdan tasdiq kutmoqda.",
      ru: "Дата и документ об основании ожидают подтверждения объединения.",
      en: "The founding date and document await confirmation by the association.",
    },
  },
  {
    id: "studios",
    status: "pending",
    year: null,
    title: {
      uz: "Birinchi hududiy studiyalar",
      oz: "Биринчи ҳудудий студиялар",
      ozbekca: "Birinçi hududiy studiyalar",
      ru: "Первые региональные студии",
      en: "The first regional studios",
    },
    text: {
      uz: "Qaysi viloyatlarda va qachon ochilgani tasdiq kutmoqda.",
      oz: "Қайси вилоятларда ва қачон очилгани тасдиқ кутмоқда.",
      ozbekca: "Qaysi viloyatlarda va qaçon oçilgani tasdiq kutmoqda.",
      ru: "В каких областях и когда они открылись, ожидает подтверждения.",
      en: "Which regions and when await confirmation.",
    },
  },
  {
    id: "upop",
    status: "pending",
    year: null,
    title: {
      uz: "UPOP TREND birinchi mavsumi",
      oz: "UPOP TREND биринчи мавсуми",
      ozbekca: "UPOP TREND birinçi mavsumi",
      ru: "Первый сезон UPOP TREND",
      en: "The first season of UPOP TREND",
    },
    text: {
      uz: "Kastingning birinchi mavsumi sanasi tasdiq kutmoqda.",
      oz: "Кастингнинг биринчи мавсуми санаси тасдиқ кутмоқда.",
      ozbekca: "Kastingning birinçi mavsumi sanasi tasdiq kutmoqda.",
      ru: "Дата первого сезона кастинга ожидает подтверждения.",
      en: "The date of the first audition season awaits confirmation.",
    },
  },
];
