import "server-only";

export interface AdminEnv {
  readonly url: string;
  readonly key: string;
  readonly adminUserId: string;
}

/**
 * Sozlamalardan bittasi yoʻq boʻlsa panel butunlay yopiq. ADMIN_USER_ID bazadagi is_admin()
 * tekshiruviga qoʻshimcha ikkinchi qulf.
 */
export function adminEnv(): AdminEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!url || !key || !adminUserId) return null;
  return { url, key, adminUserId };
}

/** Vercel sinov nusxasi bazani asosiy sayt bilan boʻlishadi, keshni emas: undan yozish taqiq. */
export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
