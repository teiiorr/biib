import type { Milestone } from "./types";

/** Tarix: taʼsis va davlat roʻyxati ustavdan (2026). Qolgan bosqichlar sanasi tashkilotdan kutilmoqda. */
export const MILESTONES: readonly Milestone[] = [
  {
    id: "founding",
    status: "confirmed",
    year: 2026,
    title: {
      uz: "Taʼsis yigʻilishi",
      oz: "Таъсис йиғилиши",
      ozbekca: "Taʼsis yiğilişi",
      ru: "Учредительное собрание",
      en: "Founding meeting",
    },
    text: {
      uz: "Ustav tasdiqlandi.",
      oz: "Устав тасдиқланди.",
      ozbekca: "Ustav tasdiqlandi.",
      ru: "Устав утверждён.",
      en: "The charter was approved.",
    },
  },
  {
    id: "registration",
    status: "confirmed",
    year: 2026,
    title: {
      uz: "Davlat roʻyxati",
      oz: "Давлат рўйхати",
      ozbekca: "Davlat röyxati",
      ru: "Государственная регистрация",
      en: "State registration",
    },
    text: {
      uz: "Adliya vazirligida roʻyxatdan oʻtdi.",
      oz: "Адлия вазирлигида рўйхатдан ўтди.",
      ozbekca: "Adliya vazirligida röyxatdan ötdi.",
      ru: "Внесено в реестр Минюста.",
      en: "Entered in the state register.",
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
