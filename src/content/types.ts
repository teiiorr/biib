import type { Locale } from "@/i18n/locales";
import type { NewsSlug } from "@/i18n/routes";

export type Localized<T = string> = Record<Locale, T>;

/**
 * confirmed: tashkilot tasdiqlagan fakt. draft: biz yozgan, tasdiq kutayotgan matn.
 * pending: faktni tashkilot berishi kerak, hozir tuzilmaviy oʻrinbosar.
 */
export type ContentStatus = "confirmed" | "draft" | "pending";

/** Rang hikoyasi: har loyihaning ikki tokeni (art-1…art-7). */
export type ArtSlot = "art-1" | "art-2" | "art-3" | "art-4" | "art-5" | "art-6" | "art-7";

export interface ColorStory {
  readonly primary: ArtSlot;
  readonly secondary: ArtSlot;
}

export type ProjectKey = "upop-trend";

export interface VideoSources {
  readonly webm: string;
  readonly mp4: string;
}

/** Ovozsiz halqa: faqat koʻrinishda ijro etiladi, telefonga alohida kichik nusxa. */
export interface LoopMedia {
  readonly desktop: VideoSources;
  readonly mobile: VideoSources;
  readonly poster: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Localized;
  readonly status: ContentStatus;
}

/** Bosilganda yuklanadigan film: ovozi saqlanadi, davomiyligi soniyada. */
export interface FilmMedia {
  readonly src: string;
  readonly poster: string;
  readonly duration: number;
  readonly alt: Localized;
  readonly status: ContentStatus;
}

export interface WordmarkMedia {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Localized;
}

export interface ProjectMedia {
  readonly loop: LoopMedia;
  readonly film: FilmMedia;
  readonly wordmark: WordmarkMedia;
}

export interface ProjectFact<T = string> {
  readonly value: Localized<T> | null;
  readonly status: ContentStatus;
}

export interface Project {
  readonly key: ProjectKey;
  readonly status: ContentStatus;
  readonly flagship: boolean;
  readonly name: Localized;
  readonly tagline: Localized;
  readonly age: { readonly from: number; readonly to: number; readonly status: ContentStatus };
  readonly format: ProjectFact;
  readonly place: ProjectFact;
  readonly schedule: ProjectFact;
  readonly cost: { readonly free: boolean | null; readonly status: ContentStatus };
  readonly teacher: ProjectFact;
  /** Qisqa dalillar (qoralama): yosh, shakl, yakun. */
  readonly highlights: Localized<readonly string[]>;
  readonly external: { readonly href: string; readonly label: string };
  readonly media: ProjectMedia;
}

export interface NewsArticle {
  readonly slug: NewsSlug;
  readonly status: ContentStatus;
  /** ISO sana. Faqat confirmed boʻlganda koʻrsatiladi. */
  readonly date: string;
  readonly topic: Localized;
  readonly title: Localized;
  readonly lead: Localized;
  readonly body: Localized<readonly string[]>;
  readonly quote?: Localized;
  readonly cover: {
    readonly src: string | null;
    readonly alt: Localized;
    readonly status: ContentStatus;
  };
  readonly story: ColorStory;
  /** Muqovadan keyingi suratlar: maqolada muqova bilan birga varaqlanadi (public/brand yoʻllari,
      scripts/images.mjs roʻyxatida). Tavsif lugʻatdan: «Sarlavha: N-surat». */
  readonly photos?: readonly string[];
}

export type PersonKind = "expert" | "leader";

export interface ReceptionSlot {
  readonly day: Localized;
  readonly hours: string;
}

export interface Person {
  readonly id: string;
  readonly kind: PersonKind;
  readonly status: ContentStatus;
  /** pending boʻlsa null: boʻsh portret ramkasi va faqat lavozim koʻrsatiladi. */
  readonly name: Localized | null;
  readonly role: Localized;
  readonly field: Localized | null;
  readonly bio: Localized | null;
  readonly photo: string | null;
  readonly reception: readonly ReceptionSlot[] | null;
  readonly email: string | null;
}

export type PartnerGroup = "state" | "international" | "creative" | "sponsors";

export interface Partner {
  readonly id: string;
  readonly status: ContentStatus;
  readonly group: PartnerGroup;
  readonly name: Localized | null;
  readonly logo: string | null;
  readonly href: string | null;
}

export interface SocialLink {
  readonly id: "telegram" | "instagram" | "youtube" | "facebook";
  readonly href: string;
  readonly label: string;
  readonly status: ContentStatus;
}

export interface ContactDetail<T = string> {
  readonly value: T | null;
  readonly status: ContentStatus;
}

export interface Contacts {
  readonly address: ContactDetail<Localized>;
  readonly phones: ContactDetail<readonly string[]>;
  readonly email: ContactDetail;
  readonly telegram: ContactDetail;
  readonly hours: ContactDetail<Localized>;
  readonly map: ContactDetail<{ readonly lat: number; readonly lng: number }>;
  readonly socials: readonly SocialLink[];
}

/** Bolalar galereyasi (25.4.1): rozilik yozuvisiz element qurilmaydi. */
export interface Artwork {
  readonly id: string;
  readonly status: ContentStatus;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly firstName: string;
  readonly age: number;
  readonly region: Localized;
  readonly title: Localized;
  readonly consent: { readonly parent: true; readonly child: true; readonly date: string };
}

export interface Milestone {
  readonly id: string;
  readonly status: ContentStatus;
  readonly year: number | null;
  readonly title: Localized;
}
