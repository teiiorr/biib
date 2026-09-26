import { GlobalNotFoundDocument } from "./_global/GlobalNotFoundDocument";

import "@/styles/globals.css";

/**
 * Ildiz chegarasi: nomaʼlum til (/zz) [locale] layoutining oʻzida notFound() beradi, uni faqat shu
 * darajadagi chegara ushlaydi. Layout yoʻq, shu sabab toʻliq hujjat — global 404 bilan bir xil.
 */
export default function RootNotFound() {
  return <GlobalNotFoundDocument />;
}
