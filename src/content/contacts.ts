import type { Contacts } from "./types";

/**
 * Ijtimoiy tarmoq havolalari oldingi saytdan, tashkilotniki.
 * Telefon, pochta, manzil va xarita nuqtasi tashkilotdan tasdiq kutmoqda (docs/qa/content-pending.md).
 */
export const CONTACTS: Contacts = {
  address: { value: null, status: "pending" },
  phones: { value: null, status: "pending" },
  email: { value: null, status: "pending" },
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
