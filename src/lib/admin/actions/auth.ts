"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { SignInState } from "../auth-state";
import { adminEnv } from "../env";
import { requireAdminAction } from "../guard";
import { LOGIN_PATH, safeNext } from "../paths";
import { acceptSession, clearTokens, readTokens, type AdminSession } from "../session";
import { authClient } from "../supabase";

/* Muvaffaqiyatsiz urinish doim bir xil vaqt oladi: javob tezligidan pochta mavjudligini bilib boʻlmaydi. */
const FAIL_DELAY_MS = 800;

const credentials = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(512),
});

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const env = adminEnv();
  if (!env) return { status: "closed" };
  const email = String(formData.get("email") ?? "").trim();
  const parsed = credentials.safeParse({ email, password: formData.get("password") });
  let session: AdminSession | null = null;
  if (parsed.success) {
    try {
      const client = authClient(env);
      const { data, error } = await client.auth.signInWithPassword(parsed.data);
      if (!error && data.session) {
        session = await acceptSession(env, data.session);
        /* Admin emas: sessiya darhol bekor qilinadi, javob esa oddiy xatodan farq qilmaydi. */
        if (!session) await client.auth.signOut({ scope: "local" });
      }
    } catch {
      session = null;
    }
  }
  if (!session) {
    await pause(FAIL_DELAY_MS);
    return { status: "invalid", email: email.slice(0, 254) };
  }
  redirect(safeNext(formData.get("next")));
}

/** Hamma qurilmadagi sessiyalar bekor qilinadi, keyin cookie oʻchiriladi. */
export async function signOut(): Promise<void> {
  const env = adminEnv();
  const { accessToken, refreshToken } = await readTokens();
  if (env && refreshToken) {
    try {
      const client = authClient(env);
      const { error } = accessToken
        ? await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        : await client.auth.refreshSession({ refresh_token: refreshToken });
      if (!error) await client.auth.signOut({ scope: "global" });
    } catch {
      /* Tarmoq xatosi chiqishga xalaqit bermaydi: cookie baribir oʻchiriladi. */
    }
  }
  await clearTokens();
  redirect(LOGIN_PATH);
}

/** Ochiq panel sessiyasi: token tugashiga oz qolganda shu yerda yangilanadi. */
export async function keepSession(): Promise<void> {
  await requireAdminAction({ write: false });
}
