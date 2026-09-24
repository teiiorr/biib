import type { Dictionary } from "./dictionaries/types";

export type ErrorsCopy = Dictionary["errors"] & { readonly paints: readonly string[] };

/* Layout sahifaga qoʻygan JSON (script#biib-errors): mijoz komponentlari beshta til lugʻatini olib yurmaydi. */
const EMPTY: ErrorsCopy = {
  notFound: { title: "", text: "", home: "", news: "" },
  error: { title: "", text: "", retry: "", home: "" },
  global: { title: "", text: "" },
  canvas: { title: "", hint: "", clear: "", save: "", color: "", label: "" },
  crumpled: { alt: "" },
  paints: [],
};

export function readErrorsCopy(): ErrorsCopy {
  if (typeof document === "undefined") return EMPTY;
  try {
    const raw = document.getElementById("biib-errors")?.textContent;
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<ErrorsCopy>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}
