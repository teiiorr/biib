import { pathFor } from "@/i18n/routes";

import { ORG_COPY } from "../copy-org";
import { dbErrorKind } from "../db-errors";
import type { OrgSaveState } from "./types";

const E = ORG_COPY.errors;

/** Saqlashdan keyin darhol isitiladigan oʻzbekcha sahifalar; qolganlari birinchi tashrifda isiydi. */
export const ORG_WARM = {
  contacts: [pathFor("uz", "home"), pathFor("uz", "contacts")],
  history: [pathFor("uz", "about")],
  project: [pathFor("uz", "home"), pathFor("uz", "projects")],
  gallery: [pathFor("uz", "projects")],
  people: [pathFor("uz", "home"), pathFor("uz", "leadership"), pathFor("uz", "experts")],
  partners: [pathFor("uz", "home"), pathFor("uz", "partners")],
} as const satisfies Record<string, readonly string[]>;

export function dbMessage(code: string | undefined): string {
  switch (dbErrorKind({ code })) {
    case "notFound":
      return E.notFound;
    case "media":
      return E.media;
    case "denied":
      return E.denied;
    default:
      return E.generic;
  }
}

export function failure<T>(revision: number, code: string | undefined): OrgSaveState<T> {
  return dbErrorKind({ code }) === "conflict"
    ? { status: "conflict", revision }
    : { status: "error", revision, message: dbMessage(code) };
}

export function genericError<T>(revision: number): OrgSaveState<T> {
  return { status: "error", revision, message: E.generic };
}
