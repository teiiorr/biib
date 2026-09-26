import type { Contacts } from "./types";

/**
 * Manzil, telefonlar va pochta tashkilotdan (egasi, 2026-09-26). Ijtimoiy tarmoqlar oldingi saytdan.
 * Ish vaqti va xarita nuqtasi hali tasdiq kutmoqda (docs/qa/content-pending.md).
 * Raqamlarda boʻlinmas boʻshliq: qator oʻrtasida uzilmaydi (tel: havolasi uni olib tashlaydi).
 */
export const CONTACTS: Contacts = {
  address: {
    value: {
      uz: "100011, Oʻzbekiston, Toshkent, Shayxontohur tumani, Abdulla Qodiriy koʻchasi, 35-uy",
      oz: "100011, Ўзбекистон, Тошкент, Шайхонтоҳур тумани, Абдулла Қодирий кўчаси, 35-уй",
      ozbekca: "100011, Özbekiston, Toşkent, Şayxontohur tumani, Abdulla Qodiriy köçasi, 35-uy",
      ru: "100011, Узбекистан, Ташкент, Шайхантахурский район, улица Абдуллы Кадыри, дом 35",
      en: "35 Abdulla Qodiriy Street, Shaykhantahur District, Tashkent 100011, Uzbekistan",
    },
    status: "confirmed",
  },
  phones: {
    value: ["+998 55 511 15 05", "+998 77 495 00 40", "+998 94 682 27 06"],
    status: "confirmed",
  },
  email: { value: "biib02062026@gmail.com", status: "confirmed" },
  telegram: { value: "https://t.me/bolalar_ijodkorligi", status: "confirmed" },
  hours: { value: null, status: "pending" },
  map: { value: null, status: "pending" },
  socials: [
    {
      id: "telegram",
      href: "https://t.me/bolalar_ijodkorligi",
      label: "Telegram",
      status: "confirmed",
    },
    {
      id: "instagram",
      href: "https://www.instagram.com/bolalar_ijodkorligi",
      label: "Instagram",
      status: "confirmed",
    },
    {
      id: "youtube",
      href: "https://www.youtube.com/@bolalar_ijodkorligi",
      label: "YouTube",
      status: "confirmed",
    },
    {
      id: "facebook",
      href: "https://www.facebook.com/profile.php?id=61593281378591",
      label: "Facebook",
      status: "confirmed",
    },
  ],
};
