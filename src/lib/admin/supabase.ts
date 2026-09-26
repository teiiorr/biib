import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { AdminEnv } from "./env";

/* Next maʼlumot keshi avtorizatsiyali soʻrovni ham saqlaydi (fetch.md): auth javoblari hech qachon keshlanmaydi. */
export const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

/**
 * Sessiyasiz mijoz: tokenlar faqat panelning httpOnly cookie larida turadi, kutubxona ularni saqlamaydi
 * va oʻzi yangilamaydi (yangilash faqat server amali va yangilash yoʻlida).
 */
export function authClient(env: AdminEnv): SupabaseClient {
  return createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: noStoreFetch },
  });
}
