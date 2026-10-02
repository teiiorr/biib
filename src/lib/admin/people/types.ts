import type { ContentStatus, Localized, PersonKind } from "@/content/types";

import type { MediaItem } from "../news/types";

/**
 * private.person_admin_json: admin_save_person shu shaklni oladi, jurnalga ham shu yoziladi.
 * key va sortOrder berilmasa bazadagisi saqlanadi.
 */
export interface PersonAdmin {
  readonly id?: string;
  readonly key?: string;
  readonly kind: PersonKind;
  readonly status: ContentStatus;
  readonly name: Localized | null;
  readonly role: Localized;
  readonly field: Localized | null;
  readonly bio: Localized | null;
  readonly photoId: string | null;
  readonly email: string | null;
  readonly sortOrder?: number;
}

export interface PersonDraft {
  readonly status: ContentStatus;
  readonly name: Localized;
  readonly role: Localized;
  readonly field: Localized;
  readonly bio: Localized;
  readonly email: string;
  readonly photo: MediaItem | null;
}

export interface PersonPayload extends Omit<PersonDraft, "photo"> {
  readonly id: string | null;
  readonly expected: string | null;
  readonly kind: PersonKind;
  readonly photoId: string | null;
}

export interface PersonListRow {
  readonly id: string;
  readonly key: string;
  readonly status: ContentStatus;
  /** Oʻzbekcha ism; kutilayotgan odamda null. */
  readonly name: string | null;
  readonly role: string;
  readonly photo: MediaItem | null;
  readonly updatedAt: string;
}
