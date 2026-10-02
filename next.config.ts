import type { NextConfig } from "next";

// Next yuklovchi skriptlarini inline qoʻyadi, nonce esa sahifalarni dinamik chizishga majbur qilardi.
// eval() chaqiruviga ruxsat faqat dev rejimida kerak, React uni oʻsha yerdagina ishlatadi.
const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

/* Panel faylni imzoli manzil orqali toʻgʻridan-toʻgʻri Supabase omboriga yuklaydi va oldindan koʻrish
   uchun blob: ishlatadi. Bu ruxsatlar faqat /admin uchun, ommaviy sahifalar qoidasi oʻzgarmaydi. */
const supabaseOrigin = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
})();
const supabaseSource = supabaseOrigin ? ` ${supabaseOrigin}` : "";
const adminCsp = csp
  .replace("img-src 'self' data: blob:", `img-src 'self' data: blob:${supabaseSource}`)
  .replace("media-src 'self'", "media-src 'self' blob:")
  .replace("connect-src 'self'", `connect-src 'self'${supabaseSource}`);

const adminHeaders = [
  { key: "Content-Security-Policy", value: adminCsp },
  /* Imzoli yuklash manzilida kalit bor, u Referer orqali tashqariga chiqmasligi kerak. */
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    // 307: keyinroq tilni avtomatik aniqlash qoʻshilsa, keshda eski yoʻnaltirish qolib ketmaydi.
    return [{ source: "/", destination: "/uz", permanent: false }];
  },
  async headers() {
    /* Bir sarlavha ikki yozuvda boʻlsa oxirgisi ustun keladi, shuning uchun panel yozuvi eng oxirida. */
    return [
      { source: "/(.*)", headers: securityHeaders },
      /* Fayl nomida mazmun xeshi bor, shu nomdagi fayl hech qachon oʻzgarmaydi. */
      {
        source: "/uploads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
  /* Massiv afterFiles kabi ishlaydi: public/uploads papkasidagi fayl ustun turadi va baza toʻxtasa ham ochiladi. */
  async rewrites() {
    return supabaseOrigin
      ? [
          {
            source: "/uploads/:path*",
            destination: `${supabaseOrigin}/storage/v1/object/public/media/:path*`,
          },
        ]
      : [];
  },
};

export default nextConfig;
