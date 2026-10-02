import { z } from "zod";

import type { Json } from "@/lib/admin/database.types";
import { adminDb, type AdminDb } from "@/lib/admin/db";
import { toMediaItem } from "@/lib/admin/media/items";
import { prepareImage, type PreparedUpload } from "@/lib/admin/media/prepare";
import { MEDIA_PURPOSES, UPLOAD_MAX_BYTES } from "@/lib/admin/media/purposes";
import { adminJson, requireAdminRoute } from "@/lib/admin/route-guard";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const input = z.object({
  path: z.string().regex(/^inbox\/[0-9a-f-]{36}\.(?:jpg|png|webp|avif)$/),
  purpose: z.enum(MEDIA_PURPOSES),
});

/* Fayl nomida xesh bor va mazmuni oʻzgarmaydi, shu sabab bir yilga keshlanadi. */
const CACHE_SECONDS = "31536000";

async function storeVariants(db: AdminDb, prepared: PreparedUpload): Promise<boolean> {
  const results = await Promise.all(
    prepared.variants.map((variant) =>
      db.storage.from("media").upload(`i/${variant.name}`, variant.body, {
        contentType: variant.contentType,
        cacheControl: CACHE_SECONDS,
        upsert: false,
      }),
    ),
  );
  /* Bir xil rasm oldin ham yuklangan boʻlsa, fayl allaqachon bor: bu xato emas. */
  return results.every(({ error }) => !error || /exist|duplicate/i.test(error.message));
}

/**
 * Asl nusxadan sharp bilan sahifa nusxalari tayyorlanadi va ochiq «media» omboriga qoʻyiladi, asl nusxa
 * oʻchiriladi. Javob tahrir oynasida darhol koʻrinadigan <Picture image> shaklida qaytadi.
 */
export async function POST(request: Request): Promise<Response> {
  const session = await requireAdminRoute(request);
  if (session instanceof Response) return session;
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return adminJson(400, { error: "input" });
  const { path, purpose } = parsed.data;
  const db = adminDb(session.accessToken);
  const originals = db.storage.from("originals");
  try {
    const { data: file, error } = await originals.download(path);
    if (error || !file) return adminJson(404, { error: "missing" });
    if (file.size > UPLOAD_MAX_BYTES) return adminJson(413, { error: "size" });
    let prepared: PreparedUpload;
    try {
      prepared = await prepareImage(Buffer.from(await file.arrayBuffer()), purpose);
    } catch {
      return adminJson(422, { error: "unreadable" });
    }
    if (!(await storeVariants(db, prepared))) return adminJson(502, { error: "storage" });
    const largest = prepared.widths.at(-1) ?? prepared.width;
    const { data: row, error: registerError } = await db.rpc("admin_register_media", {
      p: {
        kind: "image",
        origin: "storage",
        src: `/uploads/i/${prepared.hash}-${largest}.webp`,
        storagePrefix: `i/${prepared.hash}`,
        variantBase: `/uploads/i/${prepared.hash}`,
        variantWidths: [...prepared.widths],
        width: prepared.width,
        height: prepared.height,
        blur: prepared.blur,
        bright: prepared.bright,
        bytes: prepared.variants.reduce((sum, variant) => sum + variant.body.byteLength, 0),
      } satisfies Json,
    });
    if (registerError || !row) return adminJson(502, { error: "register" });
    return adminJson(200, toMediaItem(row));
  } finally {
    /* EXIF va joylashuv yozilgan asl nusxa xato boʻlsa ham saqlanib qolmaydi. */
    await originals.remove([path]).catch(() => undefined);
  }
}
