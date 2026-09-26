// Avtomatik: scripts/transliterate.mts uz/privacy.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { privacy as source } from "../uz/privacy";

export const privacy: typeof source = {
  title: "Maxfiylik siyosati",
  updated: "Yangilangan: {date}",
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
      heading: "Nima yiğiladi va qayerga yuboriladi",
      paragraphs: [
        "Aloqa şakli orqali yuborilgan ism, telefon yoki poçta va xabar matni. Boşqa heç narsa: saytda hisob, izoh, cookie va analitika yöq.",
        "Köriniş sozlamalari (şaffoflik, ziçlik, harakat va ovoz) faqat sizning brauzeringizda, localStorage içida saqlanadi va bizga yuborilmaydi.",
        "Şakl xabarni Telegram Bot API orqali birlaşmaning xizmat çatiga yuboradi. Şu sabab maʼlumot Telegram serverlari orqali ötadi.",
      ],
    },
    {
      id: "purpose",
      heading: "Nima uçun va qança saqlanadi",
      paragraphs: [
        "Xabaringizga javob beriş va sörovingizni körib çiqiş uçun. Maʼlumot reklama yoki uçinçi şaxslarga berilmaydi.",
        "Xabar sörov hal bölgunça, köpi bilan 12 oy saqlanadi, keyin öçiriladi.",
      ],
    },
    {
      id: "children",
      heading: "Bolalar işlari va suratlari",
      paragraphs: [
        "Bolaning rasmi yoki surati saytga faqat ota-onaning yozma roziligi va bolaning öz xohişi bilan qöyiladi. Ism faqat birinçi ism, yoş va viloyat körsatiladi; maktab va aniq manzil heç qaçon.",
        "Roziligingizni istalgan vaqtda qaytarib olişingiz mumkin: aloqa sahifasidagi manzilga yozing, iş ikki iş kuni içida olib taşlanadi.",
      ],
    },
    {
      id: "rights",
      heading: "Huquqlaringiz",
      paragraphs: [
        "Özingiz haqingizdagi maʼlumotni söraş, tuzatiş yoki öçirtiriş huquqingiz bor. Sörov va maxfiylik böyiça savollarni aloqa sahifasidagi poçta manziliga yuboring.",
        "Bu huquqlar Özbekiston Respublikasining «Şaxsga doir maʼlumotlar töğrisida»gi Qonuni (ÖRQ-547, 2019-yil 2-iyul) bilan belgilangan.",
      ],
    },
  ],
};
