"use client";

import { useRef, useState } from "react";

import { GlassDialog } from "@/components/glass/GlassDialog";
import { GlassSheet } from "@/components/glass/GlassSheet";
import { RavoqFrame } from "@/components/ornament/RavoqFrame";
import { Text } from "@/components/ui/Text";
import { useIsDesktop } from "@/lib/appearance/media";

interface PersonDialogProps {
  readonly name: string;
  readonly role: string;
  readonly field: string | null;
  readonly bio: string;
  readonly openLabel: string;
  readonly closeLabel: string;
  readonly dialogLabel: string;
}

/** Ekspert kartasi bosilganda oyna dialogi (kompyuter) yoki varaq (telefon) bilan qisqacha maʼlumot. */
export function PersonDialog({
  name,
  role,
  field,
  bio,
  openLabel,
  closeLabel,
  dialogLabel,
}: PersonDialogProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const desktop = useIsDesktop();
  const trigger = (
    <button
      ref={(node) => {
        triggerRef.current = node;
      }}
      type="button"
      className="people-open t-label"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
    >
      {openLabel}
    </button>
  );
  const body = (
    <div className="grid gap-3">
      <RavoqFrame ratio="3:4" role={role} className="mx-auto w-40" />
      {field ? (
        <Text as="p" size="small" tone="ink-3">
          {field}
        </Text>
      ) : null}
      <Text as="p">{bio}</Text>
    </div>
  );
  return desktop ? (
    <GlassDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      morphFrom={triggerRef}
      title={name}
      description={dialogLabel}
      closeLabel={closeLabel}
    >
      {body}
    </GlassDialog>
  ) : (
    <GlassSheet
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      morphFrom={triggerRef}
      title={name}
      closeLabel={closeLabel}
    >
      {body}
    </GlassSheet>
  );
}
