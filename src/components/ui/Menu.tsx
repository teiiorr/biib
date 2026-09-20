"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Poverover / menyu. Şişa — chrome ning qismi, radius lg, tarqoq soya.
 * Klaviatura boşqaruvi Radix dan: strelkalar, Home/End, Escape va
 * yopilganda fokusning triggerga qaytişi.
 */

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

export function MenuContent({
  children,
  align = "end",
  className,
}: {
  children: ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={8}
        collisionPadding={16}
        className={cn(
          "glass relative z-[var(--z-popover)] min-w-56 rounded-lg p-1.5 shadow-ambient",
          "origin-(--radix-dropdown-menu-content-transform-origin)",
          "data-[state=open]:animate-[popover-in_180ms_var(--ease-standard)]",
          className,
        )}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

export function MenuItem({
  children,
  onSelect,
  selected = false,
  lang,
}: {
  children: ReactNode;
  onSelect: () => void;
  selected?: boolean;
  lang?: string;
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      lang={lang}
      className={cn(
        "tap flex cursor-pointer items-center justify-between gap-4 rounded-sm px-3 py-2.5",
        "text-callout text-label outline-none",
        "data-[highlighted]:bg-accent-wash data-[highlighted]:text-accent-text",
        selected && "font-semibold",
      )}
    >
      {children}
    </DropdownMenu.Item>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu.Label className="px-3 pb-1 pt-2 text-caption text-label-secondary">
      {children}
    </DropdownMenu.Label>
  );
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className="my-1.5 h-px bg-separator" />;
}
