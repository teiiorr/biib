import type { IconName } from "@/components/icons/paths";
import type { Locale } from "@/i18n/locales";

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
  /** ASCII slug (routes.ts faylidagi NEWS_SLUG_RE): roʻyxat kontentdan olinadi, kodda qotirilmaydi. */
  readonly slug: string;
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
  /** JSON-LD manzili uchun; berilmasa jsonld.ts faylidagi hozirgi qiymat. */
  readonly postalCode?: string;
  readonly locality?: string;
}

/** Bolalar galereyasi: rozilik yozuvisiz element qurilmaydi. */
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
  /** Berilmasa AboutPage komponentidagi id boʻyicha belgi. */
  readonly icon?: IconName;
}

/** Ramka: har joyning oʻz koʻrinishi (pages.css va materials.css, .upop-shot). */
export type UpopFrame = "stage" | "gold" | "glass" | "ticket" | "film" | "mat";

/** Skroll bilan kirish (ikki yoʻnalishda qaytadi): har joyning oʻz harakati. */
export type UpopMotion =
  "curtain" | "slide-end" | "wipe" | "rise" | "iris" | "tilt" | "slide-start" | "zoom";

/** UPOP TREND galereyasining bitta joyi (8 tagacha; tartib = joy, 1-joy eng katta kadr). */
export interface UpopShot {
  readonly kind: "photo" | "video";
  /** Sayt ichidagi yoʻl: public/ papkasidagi fayl yoki /uploads/…; tashqi havolani CSP bloklaydi. */
  readonly src: string;
  /** Faqat video uchun: birinchi kadr surati (boʻlmasa kadr video yuklanguncha boʻsh turadi). */
  readonly poster?: string;
  readonly frame: UpopFrame;
  readonly motion: UpopMotion;
  /** Ixtiyoriy tavsif; berilmasa lugʻatdagi «UPOP TREND: N-lavha» ishlatiladi. */
  readonly alt?: Localized;
}
