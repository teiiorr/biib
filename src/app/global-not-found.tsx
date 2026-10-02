import { GlobalNotFoundDocument } from "./_global/GlobalNotFoundDocument";
import { siteUrl } from "@/lib/site";

import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL(siteUrl()),
  robots: { index: false, follow: false },
};

/** Marshrutlar xaritasidan tashqari yoʻl uchun: layout yoʻq, shu sabab toʻliq hujjat qaytadi. */
export default function GlobalNotFound() {
  return <GlobalNotFoundDocument />;
}
