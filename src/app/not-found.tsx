import { GlobalNotFoundDocument } from "./_global/GlobalNotFoundDocument";

import "@/styles/globals.css";

/**
 * Nomaʼlum til (/zz) [locale] layout ichida notFound() chaqiradi va uni faqat shu ildiz chegarasi
 * ushlaydi. Layout yoʻq, shu sabab global 404 kabi toʻliq hujjat qaytadi.
 */
export default function RootNotFound() {
  return <GlobalNotFoundDocument />;
}
