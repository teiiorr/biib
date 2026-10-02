import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { SessionKeeper } from "@/components/admin/SessionKeeper";
import { getAdminSession } from "@/lib/admin/guard";

interface PanelLayoutProps {
  readonly children: ReactNode;
}

/**
 * Qobiq faqat tekshirilgan sessiya bilan chiziladi, yoʻnaltirishni esa sahifa qiladi: layout yoʻlni
 * bilmaydi, sahifa esa oʻz yoʻlini «next» parametriga yozadi va sessiya tugagach unga qaytiladi.
 * Sessiyasiz sahifa daraxtda qoladi, shunda yoʻnaltirish oqim boshlanmasdan 307 javobi boʻlib tushadi.
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
