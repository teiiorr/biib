import { randomUUID } from "node:crypto";
import { z } from "zod";

import { adminDb } from "@/lib/admin/db";
import {
  MEDIA_PURPOSES,
  UPLOAD_EXT,
  UPLOAD_MAX_BYTES,
  UPLOAD_TYPES,
} from "@/lib/admin/media/purposes";
import { adminJson, requireAdminRoute } from "@/lib/admin/route-guard";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const input = z.object({
  purpose: z.enum(MEDIA_PURPOSES),
  mime: z.enum(UPLOAD_TYPES),
  bytes: z.number().int().positive().max(UPLOAD_MAX_BYTES),
});

/**
 * Yuklash uchun imzoli manzil: brauzer faylni toʻgʻridan-toʻgʻri yopiq «originals» bucketiga qoʻyadi
 * (server amali orqali emas — ular navbat bilan ishlaydi, oʻnta surat bir-birini kutib qolardi).
 */
export async function POST(request: Request): Promise<Response> {
  const session = await requireAdminRoute(request);
  if (session instanceof Response) return session;
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return adminJson(400, { error: "input" });
  const path = `inbox/${randomUUID()}.${UPLOAD_EXT[parsed.data.mime]}`;
  const { data, error } = await adminDb(session.accessToken)
    .storage.from("originals")
    .createSignedUploadUrl(path);
  if (error || !data) return adminJson(502, { error: "storage" });
  return adminJson(200, { path, signedUrl: data.signedUrl });
}
