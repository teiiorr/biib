import { BrandLogo } from "./BrandLogo";

/**
 * Surati tasdiq kutilayotgan odam uchun 64 × 64 tinch plitka, markazda birlashma belgisi.
 * Yuz oʻylab topilmaydi; holat matni plitka yonida yoziladi, shu sabab plitka bezak.
 */
export function PersonPlaceholder() {
  return (
    <span className="person-placeholder" aria-hidden="true">
      <BrandLogo alt="" size={32} />
    </span>
  );
}
