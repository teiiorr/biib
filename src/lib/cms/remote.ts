import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { parseSnapshot, type ContentSnapshot } from "@/content/snapshot";
import { supabaseReadConfig } from "./env";

/* Baza javob bermasa sahifa uzoq kutmaydi: xato otiladi, ISR oxirgi yaxshi sahifani beraveradi. */
const TIMEOUT_MS = 6000;

/**
 * Ommaviy sahifalarning yagona tashqi oʻqishi: content_snapshot() RPC, publishable kalit bilan.
 * Kutubxonasiz oddiy fetch: ommaviy sahifalarga Supabase kodi tushmaydi. Shakl xatosi ham xato
 * hisoblanadi (parseSnapshot), yarim notoʻgʻri nusxa sahifaga yetib bormaydi.
 */
export async function fetchRemoteSnapshot(): Promise<ContentSnapshot> {
  const { url, key } = supabaseReadConfig();
  const response = await fetch(`${url}/rest/v1/rpc/content_snapshot`, {
    headers: { apikey: key, accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`content_snapshot(): HTTP ${response.status}`);
  return parseSnapshot(await response.json(), "supabase");
}

/* Har yigʻish jarayonida fayl bir marta oʻqiladi va tekshiriladi, keyin hamma sahifa shu nusxadan. */
const pins = new Map<string, Promise<ContentSnapshot>>();

/** Yigʻish nusxasi (scripts/cms/prefetch.mts yozadi): sahifalar tarmoqsiz, bitta nusxadan yigʻiladi. */
export function readBuildPin(file: string): Promise<ContentSnapshot> {
  let pin = pins.get(file);
  if (!pin) {
    pin = readFile(path.resolve(file), "utf8").then((text) =>
      parseSnapshot(JSON.parse(text), file),
    );
    pins.set(file, pin);
  }
  return pin;
}
