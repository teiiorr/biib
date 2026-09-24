"use client";

import { useRef, useState } from "react";

import { GlassDialog } from "@/components/glass/GlassDialog";
import { GlassSheet } from "@/components/glass/GlassSheet";
import { useFocusTrigger } from "@/components/glass/useLazyOverlay";
import { RavoqFrame } from "@/components/ornament/RavoqFrame";
import { Text } from "@/components/ui/Text";
import { useIsDesktop } from "@/lib/appearance/media";

import { PersonTrigger, type PersonDialogProps } from "./PersonTrigger";

export interface PersonDialogPanelProps extends PersonDialogProps {
  readonly initialOpen: boolean;
  readonly focusTrigger: boolean;
}

/** Ekspert kartasi bosilganda oyna dialogi (kompyuter) yoki varaq (telefon) bilan qisqacha maʼlumot. */
export default function PersonDialogPanel({
  name,
  role,
  field,
  bio,
  openLabel,
  closeLabel,
  dialogLabel,
  initialOpen,
  focusTrigger,
}: PersonDialogPanelProps) {
  const [open, setOpen] = useState(initialOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useFocusTrigger(triggerRef, focusTrigger && !initialOpen);
  const desktop = useIsDesktop();
  const trigger = (
    <PersonTrigger
      ref={triggerRef}
      label={openLabel}
      aria-expanded={open}
      onClick={() => setOpen(true)}
    />
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
