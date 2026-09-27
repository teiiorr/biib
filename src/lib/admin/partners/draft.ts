import type { PartnerGroup } from "@/content/types";

import type { MediaItem } from "../news/types";
import { mediaFor, type RecordMeta } from "../people/draft";
import { emptyLocalized } from "../text/locales";
import type { PartnerAdmin, PartnerDraft, PartnerPayload } from "./types";

export function emptyPartnerDraft(group: PartnerGroup = "state"): PartnerDraft {
  return { status: "confirmed", group, name: emptyLocalized(), href: "", logo: null };
}

export function partnerDraftFromAdmin(
  data: PartnerAdmin,
  media: ReadonlyMap<string, MediaItem>,
): PartnerDraft {
  return {
    status: data.status,
    group: data.group,
    name: data.name ?? emptyLocalized(),
    href: data.href ?? "",
    logo: mediaFor(data.logoId, media),
  };
}

export function partnerToPayload(draft: PartnerDraft, meta: RecordMeta): PartnerPayload {
  const { logo, ...rest } = draft;
  return { ...rest, ...meta, logoId: logo?.id ?? null };
}
