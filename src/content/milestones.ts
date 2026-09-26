import type { Milestone } from "./types";

/**
 * Tarix: har bosqich bitta qator va yil (egasining talabi: «Ustav tasdiqlandi (2026)»). Taʼsis va davlat
 * roʻyxati ustavdan (2026); qolgan bosqichlar sanasi tashkilotdan kutilmoqda.
 */
export const MILESTONES: readonly Milestone[] = [
  {
    id: "founding",
    status: "confirmed",
    year: 2026,
    title: {
      uz: "Ustav tasdiqlandi",
      oz: "Устав тасдиқланди",
      ozbekca: "Ustav tasdiqlandi",
      ru: "Устав утверждён",
      en: "Charter approved",
    },
  },
  {
    id: "registration",
    status: "confirmed",
    year: 2026,
    title: {
      uz: "Adliya vazirligida roʻyxatdan oʻtdi",
      oz: "Адлия вазирлигида рўйхатдан ўтди",
      ozbekca: "Adliya vazirligida röyxatdan ötdi",
      ru: "Зарегистрировано в Министерстве юстиции",
      en: "Registered with the Ministry of Justice",
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
  },
];
