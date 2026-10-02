import type { Dictionary } from "./dictionaries/types";

export type ErrorsCopy = Dictionary["errors"];

/* Matn script#biib-errors blokidan oʻqiladi: mijoz komponentlari besh tilli lugʻatni yuklamasin. */
const EMPTY: ErrorsCopy = {
  notFound: { title: "", home: "", news: "" },
  error: { title: "", retry: "", home: "" },
  global: { title: "" },
};

/* useSyncExternalStore bir xil JSON uchun oʻsha obyektni kutadi, aks holda cheksiz chizaveradi. */
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
