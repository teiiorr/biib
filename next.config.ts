import type { NextConfig } from "next";

// Statik sahifalar uchun CSP: Next oʻz yuklovchi skriptlarini inline qoʻyadi,
// nonce esa dinamik renderga majbur qilardi, shu sabab 'unsafe-inline'.
/* Ishlab chiqish rejimida React eval() ishlatadi; ishlab chiqarishda hech qachon. */
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

/* Yuklangan rasmlar Supabase ochiq bucketida; manzil berilmasa /uploads faqat public/uploads dan.
   Panel brauzerdan Supabase ga toʻgʻridan-toʻgʻri yuklaydi (imzoli URL) va blob: oldindan koʻrishni
   ishlatadi: ruxsat faqat /admin da, ommaviy CSP bir bayt ham oʻzgarmaydi. */
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
  /* Imzoli yuklash URL larida kalit bor: panel hech qayerga manzil yubormaydi. */
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
    // 307: keyinroq til aniqlash qoʻshilsa kesh zaharlanmaydi.
    return [{ source: "/", destination: "/uz", permanent: false }];
  },
  async headers() {
    /* Bir kalit ikki yozuvda boʻlsa oxirgisi gʻolib (headers.md): panel yozuvi umumiydan keyin. */
    return [
      { source: "/(.*)", headers: securityHeaders },
      /* Fayl nomida mazmun xeshi bor: nusxa hech qachon oʻzgarmaydi. */
      {
        source: "/uploads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
  /* Massiv = afterFiles: public/uploads ga tortilgan fayl ustun, baza toʻxtasa ham ishlaydi. */
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
