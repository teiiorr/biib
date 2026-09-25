"use client";

import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

import { cx } from "@/lib/cx";

export interface GlassSliderProps {
  readonly value: number;
  readonly onValueChange: (value: number) => void;
  readonly onValueCommit?: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  /** Ekran oʻquvchisi uchun mahalliylashtirilgan qiymat, masalan «50%». */
  readonly valueText: (value: number) => string;
  readonly label: string;
  readonly id?: string;
  readonly className?: string;
}

export function GlassSlider({
  value,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  valueText,
  label,
  id,
  className,
}: GlassSliderProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <Slider.Root
      className={cx("glass-slider", className)}
      value={[value]}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={(values) => {
        const next = values[0];
        if (next !== undefined) onValueChange(next);
      }}
      onValueCommit={(values) => {
        const next = values[0];
        if (next !== undefined) onValueCommit?.(next);
      }}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onLostPointerCapture={() => setDragging(false)}
      data-dragging={dragging ? "true" : undefined}
    >
      <Slider.Track className="glass-slider-track">
        <Slider.Range className="glass-slider-range" />
      </Slider.Track>
      <Slider.Thumb
        className="glass-slider-thumb"
        id={id}
        aria-label={label}
        aria-valuetext={valueText(value)}
      >
        <span className="glass-slider-cap" aria-hidden="true" />
        <span className="glass-slider-lens" aria-hidden="true">
          <span className="glass-slider-lens-track" />
        </span>
      </Slider.Thumb>
    </Slider.Root>
  );
}
