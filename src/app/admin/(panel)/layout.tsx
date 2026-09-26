import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { SessionKeeper } from "@/components/admin/SessionKeeper";
import { getAdminSession } from "@/lib/admin/guard";

interface PanelLayoutProps {
  readonly children: ReactNode;
}

/**
 * Qobiq faqat tekshirilgan sessiya bilan chiziladi. Yoʻnaltirishni esa sahifa qiladi (requireAdmin):
 * layout yoʻlni bilmaydi va navigatsiyada qayta chizilmaydi, sahifa esa oʻz yoʻlini «next» ga qoʻyadi —
 * muddati oʻtgan sessiyadan keyin aynan oʻsha sahifaga qaytiladi. Sessiyasiz sahifa qobiqsiz, lekin
 * daraxtda qoladi: uning yoʻnaltirishi birinchi baytdan oldin tushadi va javob 307 boʻladi (oqimdagi
 * mijoz yoʻnaltirishi emas). Tekshiruv soʻrov ichida bir marta (React cache).
 */
export default async function PanelLayout({ children }: PanelLayoutProps) {
  if (!(await getAdminSession())) return children;
  return (
    <AdminShell>
      {children}
      <SessionKeeper />
    </AdminShell>
  );
}
