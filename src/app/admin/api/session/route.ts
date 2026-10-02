import type { NextRequest } from "next/server";

import { adminEnv } from "@/lib/admin/env";
import { loginPath, safeNext } from "@/lib/admin/paths";
import { clearTokens, readTokens, refreshTokens, verifyAccess } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

/**
 * Sahifa chizilayotganda tokenni yangilay olmaydi, shu sabab muddati oʻtganda shu yerga keladi. Yangi
 * tokenlar cookie sifatida yoziladi va 303 bilan oʻsha sahifaga, boʻlmasa kirish sahifasiga qaytiladi.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const env = adminEnv();
  const { accessToken, refreshToken } = await readTokens();
  const refreshed = env && refreshToken ? await refreshTokens(env, refreshToken) : null;
  /* Yangi token shu yerda tekshiriladi: JWKS manziliga yetib boʻlmasa ham sahifa bilan bu yoʻl orasida
     cheksiz yoʻnaltirish boʻlmaydi, kirish sahifasida toʻxtaydi. */
  const session = env && refreshed ? await verifyAccess(env, refreshed.accessToken) : null;
  if (!session && (accessToken || refreshToken)) await clearTokens();
  /* Nisbiy manzil proksi ortida ham host sarlavhasiga bogʻliq boʻlmaydi. */
  return new Response(null, {
    status: 303,
    headers: { location: session ? next : loginPath(next), "cache-control": "no-store" },
  });
}
