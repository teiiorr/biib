// Avtomatik: scripts/transliterate.mts uz/privacy.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { privacy as source } from "../uz/privacy";

export const privacy: typeof source = {
  title: "Maxfiylik siyosati",
  lead: "Sayt qanday maʼlumot yiğadi, nima uçun va qança vaqt saqlaydi.",
  updated: "Yangilangan: {date}",
  toc: "Mundarija",
  legalPending: "Matn yuridik tekşiruvdan ötmagan, taşkilot tasdiğini kutmoqda.",
  kid: {
    heading: "Qisqaça, oddiy sözlar bilan",
    items: [
      "Biz sen haqingda heç narsa yiğmaymiz: saytda röyxatdan ötiş, izoh va layk yöq.",
      "Rasm yoki surat saytga faqat ota-onang rozi bölsa va sen xohlasang çiqadi.",
      "Agar rasmingni olib taşlaşni xohlasang, ota-onang bizga yozadi, biz olib taşlaymiz.",
    ],
  },
  sections: [
    {
      id: "collected",
      heading: "Nima yiğiladi",
      paragraphs: [
        "Aloqa şakli orqali yuborilgan ism, telefon yoki poçta va xabar matni. Boşqa heç narsa: saytda hisob, izoh, cookie va analitika yöq.",
        "Köriniş sozlamalari (mavzu, dizayn, şaffoflik) faqat sizning brauzeringizda, localStorage içida saqlanadi va bizga yuborilmaydi.",
      ],
    },
    {
      id: "purpose",
      heading: "Nima uçun",
      paragraphs: [
        "Xabaringizga javob beriş va sörovingizni körib çiqiş uçun. Maʼlumot reklama yoki uçinçi şaxslarga berilmaydi.",
      ],
    },
    {
      id: "where",
      heading: "Qayerga yuboriladi",
      paragraphs: [
        "Şakl xabarni Telegram Bot API orqali birlaşmaning xizmat çatiga yuboradi. Şu sabab Telegram serverlari orqali ötadi; bu Özbekiston Respublikasining «Şaxsiy maʼlumotlar töğrisida»gi qonuni (ÖRQ-547, 2019-yil 2-iyul) talablariga muvofiqligi yuridik tekşiruvda.",
      ],
    },
    {
      id: "retention",
      heading: "Qança saqlanadi",
      paragraphs: [
        "Xabar sörov hal bölgunça, köpi bilan 12 oy saqlanadi, keyin öçiriladi.",
      ],
    },
    {
      id: "children",
      heading: "Bolalar işlari va suratlari",
      paragraphs: [
        "Bolaning rasmi yoki surati saytga faqat ota-onaning yozma roziligi va bolaning öz xohişi bilan qöyiladi. Ism faqat birinçi ism, yoş va viloyat körsatiladi; maktab va aniq manzil heç qaçon.",
        "Roziligingizni istalgan vaqtda qaytarib olişingiz mumkin: quyidagi manzilga yozing, iş ikki iş kuni içida olib taşlanadi.",
      ],
    },
    {
      id: "rights",
      heading: "Huquqlaringiz",
      paragraphs: [
        "Özingiz haqingizdagi maʼlumotni söraş, tuzatiş yoki öçirtiriş huquqingiz bor. Sörov aloqa sahifasidagi manzilga yuboriladi.",
      ],
    },
    {
      id: "contact",
      heading: "Boğlaniş",
      paragraphs: [
        "Maxfiylik böyiça savollar uçun aloqa sahifasidagi poçta manziliga yozing.",
      ],
    },
  ],
};
