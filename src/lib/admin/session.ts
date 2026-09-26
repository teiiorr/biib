import "server-only";

import { cookies } from "next/headers";

import type { AdminEnv } from "./env";
import { authClient } from "./supabase";

/* Mahalliy http da Secure cookie saqlanmaydi; ishlab chiqarishda __Secure- oldqoʻshimchasi brauzerni
   bu cookie ni faqat HTTPS orqali va Secure belgisi bilan qabul qilishga majbur qiladi. */
const SECURE = process.env.NODE_ENV === "production";
const PREFIX = SECURE ? "__Secure-" : "";
const ACCESS_COOKIE = `${PREFIX}biib_at`;
const REFRESH_COOKIE = `${PREFIX}biib_rt`;
const ACCESS_MAX_AGE = 60 * 60;
const REFRESH_MAX_AGE = 14 * 24 * 60 * 60;

/* Lax: Telegram yoki pochtadagi /admin havolasi sessiyani yoʻqotmaydi; Path=/admin — ommaviy sahifalarga
   bu cookie lar umuman yuborilmaydi. */
const BASE = { httpOnly: true, secure: SECURE, sameSite: "lax", path: "/admin" } as const;

export interface StoredTokens {
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
}

export interface AdminSession {
  readonly userId: string;
  readonly accessToken: string;
  /** Unix soniyalarida. */
  readonly expiresAt: number;
}

interface IssuedSession {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly expires_in: number;
  readonly expires_at?: number | undefined;
  readonly user: { readonly id: string };
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export async function readTokens(): Promise<StoredTokens> {
  const store = await cookies();
  return {
    accessToken: store.get(ACCESS_COOKIE)?.value || null,
    refreshToken: store.get(REFRESH_COOKIE)?.value || null,
  };
}

/** Faqat server amali va Route Handler ichida: render paytida cookie yozib boʻlmaydi. */
export async function writeTokens(session: IssuedSession): Promise<void> {
  const store = await cookies();
  const accessAge = Math.max(60, Math.min(session.expires_in, ACCESS_MAX_AGE));
  store.set({ ...BASE, name: ACCESS_COOKIE, value: session.access_token, maxAge: accessAge });
  store.set({
    ...BASE,
    name: REFRESH_COOKIE,
    value: session.refresh_token,
    maxAge: REFRESH_MAX_AGE,
  });
}

export async function clearTokens(): Promise<void> {
  const store = await cookies();
  /* Oʻchirish sarlavhasi ham xuddi shu Path va Secure bilan: aks holda brauzer eski cookie ni qoldiradi. */
  store.delete({ ...BASE, name: ACCESS_COOKIE });
  store.delete({ ...BASE, name: REFRESH_COOKIE });
}

/** Kirish tokeni imzosi, muddati va egasi tekshiriladi; yaroqsiz boʻlsa null (xato tashlanmaydi). */
export async function verifyAccess(env: AdminEnv, token: string): Promise<AdminSession | null> {
  try {
    const { data, error } = await authClient(env).auth.getClaims(token);
    if (error || !data) return null;
    const { sub, exp } = data.claims;
    if (sub !== env.adminUserId || typeof exp !== "number") return null;
    return { userId: sub, accessToken: token, expiresAt: exp };
  } catch {
    return null;
  }
}

/** Yangi sessiya faqat panel egasiniki boʻlsa saqlanadi. */
export async function acceptSession(
  env: AdminEnv,
  session: IssuedSession | null,
): Promise<AdminSession | null> {
  if (!session || session.user.id !== env.adminUserId) return null;
  await writeTokens(session);
  return {
    userId: session.user.id,
    accessToken: session.access_token,
    expiresAt: session.expires_at ?? nowSeconds() + session.expires_in,
  };
}

/** Yangilash tokeni bilan yangi juftlik: eski yangilash tokeni Supabase da bir martalik. */
export async function refreshTokens(
  env: AdminEnv,
  refreshToken: string,
): Promise<AdminSession | null> {
  try {
    const { data, error } = await authClient(env).auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (error) return null;
    return await acceptSession(env, data.session);
  } catch {
    return null;
  }
}
