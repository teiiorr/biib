import { signOut } from "@/lib/admin/actions/auth";
import { ADMIN_COPY } from "@/lib/admin/copy";

import { AdminIcon } from "./AdminIcon";

/** Sayt yangi oynada ochiladi, tahrir shu oynada qolsin. Chiqish JavaScript oʻchiq boʻlsa ham ishlaydi. */
export function AdminNavFoot() {
  return (
    <div className="admin-nav-foot">
      <a href="/uz" target="_blank" rel="noopener noreferrer" className="admin-nav-item t-label">
        <AdminIcon name="external" />
        <span className="text-trim">{ADMIN_COPY.nav.openSite}</span>
        <span className="sr-only"> ({ADMIN_COPY.nav.newTab})</span>
      </a>
      <form action={signOut}>
        <button type="submit" className="admin-nav-item t-label">
          <AdminIcon name="log-out" />
          <span className="text-trim">{ADMIN_COPY.nav.logout}</span>
        </button>
      </form>
    </div>
  );
}
