import type { Locale } from "@/i18n/locales";

/**
 * Kontent şakli. Har bir matn maydoni beş tilda — TypeScript bittasi
 * tuşib qolsa darrov aytadi. CMS kelganda faqat şu fayllar almaşadi,
 * komponentlar tegilmaydi.
 */
export type Localized<T = string> = Record<Locale, T>;

/** Bölimga qöyiladigan böyoq. Bir ekranda ikki-uçtasi. */
export type Accent = "sun" | "coral" | "grass" | "pink" | "grape" | "blue";

export interface ProjectItem {
  readonly id: string;
  /** Ataqli ot — barça tillarda bir xil yozilsa ham, kiril uçun alohida yozuv kerak. */
  readonly name: Localized;
  readonly tagline: Localized;
  readonly body: Localized<readonly string[]>;
  readonly accent: Accent;
  readonly illustration: ProjectIllustration;
  /** Alohida saytga havola, masalan upop.uz. */
  readonly external?: { readonly href: string; readonly label: string };
  readonly flagship?: boolean;
  /** Sanoq emas, tirik matn: "12 viloyat", "2019 yildan beri". */
  readonly facts: Localized<readonly string[]>;
}

export type ProjectIllustration = "stage" | "palette" | "curtain" | "storybook";

export interface NewsItem {
  readonly slug: string;
  /** ISO sana. Körsatiş Intl orqali. */
  readonly date: string;
  readonly topic: Localized;
  readonly title: Localized;
  readonly lead: Localized;
  readonly body: Localized<readonly string[]>;
  /** Mijozdan keladigan surat. Bölmasa — çizilgan örinbosar körsatiladi. */
  readonly cover?: string;
  readonly coverAlt: Localized;
  readonly accent: Accent;
}

export type PersonKind = "council" | "leadership";

export interface Person {
  readonly id: string;
  readonly name: Localized;
  readonly role: Localized;
  readonly bio: Localized;
  /** Portret sureti. Bölmasa — çizilgan örinbosar. */
  readonly photo?: string;
  readonly kind: PersonKind;
}

export interface Partner {
  readonly id: string;
  /** Mijoz nomni bergaç töldiriladi. Bölmasa — "Hamkor tashkilot N" körsatiladi. */
  readonly name?: Localized;
  /** Hamkorning haqiqiy logotipi. Bölmasa — çizilgan örinbosar. */
  readonly logo?: string;
  readonly accent: Accent;
  readonly href?: string;
}

export interface SocialLink {
  readonly id: "telegram" | "instagram" | "youtube" | "facebook";
  readonly href: string;
  readonly label: string;
}
