"use client";

import { useRef, useState } from "react";

import { GlassSheet } from "@/components/glass/GlassSheet";
import { Button } from "@/components/ui/Button";
import { ADMIN_COPY } from "@/lib/admin/copy";

import { AdminNav } from "./AdminNav";
import { AdminNavFoot } from "./AdminNavFoot";

/** Telefon va planshet: yuqori paneldagi tugma boʻlimlar varagʻini ochadi (tugmadan morf bilan). */
export function AdminMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  return (
    <GlassSheet
      open={open}
      onOpenChange={setOpen}
      morphFrom={triggerRef}
      title={ADMIN_COPY.nav.menu}
      closeLabel={ADMIN_COPY.nav.closeMenu}
      testId="admin-menu-sheet"
      className="admin-sheet"
      trigger={
        <Button
          ref={triggerRef}
          variant="glass"
          size="48"
          icon="menu"
          iconOnly
          aria-label={ADMIN_COPY.nav.openMenu}
          aria-haspopup="dialog"
        />
      }
    >
      <AdminNav idPrefix="sheet" onNavigate={() => setOpen(false)} />
      <AdminNavFoot />
    </GlassSheet>
  );
}
