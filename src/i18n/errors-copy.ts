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

/* useSyncExternalStore snapshot i barqaror boʻlishi shart: bir xil JSON uchun bir xil obyekt (aks holda cheksiz render). */
let cache: { raw: string; value: ErrorsCopy } | null = null;

export function readErrorsCopy(): ErrorsCopy {
  if (typeof document === "undefined") return EMPTY;
  const raw = document.getElementById("biib-errors")?.textContent ?? "";
  if (!raw) return EMPTY;
  if (cache && cache.raw === raw) return cache.value;
  try {
    cache = { raw, value: { ...EMPTY, ...(JSON.parse(raw) as Partial<ErrorsCopy>) } };
    return cache.value;
  } catch {
    return EMPTY;
  }
}
