import type { NewsArticle } from "./../types";

/** Qoralama: sana va muqova tashkilot tasdigʻidan keyin ochiladi. */
export const ustozlarUchunSeminar: NewsArticle = {
  slug: "ustozlar-uchun-seminar",
  status: "draft",
  date: "2026-05-20",
  project: null,
  topic: {
    uz: "Taʼlim",
    oz: "Таълим",
    ozbekca: "Taʼlim",
    ru: "Обучение",
    en: "Training",
  },
  title: {
    uz: "Studiya ustozlari uchun yozgi seminar oʻtkazildi",
    oz: "Студия устозлари учун ёзги семинар ўтказилди",
    ozbekca: "Studiya ustozlari uçun yozgi seminar ötkazildi",
    ru: "Для наставников студий прошёл летний семинар",
    en: "A summer seminar was held for studio mentors",
  },
  lead: {
    uz: "Toʻrt kunlik seminarda oʻquv dasturi, guruh bilan ishlash va baholash muhokama qilindi.",
    oz: "Тўрт кунлик семинарда ўқув дастури, гуруҳ билан ишлаш ва баҳолаш муҳокама қилинди.",
    ozbekca: "Tört kunlik seminarda öquv dasturi, guruh bilan işlaş va baholaş muhokama qilindi.",
    ru: "За четыре дня семинара обсудили учебную программу, работу с группой и оценивание.",
    en: "Over four days the seminar went through the study programme, working with a group and assessment.",
  },
  body: {
    uz: [
      "Seminarga toʻrt yoʻnalishdagi studiyalardan ustozlar yigʻildi. Asosiy mavzu: bir guruhda turli tayyorgarlikdagi bolalar bilan ishlash.",
      "Amaliy qismda ustozlar bir-birining mashgʻulotini kuzatdi va yozma tahlil qildi.",
      "Seminar materiallari studiyalarga tarqatildi va keyingi mavsumda dasturga kiritiladi.",
    ],
    oz: [
      "Семинарга тўрт йўналишдаги студиялардан устозлар йиғилди. Асосий мавзу: бир гуруҳда турли тайёргарликдаги болалар билан ишлаш.",
      "Амалий қисмда устозлар бир-бирининг машғулотини кузатди ва ёзма таҳлил қилди.",
      "Семинар материаллари студияларга тарқатилди ва кейинги мавсумда дастурга киритилади.",
    ],
    ozbekca: [
      "Seminarga tört yönalişdagi studiyalardan ustozlar yiğildi. Asosiy mavzu: bir guruhda turli tayyorgarlikdagi bolalar bilan işlaş.",
      "Amaliy qismda ustozlar bir-birining maşğulotini kuzatdi va yozma tahlil qildi.",
      "Seminar materiallari studiyalarga tarqatildi va keyingi mavsumda dasturga kiritiladi.",
    ],
    ru: [
      "На семинар собрались наставники студий всех четырёх направлений. Главная тема — работа с детьми разной подготовки в одной группе.",
      "В практической части наставники приходили на занятия друг к другу и писали разбор.",
      "Материалы семинара разослали по студиям, в следующем сезоне они войдут в программу.",
    ],
    en: [
      "Mentors from studios in all four directions came to the seminar. The main subject was working with children of different levels in one group.",
      "In the practical part the mentors watched each other’s classes and wrote up what they saw.",
      "The seminar material was sent out to the studios and goes into the programme next season.",
    ],
  },
  cover: {
    src: "/brand/news-seminar.jpg",
    alt: {
      uz: "Doira qilib qoʻyilgan stullar va doskadagi chizmalar",
      oz: "Доира қилиб қўйилган стуллар ва доскадаги чизмалар",
      ozbekca: "Doira qilib qöyilgan stullar va doskadagi çizmalar",
      ru: "Стулья, расставленные кругом, и схемы на доске",
      en: "Chairs arranged in a circle and diagrams on a board",
    },
    status: "pending",
  },
  story: {
    primary: "art-2",
    secondary: "art-5",
  },
};
