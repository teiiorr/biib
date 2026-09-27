import { PEOPLE_COPY } from "../copy-people";
import { optionalLocalized, requireAll, type BuildResult } from "../record";
import { normalizeLocalized } from "../text/locales";
import type { PersonAdmin, PersonPayload } from "./types";

/* Bazadagi tekshiruv bilan bir xil (people.email). */
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Tahrir holatidan bazaga yuboriladigan shakl: har til meʼyorlanadi, boʻsh kirill va 2026 qatori
 * oʻzbekchadan toʻldiriladi, keyin tekshiriladi. Brauzer ham, server amali ham shuni chaqiradi.
 */
export function buildPerson(payload: PersonPayload): BuildResult<PersonAdmin> {
  const errors: Record<string, string> = {};
  const nameText = normalizeLocalized(payload.name);
  /* Tasdiqlangan odam ismsiz boʻlolmaydi (bazadagi tekshiruv); boshqa holatda ism ixtiyoriy. */
  const confirmed = payload.status === "confirmed";
  if (confirmed) requireAll(errors, "name", nameText);
  const name = confirmed ? nameText : optionalLocalized(errors, "name", nameText);

  const role = normalizeLocalized(payload.role);
  requireAll(errors, "role", role);
  /* Rahbarda soha va maʼlumot tahrirda koʻrinmaydi: bazadagi qiymati oʻzgarishsiz qaytadi. */
  const field = optionalLocalized(errors, "field", normalizeLocalized(payload.field));
  const bio = optionalLocalized(errors, "bio", normalizeLocalized(payload.bio));

  const email = payload.email.trim();
  if (email && !EMAIL_RE.test(email)) errors.email = PEOPLE_COPY.errors.email;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    input: {
      ...(payload.id ? { id: payload.id } : {}),
      kind: payload.kind,
      status: payload.status,
      name,
      role,
      field,
      bio,
      photoId: payload.photoId,
      email: email || null,
    },
  };
}
