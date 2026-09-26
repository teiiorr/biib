import type { ReactNode } from "react";

import { Surface } from "@/components/glass/Surface";

import { AdminBrand } from "./AdminBrand";
import { AdminMenu } from "./AdminMenu";
import { AdminNav } from "./AdminNav";
import { AdminNavFoot } from "./AdminNavFoot";

interface AdminShellProps {
  readonly children: ReactNode;
}

/**
 * ≥ 1024 px: chapda qotirilgan oyna yon panel (belgi, guruhlangan boʻlimlar, pastda sayt va chiqish).
 * Kichikroq ekranda: yuqorida yupqa oyna panel va boʻlimlar varagʻi. Ekranda bir vaqtda bitta suzuvchi
 * oyna: yon panel yoki yuqori panel.
 */
export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="admin-frame">
      <header className="admin-topbar-wrap">
        <Surface as="div" radius="control" padding={4} text className="admin-topbar">
          <AdminBrand size={32} />
          <AdminMenu />
        </Surface>
      </header>
      <Surface as="div" radius="panel" padding={12} text className="admin-sidebar">
        <AdminBrand />
        <AdminNav idPrefix="side" />
        <AdminNavFoot />
      </Surface>
      <main id="content" className="admin-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
