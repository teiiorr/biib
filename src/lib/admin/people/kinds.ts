import type { PersonKind } from "@/content/types";
import { pathFor } from "@/i18n/routes";

import type { AdminPath } from "../paths";

interface KindConfig {
  readonly admin: AdminPath;
  readonly page: "leadership" | "experts";
}

export const PERSON_KINDS: Readonly<Record<PersonKind, KindConfig>> = {
  leader: { admin: "/admin/rahbariyat", page: "leadership" },
  expert: { admin: "/admin/ekspertlar", page: "experts" },
};

/** Karta sarlavhasining id qiymati «<key>-name» (PersonCard komponentida). */
export function personPublicPath(kind: PersonKind, key?: string): string {
  const page = pathFor("uz", PERSON_KINDS[kind].page);
  return key ? `${page}#${key}-name` : page;
}

/** Bosh sahifa ham isitiladi, chunki unda shu boʻlimning birinchi uchtasi chiqadi. */
export function personWarmPaths(kind: PersonKind): readonly string[] {
  return [pathFor("uz", "home"), pathFor("uz", PERSON_KINDS[kind].page)];
}
