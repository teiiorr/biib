/**
 * Kontent skriptlari (seed, pull, prefetch) uchun Supabase PostgREST yordamchilari: kutubxonasiz fetch.
 * Kalitlar faqat muhitdan olinadi (.env.local yoki Vercel), hech qachon chiqarilmaydi va yozilmaydi.
 */
import { parseSnapshot, type ContentSnapshot } from "../../src/content/snapshot";

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} muhitda yoʻq (.env.local ga qarang)`);
  return value;
}

export function supabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
}

/* Xato matnida kalit yoki toʻliq manzil chiqib qolmasin: faqat holat va javobning boshi. */
async function failure(response: Response, what: string): Promise<Error> {
  const body = (await response.text()).slice(0, 400);
  return new Error(`${what}: HTTP ${response.status}\n${body}`);
}

/** Ommaviy yoʻl bilan aynan bir xil: faqat publishable kalit va content_snapshot() RPC. */
export async function fetchSnapshot(timeoutMs = 15_000): Promise<ContentSnapshot> {
  const response = await fetch(`${supabaseUrl()}/rest/v1/rpc/content_snapshot`, {
    headers: {
      apikey: requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
      accept: "application/json",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw await failure(response, "content_snapshot()");
  return parseSnapshot(await response.json(), "supabase");
}

type Query = Readonly<Record<string, string>>;

/** Maxfiy kalit bilan jadvalga yozish (RLS chetlab oʻtiladi): faqat mahalliy seed skripti uchun. */
export async function serviceRequest<T = unknown>(
  method: "GET" | "POST" | "DELETE",
  table: string,
  query: Query,
  body?: unknown,
  prefer?: string,
): Promise<T> {
  const url = new URL(`${supabaseUrl()}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  const headers: Record<string, string> = {
    apikey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    accept: "application/json",
  };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (prefer) headers.prefer = prefer;
  const response = await fetch(url, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw await failure(response, `${method} ${table}`);
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}
