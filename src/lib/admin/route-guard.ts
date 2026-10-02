import "server-only";

import { ADMIN_COPY } from "./copy";
import { adminEnv, isPreviewDeployment } from "./env";
import { readTokens, refreshTokens, verifyAccess, type AdminSession } from "./session";

/** Panel javoblari keshlanmaydi va brauzer MIME turini taxmin qilmaydi. */
export function adminJson(status: number, body: unknown): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}

/**
 * Yuklash yoʻllari faqat oʻz sahifamizdan (Origin), maxsus sarlavha va tirik sessiya bilan ochiladi:
 * boshqa saytdan kelgan soʻrov CORS tekshiruvidan oʻtolmaydi. Yoʻnaltirish oʻrniga 401 JSON qaytadi,
 * chunki yuklovchi uni oʻqib xabar koʻrsatadi. Muddati oʻtgan token shu yerda yangilanadi.
 */
export async function requireAdminRoute(request: Request): Promise<AdminSession | Response> {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return adminJson(403, { error: "origin" });
  }
  if (request.headers.get("x-biib-admin") !== "1") return adminJson(403, { error: "header" });
  const env = adminEnv();
  if (!env) return adminJson(503, { error: "closed" });
  const { accessToken, refreshToken } = await readTokens();
  let session = accessToken ? await verifyAccess(env, accessToken) : null;
  if (!session && refreshToken) session = await refreshTokens(env, refreshToken);
  if (!session) return adminJson(401, { error: "session" });
  if (isPreviewDeployment()) {
    return adminJson(403, { error: "preview", message: ADMIN_COPY.errors.previewReadOnly });
  }
  return session;
}
