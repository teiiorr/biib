import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { preload } from "react-dom";

import { AdminIconSprite } from "@/components/admin/AdminIconSprite";
import { IconSprite } from "@/components/icons/IconSprite";
import { SkipLink } from "@/components/layout/SkipLink";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { fontPreloads } from "@/lib/fonts";

import "@/styles/globals.css";
import "@/styles/admin.css";
import "@/styles/admin-pages.css";
import "@/styles/admin-editor.css";
import "@/styles/admin-media.css";
import "@/styles/admin-tables.css";
import "@/styles/admin-people.css";
import "@/styles/admin-org.css";
import "@/styles/admin-gallery.css";

/* Sessiya cookie qiymati har soʻrovda oʻqiladi, shu sabab panel sahifalari oldindan yigʻilmaydi. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: ADMIN_COPY.title, template: `%s · ${ADMIN_COPY.title}` },
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#0a1026",
};

interface AdminLayoutProps {
  readonly children: ReactNode;
}

/**
 * Tokenlar, oyna va shriftlar sayt bilan bir xil, lekin koʻrinish skripti, ovoz, silliq skroll, sarlavha,
 * tab-bar va futer yoʻq. Mavzu faqat tungi, til faqat oʻzbek lotini.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  for (const href of fontPreloads("uz")) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }
  return (
    <html lang="uz-Latn" data-theme="dark" data-motion="on" data-admin="">
      <body className="admin-body">
        <IconSprite />
        <AdminIconSprite />
        <SkipLink label={ADMIN_COPY.skipToContent} />
        {children}
      </body>
    </html>
  );
}
