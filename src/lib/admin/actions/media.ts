"use server";

import { SYSTEM_COPY } from "../copy-system";
import { NEWS_COPY } from "../copy-news";
import { adminDb } from "../db";
import { dbErrorKind } from "../db-errors";
import { requireAdminAction } from "../guard";
import { removeStoredVariants } from "../media/library";
import type { DeleteMediaResult } from "../media/library-types";
import { UUID_RE } from "../news/queries";
import { publish } from "../publish";

const E = SYSTEM_COPY.media.errors;

/**
 * Avval bazadagi yozuv oʻchiriladi (ishlatilayotgan faylni tashqi kalit rad etadi), keyin Storage
 * nusxalari. Kod bilan keladigan fayl oʻchirilmaydi: public/ papkasida u baribir qolib ketardi.
 */
export async function deleteMedia(id: string): Promise<DeleteMediaResult> {
  const session = await requireAdminAction();
  if (typeof id !== "string" || !UUID_RE.test(id)) return { ok: false, message: E.notFound };
  const db = adminDb(session.accessToken);
  const { data: row, error } = await db
    .from("media")
    .select("origin, storage_prefix")
    .eq("id", id)
    .maybeSingle();
  if (error) return { ok: false, message: E.generic };
  if (!row) return { ok: false, message: E.notFound };
  if (row.origin !== "storage" || !row.storage_prefix)
    return { ok: false, message: SYSTEM_COPY.media.reasonStatic };
  const { data: prefix, error: deleteError } = await db.rpc("admin_delete_media", { target: id });
  if (deleteError) {
    const kind = dbErrorKind(deleteError);
    const message =
      kind === "media"
        ? E.inUse
        : kind === "notFound"
          ? E.notFound
          : kind === "denied"
            ? NEWS_COPY.errors.denied
            : E.generic;
    return { ok: false, message };
  }
  /* Yozuv oʻchdi: nusxalar oʻchmasa ham natija muvaffaqiyatli, faqat ogohlantirish bilan. */
  const removed = await removeStoredVariants(db, prefix || row.storage_prefix).catch(() => false);
  publish();
  return { ok: true, filesLeft: !removed };
}
