"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useEffect, useLayoutEffect, useRef } from "react";

import { cx } from "@/lib/cx";

import { Surface } from "./Surface";

export interface SegmentedOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

export interface SegmentedOrigin {
  readonly x: number;
  readonly y: number;
}

export interface SegmentedControlProps<T extends string> {
  readonly value: T;
  readonly options: ReadonlyArray<SegmentedOption<T>>;
  /** origin: tanlangan element markazi (viewport px), mavzu oʻtishi shu nuqtadan boshlanadi. */
  readonly onValueChange: (value: T, origin: SegmentedOrigin) => void;
  readonly label: string;
  readonly className?: string;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Linza: tanlangan element ostida prujina bilan suriladi (CSS FLIP, faqat transform). */
export function SegmentedControl<T extends string>({
  value,
  options,
  onValueChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  const rootRef = useRef<HTMLElement | null>(null);
  const lensRef = useRef<HTMLSpanElement | null>(null);
  const previous = useRef<{ x: number; width: number } | null>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const lens = lensRef.current;
    if (!root || !lens) return;
    const active = root.querySelector<HTMLElement>('[data-state="on"]');
    if (!active) return;
    const x = active.offsetLeft;
    const width = active.offsetWidth;
    const from = previous.current;
    previous.current = { x, width };
    lens.style.width = `${width}px`;
    if (!from || width === 0 || window.matchMedia(REDUCED_MOTION).matches) {
      lens.style.transform = `translateX(${x}px)`;
      return;
    }
    lens.style.transition = "none";
    lens.style.transform = `translateX(${from.x}px) scaleX(${from.width / width})`;
    void lens.offsetWidth;
    lens.style.transition = "";
    lens.style.transform = `translateX(${x}px)`;
  }, [value, options.length]);

  return (
    <Surface
      ref={rootRef}
      as="div"
      radius="control"
      padding={4}
      className={cx("segmented", className)}
    >
      <span ref={lensRef} className="segmented-lens" aria-hidden="true" />
      <ToggleGroup.Root
        type="single"
        value={value}
        aria-label={label}
        className="segmented-group"
        onValueChange={(next) => {
          if (!next) return;
          const option = options.find((item) => item.value === next);
          if (!option) return;
          const root = rootRef.current;
          const item = root?.querySelector<HTMLElement>(`[data-value="${next}"]`);
          const rect = item?.getBoundingClientRect();
          const origin = rect
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : { x: window.innerWidth / 2, y: 0 };
          onValueChange(option.value, origin);
        }}
      >
        {options.map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            data-value={option.value}
            className="segmented-item t-label text-trim"
          >
            <span className="segmented-label">{option.label}</span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </Surface>
  );
}
