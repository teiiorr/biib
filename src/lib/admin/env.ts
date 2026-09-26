import "server-only";

export interface AdminEnv {
  readonly url: string;
  readonly key: string;
  readonly adminUserId: string;
}

/**
 * Panel sozlamalari faqat serverda oʻqiladi. Biri yoʻq boʻlsa panel yopiq: kirish ham, yozish ham yoʻq.
 * ADMIN_USER_ID ikkinchi qulf — maʼlumotlar bazasidagi is_admin() ga qoʻshimcha tekshiruv.
 */
export function adminEnv(): AdminEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!url || !key || !adminUserId) return null;
  return { url, key, adminUserId };
}

/** Vercel sinov nusxasi bazani asosiy sayt bilan boʻlishadi, keshni esa yoʻq: u yerdan yozish taqiq. */
export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
