import type { ContentStatus, Localized, PartnerGroup } from "@/content/types";

import type { MediaItem } from "../news/types";

/** Saytdagi guruhlar tartibi (PartnersPage bilan bir xil). */
export const PARTNER_GROUPS: readonly PartnerGroup[] = [
  "state",
  "international",
  "creative",
  "sponsors",
];

/** Bazaning admin shakli (private.partner_admin_json): admin_save_partner shuni qabul qiladi. */
export interface PartnerAdmin {
  readonly id?: string;
  readonly key?: string;
  readonly status: ContentStatus;
  readonly group: PartnerGroup;
  readonly name: Localized | null;
  readonly logoId: string | null;
  readonly href: string | null;
  readonly sortOrder?: number;
}

export interface PartnerDraft {
  readonly status: ContentStatus;
  readonly group: PartnerGroup;
  readonly name: Localized;
  readonly href: string;
  readonly logo: MediaItem | null;
}

export interface PartnerPayload extends Omit<PartnerDraft, "logo"> {
  readonly id: string | null;
  readonly expected: string | null;
  readonly logoId: string | null;
}

export interface PartnerListRow {
  readonly id: string;
  readonly key: string;
  readonly status: ContentStatus;
  readonly group: PartnerGroup;
  readonly name: string | null;
  readonly logo: MediaItem | null;
  readonly updatedAt: string;
}
