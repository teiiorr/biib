import type { Localized } from "@/content/types";
import { getDictionary } from "@/i18n/dictionaries";
import { LOCALES } from "@/i18n/locales";
import { PAGE_KEYS, type PageKey } from "@/i18n/routes";
import {
  textAt,
  textEntries,
  textKind,
  type TextKind,
  type TextValue,
} from "@/i18n/text-overrides";

import type { StoredText } from "./queries";
import type { TextListRow } from "./types";

export interface CatalogEntry {
  readonly key: string;
  /** Birinchi boʻgʻin: «home», «meta», «footer» … */
  readonly namespace: string;
  readonly kind: TextKind;
  readonly bundled: Localized<TextValue>;
}

let catalog: ReadonlyMap<string, CatalogEntry> | undefined;

/**
 * Kalitlar oʻzbekcha lugʻatdan olinadi, boshqa tillar ham shu shaklda. Lugʻat ish davomida
 * oʻzgarmaydi, shu sabab roʻyxat bir marta tuziladi.
 */
export function textCatalog(): ReadonlyMap<string, CatalogEntry> {
  catalog ??= new Map(
    textEntries(getDictionary("uz")).map(({ key, kind }) => {
      const empty: TextValue = kind === "list" ? [] : "";
      const bundled = Object.fromEntries(
        LOCALES.map((locale) => [locale, textAt(getDictionary(locale), key) ?? empty]),
      ) as Localized<TextValue>;
      return [key, { key, namespace: key.split(".")[0] ?? key, kind, bundled }];
    }),
  );
  return catalog;
}

export function catalogEntry(key: string): CatalogEntry | null {
  return textCatalog().get(key) ?? null;
}

const SECTION_PAGES: ReadonlySet<string> = new Set(PAGE_KEYS.filter((key) => key !== "newsItem"));

/** «Saytda koʻrish» ochadigan sahifa; umumiy qismlar uchun bosh sahifa. */
export function pageForKey(key: string): PageKey {
  const [namespace = "", second = ""] = key.split(".");
  if (namespace === "people") return second === "leadership" ? "leadership" : "experts";
  if (namespace === "meta" && SECTION_PAGES.has(second)) return second as PageKey;
  if (namespace !== "meta" && SECTION_PAGES.has(namespace)) return namespace as PageKey;
  return "home";
}

/**
 * Qidiruv kalit, asl va almashtirilgan qiymat boʻyicha besh tilda ishlaydi. Turi mos kelmaydigan
 * eski almashtirish saytda ishlamaydi, shu sabab bu yerda ham koʻrsatilmaydi.
 */
export function textRows(overrides: ReadonlyMap<string, StoredText>): readonly TextListRow[] {
  return [...textCatalog().values()].map((entry) => {
    const stored = overrides.get(entry.key);
    const live = stored && textKind(stored.value.uz) === entry.kind ? stored.value : null;
    const uz = (live ?? entry.bundled).uz;
    const values = LOCALES.flatMap((locale) =>
      [entry.bundled[locale], live?.[locale] ?? []].flat(),
    );
    return {
      key: entry.key,
      namespace: entry.namespace,
      kind: entry.kind,
      preview: typeof uz === "string" ? uz : uz.join(" · "),
      changed: live !== null,
      haystack: [entry.key, ...values].join("\n").toLowerCase(),
    };
  });
}
