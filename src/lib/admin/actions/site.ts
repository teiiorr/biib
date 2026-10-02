"use server";

import { adminDb } from "../db";
import { dbErrorKind, type ActionResult } from "../db-errors";
import { ADMIN_COPY } from "../copy";
import { NEWS_COPY } from "../copy-news";
import { requireAdminAction } from "../guard";
import { adminSchema } from "../news/schema";
import { loadNews } from "../news/queries";
import { restoreOrgEntry } from "../org/restore";
import { newsWarmPaths, publish } from "../publish";
import { PEOPLE_ENTITIES, restorePeopleEntry } from "../restore-people";

const J = ADMIN_COPY.journal;

/** Supabase Studio orqali qoʻlda oʻzgartirilgan maʼlumot ham saytga darhol chiqsin. */
export async function refreshSite(): Promise<ActionResult> {
  await requireAdminAction();
  publish();
  return { ok: true };
}

/**
 * Jurnaldagi oldingi holat oʻsha saqlash funksiyasi orqali qayta yoziladi, oʻchirilgan yangilik
 * avvalgi id bilan tiklanadi. Odam, hamkor va tartib alohida modulda.
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
  if (PEOPLE_ENTITIES.has(entry.entity)) return restorePeopleEntry(db, entry);
  const org = await restoreOrgEntry(db, entry);
  if (org) return org;
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
