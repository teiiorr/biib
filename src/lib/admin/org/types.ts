import type { IconName } from "@/components/icons/paths";
import type { ContentStatus, Localized, SocialLink, UpopFrame, UpopMotion } from "@/content/types";
import type { PreparedImage } from "@/lib/images/manifest";

import type { FieldErrors, MediaItem } from "../news/types";

export type SocialNetwork = SocialLink["id"];

export interface Detail<T> {
  readonly value: T | null;
  readonly status: ContentStatus;
}

/** private.contacts_admin_json: admin_save_contacts shu shaklni oladi, jurnalga ham shu yoziladi. */
export interface ContactsAdmin {
  readonly address: Detail<Localized>;
  readonly postalCode: string | null;
  readonly locality: string | null;
  readonly phones: Detail<readonly string[]>;
  readonly email: Detail<string>;
  readonly telegram: Detail<string>;
  readonly hours: Detail<Localized>;
  readonly map: Detail<{ readonly lat: number; readonly lng: number }>;
}

/** private.socials_admin_json bandi; massivdagi tartib saytda ham saqlanadi. */
export interface SocialAdmin {
  readonly id: SocialNetwork;
  readonly href: string;
  readonly label: string;
  readonly status: ContentStatus;
}

/** private.milestone_admin_json. */
export interface MilestoneAdmin {
  readonly id?: string | undefined;
  readonly key?: string | undefined;
  readonly status: ContentStatus;
  readonly year: number | null;
  readonly title: Localized;
  readonly icon: IconName;
  readonly sortOrder?: number | undefined;
}

export interface MediaAlt {
  readonly alt: Localized;
  readonly status?: ContentStatus | undefined;
}

/** private.project_admin_json. */
export interface ProjectAdmin {
  readonly key: string;
  readonly status: ContentStatus;
  readonly flagship: boolean;
  readonly name: Localized;
  readonly tagline: Localized;
  readonly age: { readonly from: number; readonly to: number; readonly status: ContentStatus };
  readonly format: Detail<Localized>;
  readonly place: Detail<Localized>;
  readonly schedule: Detail<Localized>;
  readonly teacher: Detail<Localized>;
  readonly cost: { readonly free: boolean | null; readonly status: ContentStatus };
  readonly highlights: Localized<readonly string[]>;
  readonly external: { readonly href: string; readonly label: string };
  readonly media: Readonly<Partial<Record<MediaRole, MediaAlt>>>;
}

export type MediaRole = "loop" | "film" | "wordmark";

/** Faqat koʻrsatish uchun: video boʻlsa posteri, rasm boʻlsa oʻzi. */
export interface ProjectMediaFile {
  readonly file: string;
  readonly preview: MediaItem | null;
}

/** private.upop_admin_json bandi; rasm yoki videoligi media qatoridan olinadi. */
export interface ShotAdmin {
  readonly position: number;
  readonly mediaId: string;
  readonly posterId: string | null;
  readonly frame: UpopFrame;
  readonly motion: UpopMotion;
  readonly alt: Localized | null;
}

export interface GalleryMedia {
  readonly id: string;
  readonly kind: "image" | "video";
  readonly src: string;
  /** Rasmning oʻzi yoki videoning posteri. */
  readonly preview: PreparedImage | null;
  readonly previewSrc: string;
  /** Galereyaga qoʻshilganda muqova kadri shu posterdan boshlanadi. */
  readonly posterId: string | null;
}

export interface GallerySlot {
  readonly media: GalleryMedia;
  readonly poster: MediaItem | null;
  readonly frame: UpopFrame;
  readonly motion: UpopMotion;
  readonly alt: Localized;
}

/** saved: bazadagi meʼyorlangan holat va keyingi saqlash kutadigan versiya (updated_at yoki roʻyxat izi). */
export type OrgSaveState<T> =
  | { readonly status: "idle"; readonly revision: number }
  | {
      readonly status: "saved";
      readonly revision: number;
      readonly data: T;
      readonly version: string | null;
    }
  | { readonly status: "invalid"; readonly revision: number; readonly errors: FieldErrors }
  | { readonly status: "conflict"; readonly revision: number }
  | { readonly status: "error"; readonly revision: number; readonly message: string };
