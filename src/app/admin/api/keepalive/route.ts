import { fetchRemoteSnapshot } from "@/lib/cms/remote";

export const dynamic = "force-dynamic";

/**
 * Supabase bepul tarifda bir hafta soʻrovsiz qolgan loyihani uxlatadi, shu sabab Vercel Cron uni har kuni
 * uygʻotadi. Faqat Vercel yuboradigan maxfiy kalit bilan ishlaydi, boshqa chaqiruvga 401 qaytadi.
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
