import "server-only";

/** bundled: repodagi snapshot.json (standart, mahalliy va verify). supabase: maʼlumotlar bazasi (Vercel). */
export type ContentSource = "bundled" | "supabase";

export function contentSource(): ContentSource {
  const value = process.env.CONTENT_SOURCE?.trim() || "bundled";
  /* Xato yozilgan qiymat jimgina zaxiraga tushib qolmasin: yigʻish shu yerda toʻxtaydi. */
  if (value !== "bundled" && value !== "supabase")
    throw new Error(`CONTENT_SOURCE notoʻgʻri: «${value}» (bundled yoki supabase)`);
  return value;
}

/** Ommaviy oʻqish uchun manzil va publishable kalit; faqat serverda oʻqiladi. */
export function supabaseReadConfig(): { readonly url: string; readonly key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key)
    throw new Error(
      "CONTENT_SOURCE=supabase, lekin NEXT_PUBLIC_SUPABASE_URL yoki NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY yoʻq",
    );
  return { url: url.replace(/\/+$/, ""), key };
}
