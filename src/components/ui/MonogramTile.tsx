import { GirihStar } from "@/components/ornament/GirihStar";

/**
 * Tasdiq kutilayotgan odam uchun 64 × 64 belgi: sokin zamin va kichik sakkiz qirrali girih yulduzi.
 * Yuz oʻylab topilmaydi, boʻsh 3:4 ramka ham qolmaydi.
 */
export function MonogramTile() {
  return (
    <span className="monogram-tile" aria-hidden="true">
      <GirihStar symmetry={8} size={20} ring={false} className="monogram-mark" />
    </span>
  );
}
