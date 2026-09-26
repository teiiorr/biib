/* Egasining talabi: yozuv hech qachon oʻzgarmaydi — har tilda va har mavzuda aynan shu ikki qator. */
const WORDMARK = ["BOLALAR IJODKORLIGI", "IJODIY BIRLASHMASI"] as const;

/**
 * Brend yozuvi (ikki qator, lotin). Ekran oʻquvchisidan yashirin: nom joriy tilda sr-only matnda beriladi.
 * Hooksiz: sarlavhadagi mijoz belgisi ham, global 404 server hujjati ham shu bitta nusxani ishlatadi.
 */
export function BrandName() {
  return (
    <span className="brand-name" lang="uz-Latn" aria-hidden="true">
      <span>{WORDMARK[0]}</span>
      <span>{WORDMARK[1]}</span>
    </span>
  );
}
