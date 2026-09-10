import type { SocialLink } from "./types";

/**
 * TAŞKILOT MAʼLUMOTLARI — mijozdan tasdiq kerak.
 * Telefon, poçta, manzil va ijtimoiy tarmoq havolalari şu yerda turadi.
 * Tarjima qilinadigan qismi (manzil, iş vaqti) messages fayllarida emas,
 * quyidagi ORG_TEXT da — çunki bu kontent, interfeys emas.
 */

export const ORG = {
  phones: ["+998 71 200 00 00", "+998 90 000 00 00"],
  email: "info@biib.uz",
  /** Yandex Xarita havolasi — mijoz aniq nuqtani bergaç almaştiriladi. */
  mapUrl: "https://yandex.uz/maps/10335/tashkent/",
  socials: [
    { id: "telegram", href: "https://t.me/biib_uz", label: "Telegram" },
    { id: "instagram", href: "https://instagram.com/biib_uz", label: "Instagram" },
    { id: "youtube", href: "https://youtube.com/@biib_uz", label: "YouTube" },
    { id: "facebook", href: "https://facebook.com/biib.uz", label: "Facebook" },
  ] as const satisfies readonly SocialLink[],
} as const;
