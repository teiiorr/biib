import type { NewsArticle } from "./../types";

/** Qoralama: sana va muqova tashkilot tasdigʻidan keyin ochiladi. */
export const rangliOlamKorgazmasi: NewsArticle = {
  slug: "rangli-olam-korgazmasi",
  status: "draft",
  date: "2026-07-14",
  project: "rangli-olam",
  topic: {
    uz: "Koʻrgazma",
    oz: "Кўргазма",
    ozbekca: "Körgazma",
    ru: "Выставка",
    en: "Exhibition",
  },
  title: {
    uz: "Rangli olam koʻrgazmasi viloyatlar boʻylab yoʻlga chiqdi",
    oz: "Рангли олам кўргазмаси вилоятлар бўйлаб йўлга чиқди",
    ozbekca: "Rangli olam körgazmasi viloyatlar böylab yölga çiqdi",
    ru: "Выставка «Рангли олам» отправилась по областям",
    en: "The Rangli olam exhibition sets off around the regions",
  },
  lead: {
    uz: "Yil davomida yigʻilgan ishlardan koʻchma koʻrgazma tuzildi. Birinchi toʻxtash — Samarqand.",
    oz: "Йил давомида йиғилган ишлардан кўчма кўргазма тузилди. Биринчи тўхташ — Самарқанд.",
    ozbekca: "Yil davomida yiğilgan işlardan köçma körgazma tuzildi. Birinçi töxtaş — Samarqand.",
    ru: "Из работ, собранных за год, составили передвижную выставку. Первая остановка — Самарканд.",
    en: "A travelling exhibition has been put together from the work collected over the year. The first stop is Samarkand.",
  },
  body: {
    uz: [
      "Koʻrgazmaga oltmishdan ortiq ish tanlandi: rasm, grafika va amaliy sanʼat. Tanlovni ekspertlar kengashi oʻtkazdi.",
      "Har bir ish yonida muallifning ismi, yoshi va studiyasi koʻrsatilgan. Kirish bepul.",
      "Koʻrgazma har shaharda oʻn kun turadi, keyin keyingisiga oʻtadi.",
    ],
    oz: [
      "Кўргазмага олтмишдан ортиқ иш танланди: расм, графика ва амалий санъат. Танловни экспертлар кенгаши ўтказди.",
      "Ҳар бир иш ёнида муаллифнинг исми, ёши ва студияси кўрсатилган. Кириш бепул.",
      "Кўргазма ҳар шаҳарда ўн кун туради, кейин кейингисига ўтади.",
    ],
    ozbekca: [
      "Körgazmaga oltmişdan ortiq iş tanlandi: rasm, grafika va amaliy sanʼat. Tanlovni ekspertlar kengaşi ötkazdi.",
      "Har bir iş yonida muallifning ismi, yoşi va studiyasi körsatilgan. Kiriş bepul.",
      "Körgazma har şaharda ön kun turadi, keyin keyingisiga ötadi.",
    ],
    ru: [
      "На выставку отобрали больше шестидесяти работ: рисунок, графика и прикладное искусство. Отбор провёл экспертный совет.",
      "Рядом с каждой работой указаны имя автора, его возраст и студия. Вход свободный.",
      "В каждом городе выставка стоит десять дней, потом едет дальше.",
    ],
    en: [
      "More than sixty pieces were chosen for the exhibition: drawing, graphic art and applied art. The selection was made by the expert council.",
      "Next to each piece is the name, the age and the studio of the author. Entry is free.",
      "The exhibition stays ten days in each city, then moves on to the next.",
    ],
  },
  cover: {
    src: "/brand/news-rangli-olam.jpg",
    alt: {
      uz: "Devorga osilgan bolalar rasmlari qatori",
      oz: "Деворга осилган болалар расмлари қатори",
      ozbekca: "Devorga osilgan bolalar rasmlari qatori",
      ru: "Ряд детских рисунков на стене",
      en: "A row of children’s drawings hung on a wall",
    },
    status: "pending",
  },
  story: {
    primary: "art-4",
    secondary: "art-6",
  },
};
