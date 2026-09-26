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
      uz: "Iyun oyida tashabbuskorlarning taʼsis yigʻilishi birlashma ustavini tasdiqladi.",
      oz: "Июнь ойида ташаббускорларнинг таъсис йиғилиши бирлашма уставини тасдиқлади.",
      ozbekca: "Iyun oyida taşabbuskorlarning taʼsis yiğilişi birlaşma ustavini tasdiqladi.",
      ru: "В июне учредительное собрание инициаторов утвердило устав объединения.",
      en: "In June the founding meeting of the initiators approved the charter of the association.",
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
      uz: "Birlashma Oʻzbekiston Respublikasi Adliya vazirligida davlat roʻyxatidan oʻtdi va yuridik shaxs boʻldi.",
      oz: "Бирлашма Ўзбекистон Республикаси Адлия вазирлигида давлат рўйхатидан ўтди ва юридик шахс бўлди.",
      ozbekca:
        "Birlaşma Özbekiston Respublikasi Adliya vazirligida davlat röyxatidan ötdi va yuridik şaxs böldi.",
      ru: "Объединение прошло государственную регистрацию в Министерстве юстиции Республики Узбекистан и стало юридическим лицом.",
      en: "The association was registered with the Ministry of Justice of the Republic of Uzbekistan and became a legal entity.",
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
