"use server";

import { ORG_COPY } from "../copy-org";
import type { Json } from "../database.types";
import { adminDb } from "../db";
import { requireAdminAction } from "../guard";
import { buildShots, type SaveGalleryState, type SlotPayload } from "../org/gallery";
import { galleryPayload, readPayload } from "../org/payloads";
import { fingerprint, loadShots } from "../org/queries";
import { failure, genericError, ORG_WARM } from "../org/results";
import { publish } from "../publish";

/**
 * Sakkiz joy bitta chaqiruvda almashadi. Kadr turi brauzerdan emas, bazadagi media qatoridan
 * olinadi (videoga poster shart). Muqova kadri faqat rasm boʻladi, buni baza ham tekshiradi.
 */
export async function saveGallery(
  prev: SaveGalleryState,
  formData: FormData,
): Promise<SaveGalleryState> {
  const session = await requireAdminAction();
  const revision = prev.revision + 1;
  const payload = readPayload(galleryPayload, formData);
  if (!payload) return genericError(revision);
  const db = adminDb(session.accessToken);
  const ids = payload.slots.flatMap((s) =>
    s ? [s.mediaId, ...(s.posterId ? [s.posterId] : [])] : [],
  );
  let current: Awaited<ReturnType<typeof loadShots>>;
  let kinds: ReadonlyMap<string, "image" | "video">;
  try {
    current = await loadShots(db);
    const { data, error } = ids.length
      ? await db
          .from("media")
          .select("id, kind")
          .in("id", [...new Set(ids)])
      : { data: [], error: null };
    if (error) throw new Error(error.code);
    kinds = new Map(data.map((row) => [row.id, row.kind]));
  } catch {
    return genericError(revision);
  }
  if (current.version !== payload.version) return { status: "conflict", revision };
  const missing = ids.some((id) => !kinds.has(id));
  const posterNotImage = payload.slots.some(
    (s) => s?.posterId && kinds.get(s.posterId) !== "image",
  );
  if (missing || posterNotImage)
    return { status: "error", revision, message: ORG_COPY.errors.media };
  const slots = payload.slots.map((slot): SlotPayload | null =>
    slot ? { ...slot, kind: kinds.get(slot.mediaId) ?? slot.kind } : null,
  );
  const built = buildShots(slots);
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  const version = fingerprint(built.shots);
  if (version === current.version) return { status: "saved", revision, version, data: built.shots };
  const { error } = await db.rpc("admin_save_upop_shots", { p: built.shots as unknown as Json });
  if (error) return failure(revision, error.code);
  publish({ warm: ORG_WARM.gallery });
  return { status: "saved", revision, version, data: built.shots };
}
