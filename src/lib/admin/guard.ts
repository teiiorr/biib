import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { ADMIN_COPY } from "./copy";
import { adminEnv, isPreviewDeployment } from "./env";
import { ADMIN_HOME, loginPath, refreshPath, safeNext, type AdminPath } from "./paths";
import {
  clearTokens,
  nowSeconds,
  readTokens,
  refreshTokens,
  verifyAccess,
  type AdminSession,
} from "./session";

/* Amal ichida token shu muddatdan kam qolgan boʻlsa oldindan yangilanadi: uzun tahrir yarmida uzilmaydi. */
const REFRESH_MARGIN_S = 20 * 60;

/** Bitta soʻrov ichida (layout va sahifa) token bir marta tekshiriladi. */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const env = adminEnv();
  if (!env) return null;
  const { accessToken } = await readTokens();
  return accessToken ? verifyAccess(env, accessToken) : null;
});

/**
 * Sahifa chizilayotganda cookie yozib boʻlmaydi: muddati oʻtgan token yangilash yoʻliga
 * (Route Handler) yuboriladi, u yangi juftlikni yozib, shu sahifaga qaytaradi.
 */
export async function requireAdmin(next: AdminPath = ADMIN_HOME): Promise<AdminSession> {
  const session = await getAdminSession();
  if (session) return session;
  const target = safeNext(next);
  const { refreshToken } = await readTokens();
  redirect(refreshToken && adminEnv() ? refreshPath(target) : loginPath(target));
}

interface ActionGuardOptions {
  /** false: sessiyani saqlash va chiqish kabi kontentga tegmaydigan amallar. */
  readonly write?: boolean;
}

/**
 * Har server amali shu chaqiruvdan boshlanadi. Amal cookie yoza oladi, shu sabab token kerak boʻlsa
 * shu yerning oʻzida yangilanadi.
 */
export async function requireAdminAction(options: ActionGuardOptions = {}): Promise<AdminSession> {
  const env = adminEnv();
  if (!env) redirect(loginPath(ADMIN_HOME));
  const { accessToken, refreshToken } = await readTokens();
  const current = accessToken ? await verifyAccess(env, accessToken) : null;
  let session = current;
  if (!current || current.expiresAt - nowSeconds() < REFRESH_MARGIN_S) {
    const refreshed = refreshToken ? await refreshTokens(env, refreshToken) : null;
    session = refreshed ?? current;
  }
  if (!session) {
    await clearTokens();
    redirect(loginPath(ADMIN_HOME));
  }
  if (options.write !== false && isPreviewDeployment()) {
    throw new Error(ADMIN_COPY.errors.previewReadOnly);
  }
  return session;
}
