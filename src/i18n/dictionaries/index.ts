import type { Locale } from "../locales";
import { en } from "./en";
import { oz as ozGenerated } from "./oz";
import { overrides as ozOverrides } from "./oz/overrides";
import { ozbekca as ozbekcaGenerated } from "./ozbekca";
import { overrides as ozbekcaOverrides } from "./ozbekca/overrides";
import { ru } from "./ru";
import type { DeepPartial, Dictionary } from "./types";
import { uz } from "./uz";

function merge<T>(base: T, patch: DeepPartial<T> | undefined): T {
  if (patch === undefined) return base;
  if (Array.isArray(base)) return patch as T;
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
      out[key] = merge(out[key], value as DeepPartial<unknown>);
    }
    return out as T;
  }
  return patch as T;
}

const DICTIONARIES: Record<Locale, Dictionary> = {
  uz,
  oz: merge(ozGenerated, ozOverrides),
  ozbekca: merge(ozbekcaGenerated, ozbekcaOverrides),
  ru,
  en,
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary } from "./types";
