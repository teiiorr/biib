/* Yozuv hech qachon tarjima qilinmaydi: har tilda va har mavzuda aynan shu ikki qator. */
const WORDMARK = ["BOLALAR IJODKORLIGI", "IJODIY BIRLASHMASI"] as const;

/**
 * Ekran oʻquvchidan yashirin, nom joriy tilda sr-only matnda beriladi. Hook ishlatilmaydi: mijozdagi
 * sarlavha ham, server chizadigan global 404 ham shu bitta nusxadan foydalanadi.
 */
export function BrandName() {
  return (
    <span className="brand-name" lang="uz-Latn" aria-hidden="true">
      <span>{WORDMARK[0]}</span>
      <span>{WORDMARK[1]}</span>
    </span>
  );
}
