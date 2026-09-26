"use server";

import { adminDb } from "../db";
import { dbErrorKind, type ActionResult } from "../db-errors";
import { ADMIN_COPY } from "../copy";
import { NEWS_COPY } from "../copy-news";
import { requireAdminAction } from "../guard";
import { adminSchema } from "../news/schema";
import { loadNews } from "../news/queries";
import { newsWarmPaths, publish } from "../publish";

const J = ADMIN_COPY.journal;

/** Studio da qoʻlda oʻzgartirilgan maʼlumot ham saytga darhol chiqsin: hamma sahifa yangilanadi. */
export async function refreshSite(): Promise<ActionResult> {
  await requireAdminAction();
  publish();
  return { ok: true };
}

/**
 * Jurnal yozuvini qaytarish: yozuvdagi oldingi holat (admin shakli) oʻsha saqlash RPC si bilan qayta
 * yoziladi. Oʻchirilgan yangilik oʻz id si bilan qayta tiklanadi.
 */
export async function restoreEntry(logId: number): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!Number.isSafeInteger(logId) || logId < 1) return { ok: false, message: J.missing };
  const db = adminDb(session.accessToken);
  const { data: rows, error: logError } = await db.rpc("admin_content_log", {
    max_rows: 1,
    before_id: logId + 1,
  });
  const entry = rows?.[0];
  if (logError || !entry || entry.id !== logId) return { ok: false, message: J.missing };
  const before = adminSchema.safeParse(entry.before);
  if (entry.entity !== "news" || !before.success) return { ok: false, message: J.notRestorable };
  const current = await loadNews(db, entry.entity_key).catch(() => null);
  const { data, error } = await db.rpc("admin_save_news", {
    p: entry.before,
    ...(current ? { expected: current.updatedAt } : {}),
  });
  const row = data?.[0];
  if (error || !row) {
    const kind = dbErrorKind(error);
    const message =
      kind === "slugTaken"
        ? NEWS_COPY.errors.slugTaken
        : kind === "media"
          ? NEWS_COPY.errors.media
          : kind === "conflict"
            ? NEWS_COPY.save.conflict
            : J.failed;
    return { ok: false, message };
  }
  publish({
    slugs: [row.slug, row.old_slug, current?.data.slug, before.data.slug],
    warm: newsWarmPaths(row.slug),
  });
  return { ok: true };
}
