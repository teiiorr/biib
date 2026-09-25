"use client";

import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

import { Icon } from "@/components/icons/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import type { PageKey } from "@/i18n/routes";

export interface AboutMenuItem {
  readonly key: PageKey;
  readonly label: string;
  readonly href: string;
  readonly current: boolean;
}

/** Zardoʻzi chizmalari serverda chiziladi va shu yerga tayyor element boʻlib keladi: geometriya kodi mijozga kirmaydi. */
export interface NavMarks {
  readonly underline: ReactNode;
  readonly mark: ReactNode;
}

export interface AboutMenuProps {
  readonly dict: Dictionary["nav"];
  readonly items: readonly AboutMenuItem[];
  readonly active: boolean;
  readonly marks: NavMarks;
}

interface AboutTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  readonly dict: Dictionary["nav"];
  readonly active: boolean;
  readonly marks: NavMarks;
  readonly ref?: Ref<HTMLButtonElement>;
}

/** Guruh tugmasi: zardoʻzi ostchiziq va faol belgi; menyu kelguncha ham shu koʻrinish. */
export function AboutTrigger({ dict, active, marks, ref, ...rest }: AboutTriggerProps) {
  return (
    <button
      ref={ref}
      type="button"
      className="nav-item zardozi-host t-label"
      data-active={active ? "true" : undefined}
      aria-haspopup="menu"
      {...rest}
    >
      <span className="text-trim">{dict.aboutGroup}</span>
      <Icon name="chevron-down" size={16} />
      {marks.underline}
      {active ? marks.mark : null}
    </button>
  );
}
