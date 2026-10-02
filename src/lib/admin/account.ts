import "server-only";

import { adminEnv } from "./env";
import type { AdminSession } from "./session";
import { authClient } from "./supabase";

export interface AdminAccount {
  readonly email: string | null;
  readonly lastSignInAt: string | null;
}

/** Kirgan adminning pochtasi va oxirgi kirish vaqti (Supabase Auth); olinmasa null. */
export async function loadAccount(session: AdminSession): Promise<AdminAccount | null> {
  const env = adminEnv();
  if (!env) return null;
  try {
    const { data, error } = await authClient(env).auth.getUser(session.accessToken);
    if (error || data.user.id !== session.userId) return null;
    return { email: data.user.email ?? null, lastSignInAt: data.user.last_sign_in_at ?? null };
  } catch {
    return null;
  }
}
