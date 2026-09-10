import { DEFAULT_LOCALE, LOCALE_META } from "@/i18n/locales";
import "@/styles/globals.css";

/**
 * Til prefiksisiz kelgan nomaʼlum manzil uçun. Bu yerda tarjima yöq —
 * qaysi til kerakligini bilmaymiz, şuning uçun asosiy tilga qaytaramiz.
 */
export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="grid min-h-dvh place-items-center p-8">
        <div className="flex max-w-md flex-col items-center gap-5 text-center">
          <h1 className="text-3xl">404</h1>
          <a
            href={LOCALE_META[DEFAULT_LOCALE].prefix}
            className="rounded-btn bg-blue-cta px-6 py-3 font-display font-bold text-ink-inverse"
          >
            Bosh sahifa
          </a>
        </div>
      </body>
    </html>
  );
}
