"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Mobilda — pastdan çiqadigan şit, desktopda — markazdagi modal.
 * Radix fokusni ipatib turadi, Escape ni tutadi va body skrollini
 * skrollbar kengligini qoplagan holda bloklaydi.
 *
 * İçki kontent qattiq: şişa ustiga şişa qöyilmaydi (§3).
 */

/** Şu masofadan kop tortilsa — yopiladi, aks holda joyiga qaytadi. */
const DISMISS_PX = 96;

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    start.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (start.current === null || !panel.current) return;
    const delta = Math.max(0, event.clientY - start.current);
    // Qayta render qilmaymiz: barmoq ortidan faqat transform yuradi.
    panel.current.style.transform = `translateY(${delta}px)`;
    panel.current.style.transition = "none";
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (start.current === null || !panel.current) return;
    const delta = Math.max(0, event.clientY - start.current);
    start.current = null;

    panel.current.style.transition = "";
    panel.current.style.transform = "";
    if (delta > DISMISS_PX) onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[var(--z-modal)] bg-black/32 backdrop-blur-[2px]",
            "data-[state=open]:animate-[veil-in_var(--dur-base)_var(--ease-standard)]",
          )}
        />
        <Dialog.Content
          ref={panel}
          aria-describedby={description ? undefined : undefined}
          className={cn(
            "glass glass--thick fixed z-[var(--z-modal)] flex flex-col",
            "inset-x-0 bottom-0 max-h-[92svh] rounded-t-xl rounded-b-none",
            "pb-[env(safe-area-inset-bottom)]",
            "md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[min(560px,calc(100vw-2rem))]",
            "md:max-h-[85svh] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:pb-0",
            "data-[state=open]:animate-[sheet-in_var(--dur-slow)_var(--ease-standard)]",
          )}
        >
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="flex shrink-0 cursor-grab touch-none justify-center py-3 md:hidden"
          >
            <span aria-hidden="true" className="block h-[5px] w-9 rounded-pill bg-label-quaternary" />
          </div>

          <div className="flex shrink-0 items-start justify-between gap-4 px-5 pb-3 pt-2 md:pt-5">
            <div>
              <Dialog.Title className="text-title3">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-callout text-label-secondary">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>

          {footer ? (
            <div className="shrink-0 border-t border-separator px-5 py-4">{footer}</div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
