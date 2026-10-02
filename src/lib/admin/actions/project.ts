"use server";

import type { Json } from "../database.types";
import { adminDb } from "../db";
import { requireAdminAction } from "../guard";
import { projectPayload, readPayload } from "../org/payloads";
import { buildProject, type SaveProjectState } from "../org/project";
import { fingerprint, loadProject } from "../org/queries";
import { failure, genericError, ORG_WARM } from "../org/results";
import { publish } from "../publish";

/**
 * Yozuv bazadan qayta oʻqiladi: boshqa oynadagi oʻzgarish ustidan yozilmasin, panelda
 * tahrirlanmaydigan nom, shior va video holati esa saqlanib qolsin. Qator, faktlar va tavsiflar
 * bitta tranzaksiyada yoziladi.
 */
export async function saveProject(
  prev: SaveProjectState,
  formData: FormData,
): Promise<SaveProjectState> {
  const session = await requireAdminAction();
  const revision = prev.revision + 1;
  const payload = readPayload(projectPayload, formData);
  if (!payload) return genericError(revision);
  const db = adminDb(session.accessToken);
  let current: Awaited<ReturnType<typeof loadProject>>;
  try {
    current = await loadProject(db);
  } catch {
    return genericError(revision);
  }
  if (current.version !== payload.expected) return { status: "conflict", revision };
  const built = buildProject(payload.draft, current.data);
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  if (fingerprint(built.input) === fingerprint(current.data))
    return { status: "saved", revision, version: current.version, data: current.data };
  const { data, error } = await db.rpc("admin_save_project", {
    p: built.input as unknown as Json,
    ...(current.version ? { expected: current.version } : {}),
  });
  if (error) return failure(revision, error.code);
  publish({ warm: ORG_WARM.project });
  return { status: "saved", revision, version: data, data: built.input };
}
