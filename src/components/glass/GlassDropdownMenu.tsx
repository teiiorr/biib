"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Surface } from "./Surface";
import { useMorph } from "./useMorph";

export interface GlassMenuItem {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly href?: string;
  readonly onSelect?: () => void;
  readonly current?: boolean;
  /** Til menyusi uchun: har band oʻz tilini eʼlon qiladi. */
  readonly lang?: string;
  readonly hrefLang?: string;
  readonly icon?: ReactNode;
}

export interface GlassDropdownMenuProps {
  readonly trigger: ReactNode;
  readonly label: string;
  readonly items: ReadonlyArray<GlassMenuItem>;
  readonly align?: "start" | "center" | "end";
  readonly testId?: string;
  readonly className?: string;
  readonly currentLabel?: string;
  /** Kech yuklangan panel: tugma allaqachon bosilgan boʻlsa ochiq holda chiziladi. */
  readonly initialOpen?: boolean;
}

/** Oyna ustidagi tushuvchi menyu: trigger paneli ichiga morf boʻladi. */
export function GlassDropdownMenu({
  trigger,
  label,
  items,
  align = "end",
  testId,
  className,
  currentLabel,
  initialOpen = false,
}: GlassDropdownMenuProps) {
  const [open, setOpen] = useState(initialOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  useMorph(open, triggerRef, panelRef);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger asChild ref={(node) => void (triggerRef.current = node)}>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          asChild
          align={align}
          sideOffset={8}
          collisionPadding={16}
          aria-label={label}
        >
          <Surface
            ref={panelRef}
            as="div"
            radius="panel"
            padding={8}
            text
            className={cn("surface-morph glass-menu z-overlay", className)}
            data-testid={testId}
          >
            {items.map((item) => {
              const content = (
                <>
                  {item.icon}
                  <span className="glass-menu-text">
                    <span className="t-label text-trim">{item.label}</span>
                    {item.hint ? (
                      <span className="t-micro glass-menu-hint">{item.hint}</span>
                    ) : null}
                  </span>
                  {item.current && currentLabel ? (
                    <span className="sr-only">{currentLabel}</span>
                  ) : null}
                </>
              );
              const itemClass = cn("glass-menu-item", item.current && "is-current");
              return (
                <DropdownMenu.Item
                  key={item.id}
                  asChild
                  {...(item.onSelect ? { onSelect: item.onSelect } : {})}
                  className={itemClass}
                  data-current={item.current ? "true" : undefined}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      lang={item.lang}
                      hrefLang={item.hrefLang}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button type="button">{content}</button>
                  )}
                </DropdownMenu.Item>
              );
            })}
          </Surface>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
