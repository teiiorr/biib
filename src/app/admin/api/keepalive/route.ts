import { fetchRemoteSnapshot } from "@/lib/cms/remote";

export const dynamic = "force-dynamic";

/**
 * Kunlik uygʻotish (Vercel Cron, vercel.json): bepul tarifda Supabase loyihasi bir hafta jim tursa
 * uxlab qoladi. Bitta content_snapshot() soʻrovi faollik hisoblanadi va shakl ham tekshiriladi.
 * Faqat Vercel yuborgan maxfiy kalit bilan: boshqa har qanday chaqiruv 401.
 */
export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401, headers: { "cache-control": "no-store" } });
  }
  try {
    const snapshot = await fetchRemoteSnapshot();
    return Response.json(
      { ok: true, news: snapshot.news.length },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json({ ok: false }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
