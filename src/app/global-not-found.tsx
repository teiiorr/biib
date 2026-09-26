import { GlobalNotFoundDocument } from "./_global/GlobalNotFoundDocument";
import { siteUrl } from "@/lib/site";

import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL(siteUrl()),
  robots: { index: false, follow: false },
};

/** Xaritadan tashqari yoʻl: marshrutlash darajasida, layoutsiz toʻliq hujjat. */
export default function GlobalNotFound() {
  return <GlobalNotFoundDocument />;
}
