"use server";

import type { Json } from "../database.types";
import { adminDb } from "../db";
import { requireAdminAction } from "../guard";
import { buildContacts, type SaveContactsState } from "../org/contacts";
import { contactsPayload, readPayload } from "../org/payloads";
import { contactsVersion, fingerprint, loadContacts, loadSocials } from "../org/queries";
import { failure, genericError, ORG_WARM } from "../org/results";
import { publish } from "../publish";

/**
 * Aloqa va ijtimoiy tarmoqlar bitta shaklda: tekshiruv (brauzerdagi bilan bir xil) → boshqa oynada
 * oʻzgarmaganmi → faqat oʻzgargan qism saqlanadi (jurnalda ortiqcha yozuv boʻlmasin) → hamma sahifa
 * yangilanadi (pastki qism va JSON-LD har sahifada).
 */
export async function saveContacts(
  prev: SaveContactsState,
  formData: FormData,
): Promise<SaveContactsState> {
  const session = await requireAdminAction();
  const revision = prev.revision + 1;
  const payload = readPayload(contactsPayload, formData);
  if (!payload) return genericError(revision);
  const built = buildContacts(payload.draft);
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  const db = adminDb(session.accessToken);
  let current: Awaited<ReturnType<typeof loadContacts>>;
  let socials: Awaited<ReturnType<typeof loadSocials>>;
  try {
    [current, socials] = await Promise.all([loadContacts(db), loadSocials(db)]);
  } catch {
    return genericError(revision);
  }
  if (contactsVersion(current.version, socials.data) !== payload.expected)
    return { status: "conflict", revision };

  let version = current.version;
  const contactsChanged = fingerprint(built.contacts) !== fingerprint(current.data);
  const socialsChanged = fingerprint(built.socials) !== fingerprint(socials.data);
  if (contactsChanged) {
    const { data, error } = await db.rpc("admin_save_contacts", {
      p: built.contacts as unknown as Json,
      ...(version ? { expected: version } : {}),
    });
    if (error) return failure(revision, error.code);
    version = data;
  }
  if (socialsChanged) {
    const { error } = await db.rpc("admin_save_socials", { p: built.socials as unknown as Json });
    if (error) {
      if (contactsChanged) publish({ warm: ORG_WARM.contacts });
      return failure(revision, error.code);
    }
  }
  if (contactsChanged || socialsChanged) publish({ warm: ORG_WARM.contacts });
  return {
    status: "saved",
    revision,
    version: contactsVersion(version, built.socials),
    data: { contacts: built.contacts, socials: built.socials },
  };
}
