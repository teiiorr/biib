import type { SocialLink } from "./types";

/**
 * TAŞKILOT MAʼLUMOTLARI. İjtimoiy tarmoq havolalari haqiqiy.
 * Telefon, poçta va xarita nuqtasi hali mijozdan tasdiq kutyapti.
 * Tarjima qilinadigan qismi (manzil, iş vaqti) messages fayllarida emas,
 * quyidagi ORG_TEXT da — çunki bu kontent, interfeys emas.
 */

/**
 * Taşkilot nomi logotip yonida barça tillarda bir xil yoziladi:
 * bu tarjima qilinadigan ibora emas, brendning öz yozuvi.
 */
export const BRAND_NAME = {
  line1: "BOLALAR IJODKORLIGI",
  line2: "IJODIY BIRLASHMASI",
  full: "BOLALAR IJODKORLIGI IJODIY BIRLASHMASI",
} as const;

export const ORG = {
  phones: ["+998 71 200 00 00", "+998 90 000 00 00"],
  email: "info@biib.uz",
  /** Yandex Xarita havolasi — mijoz aniq nuqtani bergaç almaştiriladi. */
  mapUrl: "https://yandex.uz/maps/10335/tashkent/",
  socials: [
    { id: "telegram", href: "https://t.me/bolalar_ijodkorligi", label: "Telegram" },
    {
      id: "instagram",
      href: "https://www.instagram.com/bolalar_ijodkorligi",
      label: "Instagram",
    },
    { id: "youtube", href: "https://www.youtube.com/@bolalar_ijodkorligi", label: "YouTube" },
    {
      // m.facebook.com faqat telefon uçun; www hamma joyda toʻgʻri oçiladi.
      id: "facebook",
      href: "https://www.facebook.com/profile.php?id=61593281378591",
      label: "Facebook",
    },
  ] as const satisfies readonly SocialLink[],
} as const;
