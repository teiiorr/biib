import type { Dictionary } from "./dictionaries/types";

export type ErrorsCopy = Dictionary["errors"];

/* Layout sahifaga qoʻygan JSON (script#biib-errors): mijoz komponentlari beshta til lugʻatini olib yurmaydi. */
const EMPTY: ErrorsCopy = {
  notFound: { title: "", home: "", news: "" },
  error: { title: "", retry: "", home: "" },
  global: { title: "" },
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
