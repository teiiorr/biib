import type { Person } from "./types";

/**
 * Rahbariyat birlashma ustavi boʻyicha (6-boʻlim). Tartib egasidan: rais, ijrochi direktor, keyin
 * hamrais va taftish komissiyasi raisi. Rais ismi ustavdagi imzodan (J. Ahmedov), ijrochi direktor va
 * ikkala surat egasidan. Pochta va qolgan ismlar tashkilotdan kutilmoqda.
 */
export const LEADERSHIP: readonly Person[] = [
  {
    id: "leader-chair",
    kind: "leader",
    status: "confirmed",
    name: {
      uz: "J. Ahmedov",
      oz: "Ж. Аҳмедов",
      ozbekca: "J. Ahmedov",
      ru: "Ж. Ахмедов",
      en: "J. Ahmedov",
    },
    role: {
      uz: "Birlashma raisi",
      oz: "Бирлашма раиси",
      ozbekca: "Birlaşma raisi",
      ru: "Председатель объединения",
      en: "Chair of the association",
    },
    field: null,
    bio: null,
    photo: "/brand/leader-chair.jpg",
    reception: null,
    email: null,
  },
  {
    id: "leader-director",
    kind: "leader",
    status: "confirmed",
    name: {
      uz: "Hasan Toshxoʻjayev",
      oz: "Ҳасан Тошхўжаев",
      ozbekca: "Hasan Toşxöjayev",
      ru: "Хасан Тошходжаев",
      en: "Hasan Toshxoʻjayev",
    },
    role: {
      uz: "Ijrochi direktor",
      oz: "Ижрочи директор",
      ozbekca: "Ijroçi direktor",
      ru: "Исполнительный директор",
      en: "Executive director",
    },
    field: null,
    bio: null,
    photo: "/brand/leader-director.jpg",
    reception: null,
    email: null,
  },
  {
    id: "leader-cochair",
    kind: "leader",
    status: "pending",
    name: null,
    role: {
      uz: "Birlashma hamraisi",
      oz: "Бирлашма ҳамраиси",
      ozbekca: "Birlaşma hamraisi",
      ru: "Сопредседатель объединения",
      en: "Co-chair of the association",
    },
    field: null,
    bio: null,
    photo: null,
    reception: null,
    email: null,
  },
  {
    id: "leader-audit",
    kind: "leader",
    status: "pending",
    name: null,
    role: {
      uz: "Taftish komissiyasi raisi",
      oz: "Тафтиш комиссияси раиси",
      ozbekca: "Taftiş komissiyasi raisi",
      ru: "Председатель ревизионной комиссии",
      en: "Chair of the audit commission",
    },
    field: null,
    bio: null,
    photo: null,
    reception: null,
    email: null,
  },
];
