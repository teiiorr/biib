import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { adminEnv } from "./env";
import { noStoreFetch } from "./supabase";

export type AdminDb = SupabaseClient<Database>;

/**
 * Har soʻrov adminning oʻz tokeni bilan ketadi, shu sabab RLS va is_admin() amal qiladi. Maxfiy
 * kalit ishlatilmaydi, sessiya saqlanmaydi va oʻzi yangilanmaydi.
 */
export function adminDb(accessToken: string): AdminDb {
  const env = adminEnv();
  if (!env) throw new Error("Panel sozlamalari toʻliq emas");
  return createClient<Database>(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` }, fetch: noStoreFetch },
  });
}
