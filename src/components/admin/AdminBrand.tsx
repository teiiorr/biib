import Link from "next/link";

import { BrandLogo, type BrandLogoSize } from "@/components/ui/BrandLogo";
import { ADMIN_COPY } from "@/lib/admin/copy";

interface AdminBrandProps {
  readonly size?: BrandLogoSize;
}

/** Panel belgisi: oltin logotip va panel nomi, bosh sahifaga (Boshqaruv) olib boradi. */
export function AdminBrand({ size = 40 }: AdminBrandProps) {
  return (
    <Link href="/admin" className="admin-brand">
      <BrandLogo alt="" size={size} eager />
      <span className="admin-brand-text">
        <span className="t-label text-trim">{ADMIN_COPY.title}</span>
        <span className="sr-only">: {ADMIN_COPY.brand}</span>
      </span>
    </Link>
  );
}
