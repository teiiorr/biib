"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/admin/actions/auth";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";

import { AdminIcon } from "./AdminIcon";
import { ConfirmDialog } from "./ConfirmDialog";

const S = SYSTEM_COPY.security;

/** «Hamma qurilmalardan chiqish»: tasdiqdan keyin hamma sessiya bekor, kirish sahifasi ochiladi. */
export function SignOutEverywhere() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  return (
    <>
      <div className="admin-actions">
        <Button
          variant="glass"
          size="48"
          graphic={<AdminIcon name="log-out" size={20} />}
          onClick={() => setOpen(true)}
          data-testid="admin-signout-all"
        >
          {S.signOutAll}
        </Button>
      </div>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={S.signOutTitle}
        text={S.signOutText}
        confirmLabel={S.signOutAll}
        confirmGraphic={<AdminIcon name="log-out" size={20} />}
        onConfirm={() => startTransition(() => signOut())}
        pending={pending}
        danger
      />
    </>
  );
}
