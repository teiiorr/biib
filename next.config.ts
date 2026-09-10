import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // messages/uz-Latn.d.json.ts yaratadi — t() kalitlari tekşiriladi.
    createMessagesDeclaration: "./messages/uz-Latn.json",
  },
});

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 — portretlar uçun; 75 da yumşoq soyalar zinapoyaga aylanadi.
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
