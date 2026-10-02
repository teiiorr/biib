import type { ArtSlot, ContentStatus, Localized } from "@/content/types";
import type { PreparedImage } from "@/lib/images/manifest";

/** Panelda koʻrsatiladigan rasm: bazadagi media qatori va uning tayyor nusxalari. */
export interface MediaItem {
  readonly id: string;
  readonly src: string;
  readonly image: PreparedImage | null;
}

/**
 * Bazaning admin shakli (private.news_admin_json). Jurnalda ham shu shaklda turadi, shu sabab
 * qaytarish uchun before qiymatini qayta saqlash kifoya.
 */
export interface NewsAdmin {
  readonly id?: string;
  readonly slug: string;
  readonly status: ContentStatus;
  readonly date: string;
  readonly topic: Localized;
  readonly title: Localized;
  readonly lead: Localized;
  readonly body: Localized<readonly string[]>;
  readonly quote: Localized | null;
  readonly cover: {
    readonly mediaId: string | null;
    readonly alt: Localized;
    readonly status: ContentStatus;
  };
  readonly story: { readonly primary: ArtSlot; readonly secondary: ArtSlot };
  readonly photos: readonly { readonly mediaId: string }[];
}

export type SlugMode = "auto" | "manual";

/** Tahrir oynasi holati: matn maydonlari xom (xatboshilar boʻsh qator bilan), rasmlar koʻrinishi bilan. */
export interface NewsDraft {
  readonly slug: string;
  readonly slugMode: SlugMode;
  readonly status: ContentStatus;
  readonly date: string;
  readonly topic: Localized;
  readonly title: Localized;
  readonly lead: Localized;
  readonly body: Localized;
  readonly quote: Localized;
  readonly cover: MediaItem | null;
  readonly coverAlt: Localized;
  readonly coverStatus: ContentStatus;
  readonly story: { readonly primary: ArtSlot; readonly secondary: ArtSlot };
  readonly photos: readonly MediaItem[];
}

/** Server amaliga yuboriladigan shakl: rasmlar faqat id bilan. */
export interface NewsPayload extends Omit<NewsDraft, "cover" | "photos"> {
  readonly id: string | null;
  readonly expected: string | null;
  readonly coverId: string | null;
  readonly photoIds: readonly string[];
}

/** Maydon yoʻli (masalan «title.ru», «slug») → xato matni. */
export type FieldErrors = Readonly<Record<string, string>>;

export type SaveNewsState =
  | { readonly status: "idle"; readonly revision: number }
  | {
      readonly status: "saved";
      readonly revision: number;
      readonly updatedAt: string;
      readonly data: NewsAdmin;
    }
  | { readonly status: "invalid"; readonly revision: number; readonly errors: FieldErrors }
  | { readonly status: "conflict"; readonly revision: number }
  | { readonly status: "error"; readonly revision: number; readonly message: string };

export interface NewsListRow {
  readonly id: string;
  readonly slug: string;
  readonly status: ContentStatus;
  readonly date: string;
  readonly title: string;
  readonly photos: number;
  readonly updatedAt: string;
}
